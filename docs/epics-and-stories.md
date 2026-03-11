# Epics

## MVP

- Epic: MVP Task Data Model
- Epic: MVP Task Filters
- Epic: MVP Local-Only Storage

## Post-MVP

- Epic: Post-MVP Overdue Visibility
- Epic: Post-MVP Task Sorting
- Epic: Post-MVP Priority Presentation

## Out of Scope

- Notifications
- Recurring tasks
- Multi-user support
- Keyboard navigation enhancements
- Special accessibility work beyond the current baseline
- Backend changes
- External storage integrations

# Stories

## MVP Task Data Model

- Story: Add due date field to tasks
- Story: Add priority field to tasks
- Story: Default priority to P3
- Story: Require title for task creation
- Story: Ignore invalid due date values
- Story: Validate allowed priority values

## MVP Task Filters

- Story: Add All tasks filter
- Story: Add Today tasks filter
- Story: Add Overdue tasks filter
- Story: Show completed tasks in All view
- Story: Hide completed tasks in Today view
- Story: Hide completed tasks in Overdue view

## MVP Local-Only Storage

- Story: Keep task storage local
- Story: Preserve no-backend implementation

## Post-MVP Overdue Visibility

- Story: Highlight overdue tasks visually

## Post-MVP Task Sorting

- Story: Sort overdue tasks first
- Story: Sort tasks by priority
- Story: Sort tasks by due date ascending
- Story: Place undated tasks last

## Post-MVP Priority Presentation

- Story: Add visual priority badges
- Story: Color-code priority levels

# Acceptance Criteria

## Add due date field to tasks

- A task can be created without a due date.
- A task can store a due date in `YYYY-MM-DD` format.
- A valid due date is persisted with the task in local storage.

## Add priority field to tasks

- A task supports a priority value of `P1`, `P2`, or `P3`.
- The selected priority is persisted with the task in local storage.

## Default priority to P3

- When no priority is provided, the task is saved with priority `P3`.
- Newly created tasks without an explicit priority display as `P3`.

## Require title for task creation

- A task cannot be created without a title.
- Task creation is blocked when the title is empty.

## Ignore invalid due date values

- An invalid due date does not prevent the task from being saved.
- An invalid due date is treated as absent and is not stored as a valid due date.

## Validate allowed priority values

- Only `P1`, `P2`, and `P3` are accepted as valid priority values.
- Any invalid priority input is rejected or normalized to the supported values before save.

## Add All tasks filter

- Users can switch to an `All` filter view.
- The `All` filter shows all saved tasks regardless of due date.

## Add Today tasks filter

- Users can switch to a `Today` filter view.
- The `Today` filter shows only tasks with a due date equal to the current date.

## Add Overdue tasks filter

- Users can switch to an `Overdue` filter view.
- The `Overdue` filter shows only tasks with a due date earlier than the current date.

## Show completed tasks in All view

- Completed tasks appear in the `All` filter.
- Incomplete tasks also appear in the `All` filter.

## Hide completed tasks in Today view

- Completed tasks do not appear in the `Today` filter.
- Only incomplete tasks due today appear in the `Today` filter.

## Hide completed tasks in Overdue view

- Completed tasks do not appear in the `Overdue` filter.
- Only incomplete overdue tasks appear in the `Overdue` filter.

## Keep task storage local

- Task data is stored locally on the client.
- Tasks remain available after a page reload using local storage.

## Preserve no-backend implementation

- MVP functionality does not require backend API changes.
- MVP functionality does not rely on external storage services.

## Highlight overdue tasks visually

- Tasks that are overdue are visually distinct from non-overdue tasks.
- The overdue visual treatment applies only to tasks with a due date earlier than the current date.

## Sort overdue tasks first

- Overdue tasks appear before non-overdue tasks in sorted task lists.

## Sort tasks by priority

- Tasks are ordered by priority after overdue status is applied.
- Priority ordering is `P1`, then `P2`, then `P3`.

## Sort tasks by due date ascending

- Tasks with the same overdue status and priority are ordered by earliest due date first.

## Place undated tasks last

- Tasks without a due date appear after tasks with due dates in sorted task lists.

## Add visual priority badges

- Each task displays a visible badge representing its priority level.
- The badge label matches the task priority value.

## Color-code priority levels

- `P1` uses a distinct visual color from `P2` and `P3`.
- `P2` uses a distinct visual color from `P1` and `P3`.
- `P3` uses a distinct visual color from `P1` and `P2`.

# Technical Requirements

## Add due date field to tasks

- Extend the current frontend task shape used by `TaskForm`, `App`, and `TaskList` to continue carrying `due_date` values in API-compatible snake_case unless the task model is fully normalized across the UI.
- Keep the due date input compatible with the existing `type="date"` field in `packages/frontend/src/TaskForm.js`.
- Preserve the current local date rendering approach in `packages/frontend/src/TaskList.js`, which formats `YYYY-MM-DD` without timezone conversion.

## Add priority field to tasks

- Add `priority` to the task payload passed from `packages/frontend/src/TaskForm.js` through `packages/frontend/src/App.js` to the task list state.
- If backend compatibility is preserved during transition, add a `priority` column to the SQLite `tasks` table in `packages/backend/src/app.js` and include it in `GET`, `POST`, and `PUT` handlers.
- Update frontend MSW fixtures and backend Supertest fixtures to include `priority` in task objects.

## Default priority to P3

- Apply the default in the form submission path in `packages/frontend/src/TaskForm.js` so new tasks always submit a complete task object.
- If the backend remains in use for any phase, mirror the default in `POST /api/tasks` and `PUT /api/tasks/:id` to avoid inconsistent saved records.

## Require title for task creation

- Preserve the current client-side validation in `packages/frontend/src/TaskForm.js` that blocks submit and shows an inline error.
- Preserve the current backend validation in `packages/backend/src/app.js` that returns HTTP 400 when `title` is empty or missing.

## Ignore invalid due date values

- Tighten the date normalization in `packages/frontend/src/TaskForm.js` so invalid input does not produce `NaN-NaN-NaN` when editing malformed values.
- Sanitize invalid `due_date` values to `null` before persistence in the local storage layer and in backend handlers if they remain active.

## Validate allowed priority values

- Restrict the frontend input control to the three supported values rather than free-text entry.
- Add server-side validation in `packages/backend/src/app.js` for `priority` if backend endpoints continue to be exercised in tests or development flows.

## Add All tasks filter

- Introduce filter state in `packages/frontend/src/App.js` or `packages/frontend/src/TaskList.js`, because the current UI renders an unfiltered task list only.
- Preserve the existing `refreshKey` or replace it with equivalent state synchronization so filter changes and task mutations stay in sync.

## Add Today tasks filter

- Implement date comparisons on normalized `YYYY-MM-DD` strings to stay consistent with the current due-date storage format.
- Apply the filter in the frontend list layer if MVP storage moves fully local, rather than depending on the current backend query parameters `completed` and `search`.

## Add Overdue tasks filter

- Reuse the same local-date comparison rules as `TaskList` formatting so overdue detection is not affected by timezone offsets.
- Exclude tasks with missing or invalid `due_date` values from the overdue result set.

## Show completed tasks in All view

- Keep using the current `completed` boolean-or-integer semantics expected by `packages/frontend/src/TaskList.js` and `PATCH /api/tasks/:id`.
- Do not reuse the current backend `completed` query filter for the `All` view if filtering is handled client-side.

## Hide completed tasks in Today view

- Filter against the existing completion field that is toggled in `packages/frontend/src/TaskList.js` via `PATCH /api/tasks/:id`.
- Update frontend tests in `packages/frontend/src/__tests__/App.test.js` to cover the completed-task exclusion rule.

## Hide completed tasks in Overdue view

- Apply completion filtering after overdue determination so only overdue incomplete tasks remain visible.
- Add test coverage for overdue completed tasks being omitted from the filtered list.

## Keep task storage local

- Replace the current fetch-based persistence in `packages/frontend/src/App.js` and `packages/frontend/src/TaskList.js` with a local storage-backed data access layer for MVP.
- Persist the full task collection, including `id`, `title`, `description`, `due_date`, `priority`, and `completed`, in browser local storage.
- Initialize frontend state from local storage on app load before rendering the task list.

## Preserve no-backend implementation

- The frontend must function without calling `/api/tasks` endpoints during normal MVP flows.
- Existing backend files in `packages/backend/src/app.js` may remain for lab continuity, but MVP task creation, update, delete, and filtering must not depend on them.
- Frontend tests should be updated so the main MVP behavior can be verified without MSW-backed API mocks.

## Highlight overdue tasks visually

- Extend the existing MUI styling in `packages/frontend/src/TaskList.js` by layering overdue styles on top of the current completed/incomplete card states.
- Ensure overdue highlighting does not override the current completion text decoration semantics.

## Sort overdue tasks first

- Replace the current backend SQL ordering by `due_date IS NULL, due_date ASC, created_at ASC` with a shared frontend sort comparator if task storage is local.

## Sort tasks by priority

- Implement a deterministic priority rank mapping in the UI layer so sort behavior is stable across renders.

## Sort tasks by due date ascending

- Reuse the normalized `YYYY-MM-DD` task value for comparisons instead of locale-formatted display strings.

## Place undated tasks last

- Preserve the current undated-last behavior already present in the backend SQL ordering when porting sorting into the frontend.

## Add visual priority badges

- Implement priority badges using the existing MUI `Chip` pattern already used for due dates in `packages/frontend/src/TaskList.js`.
- Ensure badge rendering tolerates legacy tasks that may not yet have a stored `priority` value by falling back to `P3`.

## Color-code priority levels

- Define the badge color mapping in one place in the frontend so the same colors are used across list and form-related UI.
- Extend frontend tests to assert that priority badges render with the expected labels before adding color-specific assertions.