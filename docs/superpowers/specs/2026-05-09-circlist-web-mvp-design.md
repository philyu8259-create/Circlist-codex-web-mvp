# Circlist Web MVP Design

Date: 2026-05-09
Project: 趣群岛 / Circlist
Direction: Owner-operated interest group discovery platform

## Product Positioning

Circlist is a user-maintained discovery platform for real, active interest groups.
The first version focuses on groups for AI, overseas business, programming,
investment, and indie development.

The product should not present itself as an official directory for WeChat, QQ,
Telegram, Discord, or any other platform. It is a community-maintained directory
where users submit group information and group owners keep joining details fresh.

Primary subtitle:

- Chinese: 发现真实活跃的兴趣群
- English: Discover communities by interest

## MVP Goals

The MVP should prove that users can find and join useful interest groups while
keeping group information fresh enough to trust.

Core outcomes:

- Visitors can browse, search, and filter approved groups without logging in.
- Visitors can use the product in Chinese or English, selected automatically
  from browser language with an in-app language switch.
- Logged-in users can submit new groups.
- Logged-in users can claim or manage groups they own.
- Group details can include joining methods such as QR codes, invite links,
  group numbers, admin contact instructions, and application notes.
- New group submissions require review before becoming public.
- Important updates require review before replacing public content.
- Visitors can report spam, safety concerns, or expired joining information.
- Admins can review submissions, updates, owner claims, and reports.

## Non-Goals

These are intentionally out of scope for the first MVP:

- In-app chat or group messaging.
- Public comments, ratings, or social feeds.
- Payments or paid promotion.
- Automated scraping from WeChat, QQ, Telegram, Discord, or other platforms.
- Official integrations with third-party group platforms.
- Mobile native apps.

## Users

### Visitor

Visitors can browse the catalog, search for groups, inspect group details, and
report problems. They do not need an account.

### Member User

Member users log in with email verification. They can submit groups, view their
submissions, request ownership of existing groups, and manage groups they own.

### Group Owner

Group owners maintain group descriptions, joining methods, rules, status, and
expiration-sensitive assets such as WeChat QR codes.

### Admin

Admins review submitted content, owner claims, major updates, spam reports,
expired-link reports, and takedown actions.

## Information Architecture

### Public Pages

- Home: search bar, featured categories, recently verified groups, quality cues.
- Category page: group list filtered by category.
- Search results: keyword search with filters.
- Group detail: full group information, joining methods, trust/status signals,
  owner-maintained freshness indicators, and report actions.
- Submit group entry: requires login before continuing.

### Authenticated Pages

- Submit group: create a draft submission.
- My groups: submitted, claimed, approved, pending, rejected, needs update.
- Group management: edit group profile and joining methods.
- Claim group: request ownership of an existing public group.
- Update joining method: replace QR code, invite link, group number, or admin
  contact instructions.

### Admin Pages

- Review queue: new submissions and major edits.
- Claim queue: ownership claim requests.
- Report queue: spam, abuse, invalid links, expired QR codes.
- Group moderation: approve, reject, suspend, archive, or request changes.

## First Version Categories

The first MVP should ship with a focused category set:

- AI
- Overseas business
- Programming
- Investment
- Indie development

Each group can have one primary category and optional tags.

## Group Profile Fields

Public fields:

- Group name
- Platform: WeChat, QQ, Telegram, Discord, Slack, Other
- Primary category
- Tags
- Short description
- Detailed description
- Suitable audience
- Language
- Region
- Activity level: low, medium, high, unknown
- Join policy: open, approval required, admin contact, invite only
- Price: free, paid, unknown
- Rules summary
- Owner verification status
- Last verified at
- Join method freshness status

Private or review-only fields:

- Submitter user id
- Owner user id
- Reviewer notes
- Rejection reason
- Report count
- Moderation status

## Joining Methods

A group can have multiple joining methods:

- QR code image
- Invite link
- Group number
- Admin contact instructions
- Application form link
- Manual application notes

Each joining method has:

- Type
- Display value or uploaded asset reference
- Visibility status
- Expiration date, when relevant
- Last verified at
- Review status

For WeChat QR codes, expiration handling is central. The UI should show a clear
freshness indicator and provide an easy expired-code report action.

## Moderation Model

### New Submission Flow

1. User logs in.
2. User submits group information.
3. Submission enters pending review.
4. Admin approves, rejects, or requests changes.
5. Approved groups become public.

### Owner Claim Flow

1. Logged-in user requests ownership of a public group.
2. User provides evidence such as admin contact, matching invite page, or
   explanation.
3. Admin reviews the claim.
4. Approved owner can manage group information.

### Update Flow

Low-risk updates can be saved as drafts before review. Important public-facing
updates require admin review before replacing approved content:

- Join method changes
- Group name changes
- Platform changes
- Category changes
- External links
- Rules and audience changes that materially change the group

### Report Flow

Visitors can report:

- Expired QR code or invite link
- Spam or advertising-only group
- Scam, illegal, adult, or unsafe content
- Wrong category or misleading description
- Duplicate group

Reports enter the admin queue and can also mark a group as "needs update" when
multiple users report invalid joining information.

## Trust And Quality Signals

The MVP should avoid public ratings at first, but it should still communicate
basic trust signals:

- Recently verified
- Owner maintained
- Join method fresh
- Needs update
- Under review
- Suspended

These signals are easier to moderate than public reviews and reduce early-stage
abuse risk.

## Suggested Tech Stack

Recommended stack:

- Framework: Next.js with React and TypeScript
- Styling: Tailwind CSS
- Auth: Supabase email OTP
- Database: Supabase Postgres
- Storage: Supabase Storage for QR images
- Deployment: Vercel

This keeps the first version fast to build while preserving a clear path toward
native apps later.

## Core Data Model

Recommended tables:

- users: profile and role metadata
- groups: approved public group records
- group_submissions: new group submissions and major update drafts
- group_join_methods: approved joining methods
- group_join_method_submissions: pending joining method changes
- ownership_claims: group owner claim requests
- reports: spam, safety, duplicate, and expired-link reports
- categories: initial fixed categories
- tags: optional tags
- audit_events: moderation and owner-management history

Roles:

- visitor: anonymous, read-only public access
- member: authenticated user
- owner: authenticated user with approved group ownership
- admin: moderation and management access

## Page-Level Requirements

### Home

The home page should open directly into the product experience, not a marketing
landing page. It should include search, category shortcuts, and a curated list
of approved groups.

### Group List

Group cards should be compact and scannable:

- Name
- Platform
- Category
- Short description
- Activity level
- Freshness/trust status
- Region and language when useful

### Group Detail

The detail page should show the group profile, joining methods, rules, freshness
signals, owner status, and report actions. Joining methods should be visible only
when approved.

### Submit Group

Submission should guide the user through the minimum fields needed for review.
It should allow saving a draft locally or server-side after login.

### My Groups

Users can see submitted groups, owned groups, pending reviews, rejected
submissions, and groups needing a join-method update.

### Admin Review

Admin pages should prioritize fast moderation:

- Queue status tabs
- Submission diff for updates
- Approve, reject, request changes
- Rejection reason
- Audit trail

## Error And Edge Cases

- Expired or broken invite links should not be silently removed; they should
  create a report and mark the group as needing update.
- If a group owner changes a join method, the public approved method remains
  live until the update is approved or the admin suspends it.
- Duplicate submissions should be flagged in admin review using similar name,
  platform, category, and link/group number checks.
- Suspended groups should disappear from public lists but remain visible to
  admins.
- Rejected submissions should keep a clear reason for the submitter.

## Launch Scope

The first launch should include:

- Public browse/search/category/detail flow
- Email OTP login
- Submit group flow
- My groups dashboard
- Owner claim request
- Owner edit/update flow
- Expired link and abuse report flow
- Admin review queues
- Supabase-backed database, auth, and storage
- Responsive web UI for desktop and mobile
- Chinese and English adaptive UI copy for public, owner, and admin flows

## Implementation Defaults

These defaults keep the first implementation focused:

- Admin users are seeded manually through a database role update.
- The submit flow stores records server-side only after the user submits the
  first reviewable draft.
- Review statuses use simple labels: draft, pending, approved, rejected,
  changes requested, suspended, needs update.
- Rejection templates start as plain admin-entered text.
- The UI supports Chinese and English in the MVP. Default language follows the
  browser when possible, and users can switch languages manually.
- Group data keeps stable slugs plus localized display fields where useful.

## Approval Summary

Confirmed decisions from prior discussion:

- Build Web App MVP first.
- Use the brand 趣群岛 / Circlist.
- Use pre-publication review for new groups.
- Allow anonymous browsing.
- Require login for publishing and managing groups.
- Focus initial categories on AI, overseas business, programming, investment,
  and indie development.
- Use the owner-operated MVP approach with group claiming, joining-method
  maintenance, and review-gated important updates.
