# Product Requirements Document (PRD) - TODO App Upgrade

## 1. Overview

We are upgrading the basic TODO app so users can better organize tasks without increasing implementation complexity beyond a teachable MVP. The approved MVP adds optional due dates, simple priority levels, and date-based filters while keeping all data local and avoiding backend changes. Additional visual enhancements and advanced ordering rules were discussed, but those are deferred to Post-MVP to keep the first release lean.

---

## 2. MVP Scope

- Add an optional `dueDate` field to tasks using ISO format `YYYY-MM-DD`.
- Add a `priority` field with allowed values `P1`, `P2`, and `P3`.
- Default `priority` to `P3` when no value is provided.
- Add filters for `All`, `Today`, and `Overdue`.
- In the `All` filter, include completed and incomplete tasks.
- In the `Today` and `Overdue` filters, show only incomplete tasks.
- Keep storage local only, with no backend changes or external storage.
- Require `title` for every task.
- Ignore invalid `dueDate` values and treat them as absent.
- Enforce `priority` validation so only `P1`, `P2`, or `P3` are accepted.

---

## 3. Post-MVP Scope

- Visually highlight overdue tasks so they stand out.
- Sort tasks with this order: overdue tasks first, then priority from `P1` to `P3`, then due date ascending, with tasks that have no due date last.
- Consider visual priority badges or color-coding, which were discussed in the meeting but not included in the approved MVP scope.

---

## 4. Out of Scope

- Notifications
- Recurring tasks
- Multi-user support
- Keyboard navigation enhancements
- Special accessibility work beyond the current baseline
- Backend changes
- External storage integrations