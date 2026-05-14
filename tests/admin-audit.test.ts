import { describe, expect, it } from "vitest";

import {
  buildAdminAuditEvent,
  formatAdminAuditEvent
} from "../src/lib/admin-audit";

const actorId = "123e4567-e89b-12d3-a456-426614174000";
const firstGroupId = "123e4567-e89b-12d3-a456-426614174001";
const secondGroupId = "123e4567-e89b-12d3-a456-426614174002";

describe("admin audit helpers", () => {
  it("builds a compact audit insert for batch group updates", () => {
    expect(
      buildAdminAuditEvent({
        action: "batch_update_groups",
        actorId,
        entityId: null,
        entityType: "groups",
        metadata: {
          count: 2,
          groupIds: [firstGroupId, secondGroupId],
          status: "suspended"
        }
      })
    ).toEqual({
      action: "batch_update_groups",
      actor_id: actorId,
      entity_id: null,
      entity_type: "groups",
      metadata: {
        count: 2,
        groupIds: [firstGroupId, secondGroupId],
        status: "suspended"
      }
    });
  });

  it("formats recent audit events for Chinese and English admin views", () => {
    const event = {
      action: "batch_update_groups",
      created_at: "2026-05-11T12:00:00.000Z",
      entity_id: null,
      entity_type: "groups",
      id: "123e4567-e89b-12d3-a456-426614174003",
      metadata: {
        count: 2,
        status: "suspended"
      }
    };

    expect(formatAdminAuditEvent(event, "zh")).toMatchObject({
      description: "群组 · 2 个对象",
      title: "批量下架群组"
    });
    expect(formatAdminAuditEvent(event, "en")).toMatchObject({
      description: "Groups · 2 objects",
      title: "Hid groups in bulk"
    });
  });

  it("formats governance actions with repeat-stale labels", () => {
    const governanceEvent = {
      action: "govern_stale_group",
      created_at: "2026-05-13T12:00:00.000Z",
      entity_id: "123e4567-e89b-12d3-a456-426614174005",
      entity_type: "groups",
      id: "123e4567-e89b-12d3-a456-426614174004",
      metadata: {
        note: "Suspended pending re-validation.",
        status: "suspended"
      }
    };

    expect(formatAdminAuditEvent(governanceEvent, "zh")).toMatchObject({
      description: "群组 · 1 个对象",
      title: "反复失效群组已暂停展示"
    });
    expect(formatAdminAuditEvent(governanceEvent, "en")).toMatchObject({
      description: "Groups · 1 object",
      title: "Governance: hide group"
    });
  });
});
