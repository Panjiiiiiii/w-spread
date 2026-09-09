# Data Model

No persistent data model or database schema is present. The following entities are inferred from runtime state and roadmap behavior and should be designed before implementation:

- `User`: id, email, display name, auth provider, created time.
- `Membership`: user id, plan, entitlement status, expiry, provider customer/subscription id.
- `FinancialSnapshot`: user id, cash balance, daily burn rate, runway days, source statement id.
- `Statement`: user id, file metadata, processing status, totals, category breakdown, error.
- `Scenario`: user id, expense reduction, capital injection, hiring freeze, calculated runway.
- `ActivityLog`: user id, type, title, description, timestamp, typed scenario/statement reference.

The primary relationship is user-owned data: one user has many statements, snapshots, scenarios, and activity logs; membership is one current entitlement plus provider history. Tenant/user isolation must be enforced in the backend.

