# Cloud Architecture Overview

This monorepo contains a React frontend that calls an Express API. The API uses an in-memory SQLite database for task storage during runtime.

```mermaid
flowchart LR
    U[User in Browser]
    F[React Frontend\npackages/frontend]
    A[Express API\npackages/backend]
    D[(In-Memory SQLite Store\nbetter-sqlite3 :memory:)]

    U -->|Uses UI| F
    F -->|HTTP /api/tasks| A
    A -->|Reads and writes tasks| D
    A -->|JSON responses| F
```

## Notes

- The frontend is a React application served from `packages/frontend`.
- The backend is an Express service in `packages/backend`.
- Task data is stored in memory, so it resets when the backend process restarts.
- The frontend communicates with the backend through `/api/tasks` endpoints.

## Sequence: User Creates a TODO

```mermaid
sequenceDiagram
    actor U as User
    participant F as React Frontend
    participant A as Express API
    participant D as In-Memory SQLite Store

    U->>F: Enter task details and submit form
    F->>F: Validate title and build task payload
    F->>A: POST /api/tasks
    A->>A: Validate request body
    A->>D: Insert task into tasks table
    D-->>A: Return new task record
    A-->>F: 201 Created + task JSON
    F->>A: GET /api/tasks
    A->>D: Query task list
    D-->>A: Return stored tasks
    A-->>F: 200 OK + tasks JSON
    F-->>U: Render updated TODO list
```