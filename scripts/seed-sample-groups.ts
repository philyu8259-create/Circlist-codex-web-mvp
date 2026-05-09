import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { categories } from "../src/lib/domain";
import { sampleGroups } from "../src/lib/mock-data";
import type { Group } from "../src/lib/domain";
import type { Database, Json } from "../src/lib/supabase/types";

const categorySortOrder: Record<Group["categorySlug"], number> = {
  ai: 10,
  overseas: 20,
  programming: 30,
  investment: 40,
  "one-person-company": 45,
  "indie-dev": 50
};

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);

    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function loadLocalEnv() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));
}

function dateOnlyToTimestamptz(value: string | undefined): string | null {
  return value ? new Date(`${value}T00:00:00.000Z`).toISOString() : null;
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? {})) as Json;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Add it to .env.local or export it.`);
  }

  return value;
}

function printDryRun() {
  const joinMethodCount = sampleGroups.reduce(
    (total, group) => total + group.joinMethods.length,
    0
  );

  console.log(
    `Dry run: ${categories.length} categories, ${sampleGroups.length} groups, ${joinMethodCount} join methods are ready to seed.`
  );
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (dryRun) {
    printDryRun();
    return;
  }

  loadLocalEnv();

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .upsert(
      categories.map((category) => ({
        slug: category.slug,
        name_zh: category.label.zh,
        name_en: category.label.en,
        sort_order: categorySortOrder[category.slug]
      })) as never,
      { onConflict: "slug" }
    )
    .select("id, slug");

  if (categoryError) {
    throw categoryError;
  }

  const categoryIds = new Map(
    ((categoryRows as { id: string; slug: string }[] | null) ?? []).map(
      (category) => [category.slug, category.id]
    )
  );
  let groupCount = 0;
  let joinMethodCount = 0;

  for (const group of sampleGroups) {
    const categoryId = categoryIds.get(group.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category id for ${group.categorySlug}`);
    }

    const { data: groupRow, error: groupError } = await supabase
      .from("groups")
      .upsert(
        {
          category_id: categoryId,
          owner_id: null,
          slug: group.slug,
          name: group.name,
          platform: group.platform,
          tags: group.tags,
          short_description: group.shortDescription,
          description: group.description,
          suitable_for: group.suitableFor,
          language: group.language,
          region: group.region,
          activity_level: group.activityLevel,
          join_policy: group.joinPolicy,
          price: group.price,
          rules_summary: group.rulesSummary,
          owner_verified: group.ownerVerified,
          moderation_status: "approved",
          trust_signals: group.trustSignals,
          localized_content: toJson(group.localizedContent),
          last_verified_at: dateOnlyToTimestamptz(group.lastVerifiedAt)
        } as never,
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (groupError || !groupRow) {
      throw groupError ?? new Error(`Failed to upsert group ${group.slug}`);
    }

    const groupId = (groupRow as { id: string }).id;
    const { error: deleteJoinMethodsError } = await supabase
      .from("group_join_methods")
      .delete()
      .eq("group_id", groupId);

    if (deleteJoinMethodsError) {
      throw deleteJoinMethodsError;
    }

    const { error: joinMethodsError } = await supabase
      .from("group_join_methods")
      .insert(
        group.joinMethods.map((method) => ({
          group_id: groupId,
          type: method.type,
          label: method.label,
          value: method.value,
          visibility: method.visibility,
          review_status: method.reviewStatus,
          expires_at: dateOnlyToTimestamptz(method.expiresAt),
          last_verified_at: dateOnlyToTimestamptz(
            method.lastVerifiedAt ?? group.lastVerifiedAt
          )
        })) as never
      );

    if (joinMethodsError) {
      throw joinMethodsError;
    }

    groupCount += 1;
    joinMethodCount += group.joinMethods.length;
  }

  console.log(
    `Seeded ${categories.length} categories, ${groupCount} groups, and ${joinMethodCount} join methods.`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
