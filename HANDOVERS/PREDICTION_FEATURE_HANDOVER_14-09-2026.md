# W-Spread Predictive Analysis Feature Handover

**Handover date:** 14-09-2026  
**Feature:** Server-side predictive financial analysis  
**Frontend:** Expo React Native  
**Backend:** Express.js + TypeScript + Prisma on Vercel  
**Database:** PostgreSQL/Supabase

## 1. Feature status

The predictive analysis flow has been implemented across the frontend and backend.

The current flow is:

1. An authenticated user opens the Prediction screen.
2. The user enters a forecast timeframe, payroll impact, and vendor impact.
3. The frontend sends the request to the backend.
4. The backend reads the user’s transaction history.
5. The backend calculates normal and conservative projected balances.
6. The backend stores the result in the `predictions` table.
7. The backend returns the saved prediction.
8. The frontend updates the result screen, Home cash balance, and local activity history.
9. The frontend can reload saved prediction history after login.

## 2. Important files

### Backend

- `wspread-be/src/services/prediction.service.ts`
  - Reads the last 12 months of transactions.
  - Calculates historical revenue and expense averages.
  - Calculates normal and conservative forecasts.
  - Calculates the risk level.
  - Creates and lists prediction records.

- `wspread-be/src/controllers/prediction.controller.ts`
  - Validates authenticated prediction requests.
  - Accepts timeframe and payroll/vendor inputs.
  - Returns API errors for invalid values.

- `wspread-be/src/routes/prediction.routes.ts`
  - Defines the prediction endpoints.

- `wspread-be/src/routes/index.ts`
  - Mounts prediction routes under `/api/v1/analytics`.

- `wspread-be/prisma/schema.prisma`
  - Contains `Transaction`, `Prediction`, and the related User relations.

- `wspread-be/prisma/migrations/20260914100000_add_transactions_and_predictions/migration.sql`
  - Creates the transaction and prediction database tables.

- `wspread-be/supabase/predictions_rls.sql`
  - Optional direct Supabase RLS policies.
  - Run this separately in the Supabase SQL editor if direct Supabase client access is enabled.

### Frontend

- `wspread-app/services/api.js`
  - `createPrediction(input)` calls the prediction endpoint.
  - `getPredictionHistory()` loads saved predictions.

- `wspread-app/screens/PredictionScreen.js`
  - Provides forecast inputs.
  - Sends the request to the backend.
  - Displays server-calculated projected and conservative balances.
  - Displays risk, timeframe, and historical averages.

- `wspread-app/App.js`
  - Loads prediction history after login/register.
  - Stores the latest prediction.
  - Updates Home cash display using the latest predicted balance.
  - Converts backend predictions into Profile activity logs.
  - Opens a saved prediction from the logs.

- `wspread-app/screens/LogHistoryScreen.js`
  - Existing activity/history UI used to display prediction records.

## 3. API contract

### Create prediction

```http
POST /api/v1/analytics/predict
Authorization: Bearer <session-token>
Content-Type: application/json
```

Request body:

```json
{
  "timeframeMonths": 12,
  "payrollImpact": 10000,
  "vendorImpact": 5000
}
```

Validation:

- `timeframeMonths`: integer from 1 to 120.
- `payrollImpact`: non-negative number.
- `vendorImpact`: non-negative number.
- Payroll and vendor values represent monthly impact.

Successful response:

```json
{
  "success": true,
  "data": {
    "id": "prediction-id",
    "currentBalance": 100000,
    "predictedBalance": 85000,
    "conservativeBalance": 73000,
    "timeframeMonths": 12,
    "averageMonthlyRevenue": 30000,
    "averageMonthlyExpenses": 20000,
    "payrollImpact": 10000,
    "vendorImpact": 5000,
    "riskLevel": "MEDIUM",
    "createdAt": "2026-09-14T00:00:00.000Z"
  }
}
```

### List prediction history

```http
GET /api/v1/analytics/predictions
Authorization: Bearer <session-token>
```

The endpoint returns up to the latest 50 predictions for the authenticated user only.

## 4. Calculation model

The backend reads transactions from the previous 12 months.

Transaction rules:

- `REVENUE` amounts are added to historical revenue.
- `EXPENSE` amounts are added to historical expenses.
- Current balance is calculated as:

```text
currentBalance = totalRevenue - totalExpenses
```

Monthly historical averages:

```text
averageMonthlyRevenue = totalRevenue / 12
averageMonthlyExpenses = totalExpenses / 12
```

Normal forecast:

```text
monthlyNet =
  averageMonthlyRevenue
  - averageMonthlyExpenses
  - payrollImpact
  - vendorImpact

predictedBalance =
  currentBalance + timeframeMonths * monthlyNet
```

Conservative forecast:

```text
conservativeBalance =
  currentBalance
  + timeframeMonths * (
      averageMonthlyRevenue * 0.95
      - averageMonthlyExpenses
      - payrollImpact
      - vendorImpact
    )
```

The conservative risk margin is fixed at `0.95`.

Risk calculation:

- `HIGH`: conservative balance is zero or negative, or estimated runway is below 3 months.
- `MEDIUM`: estimated runway is at least 3 months but below 6 months.
- `LOW`: estimated runway is at least 6 months.

## 5. Database schema

### `transactions`

The table stores the historical data required by the calculation engine:

- `id`
- `userId`
- `amount`
- `type` (`REVENUE` or `EXPENSE`)
- `category`
- `occurredAt`
- `createdAt`

### `predictions`

The table stores the calculation result and its inputs:

- `id`
- `userId`
- `currentBalance`
- `predictedBalance`
- `conservativeBalance`
- `timeframeMonths`
- `averageMonthlyRevenue`
- `averageMonthlyExpenses`
- `payrollImpact`
- `vendorImpact`
- `riskLevel`
- `createdAt`

The foreign key to `users` uses cascade deletion, so a user’s predictions are removed when the user is deleted.

## 6. Migration status

The migration was applied successfully with:

```text
20260914100000_add_transactions_and_predictions
```

The database was confirmed up to date using Prisma migration status.

Do not run `prisma migrate reset` against the deployed database.

For future environments, use:

```bash
npx prisma migrate deploy
```

## 7. Authentication and data isolation

Both prediction endpoints use `requireAuth`.

The backend obtains `req.userId` from the W-Spread session token. Every prediction query is filtered by that user ID:

```text
where: { userId: req.userId }
```

This prevents one authenticated user from reading another user’s prediction history.

The separate `supabase/predictions_rls.sql` script adds direct Supabase RLS policies. The Express API uses Prisma and the server database connection, so backend authorization still depends on the session middleware and user-scoped queries.

## 8. Current limitation: transaction ingestion

The prediction engine is ready to read transactions, but this feature does not yet add a public transaction-import endpoint.

If the `transactions` table is empty, the current calculation produces:

```text
currentBalance = 0
averageMonthlyRevenue = 0
averageMonthlyExpenses = 0
```

The next agent should connect the existing e-statement/OCR processing flow to `transactions`, or add an authenticated transaction ingestion endpoint. Without transaction data, the prediction result is mathematically valid but not useful.

Recommended future endpoint:

```http
POST /api/v1/analytics/transactions
Authorization: Bearer <session-token>
```

It should validate:

- positive amount
- `REVENUE` or `EXPENSE` type
- valid transaction date
- optional category

## 9. Current frontend behavior

The existing Prediction screen still contains legacy scenario controls such as cut expense, injected capital, and freeze hiring. These values currently affect the old local runway preview, while the new server prediction uses:

- timeframe months
- payroll impact
- vendor impact

A future cleanup should either:

1. Remove the legacy local runway formula and use the server result everywhere, or
2. Clearly label the old controls as a separate scenario simulator.

Do not allow the UI to imply that the old local runway number is the authoritative server prediction.

## 10. Home screen synchronization

After a successful server prediction:

1. `PredictionScreen` calls `onPredictionCreated`.
2. `App.js` stores the returned prediction in `latestPrediction`.
3. `HomeScreen` receives the latest predicted balance as `cashAmount`.
4. The Home cash card is refreshed when the user returns to Home.

This is state-based synchronization. Supabase Realtime is not currently required because the prediction is created by the same authenticated client and the result is returned immediately.

If multiple devices must receive updates in real time, add a Supabase Realtime subscription for the user’s `predictions` rows or use a query-cache invalidation strategy.

## 11. History behavior

After login or registration:

1. `App.js` calls `getPredictionHistory()`.
2. Backend returns predictions for the authenticated user.
3. The predictions are converted into activity log items.
4. Selecting a prediction log opens the Prediction results screen.

The current log screen uses the existing combined Activity & History Logs UI. A future agent can create a dedicated “Prediction History Log” screen or detail modal if the product requires a separate visual experience.

## 12. Validation already completed

- Prisma client generation completed successfully before the migration was applied.
- Backend TypeScript diagnostics reported no errors in the new prediction service, controller, route, or route registration.
- Frontend diagnostics reported no errors in `App.js`, `services/api.js`, or `PredictionScreen.js`.
- Prisma migration deployment completed successfully.
- Prisma migration status reported that the database schema is up to date.

No frontend production bundle/build should be assumed from this handover unless run separately.

## 13. Recommended next steps

1. Add transaction ingestion from uploaded bank statements.
2. Seed a small set of test transactions for a known user.
3. Call `POST /api/v1/analytics/predict` and verify the exact expected values.
4. Confirm a row appears in `predictions`.
5. Confirm another user cannot read that row.
6. Add a dedicated prediction detail modal with:
   - current balance
   - average revenue
   - average expenses
   - payroll impact
   - vendor impact
   - normal projected balance
   - conservative projected balance
   - risk level
7. Replace or relabel the legacy local runway simulation.
8. Add automated backend tests for:
   - empty transaction history
   - revenue and expense aggregation
   - conservative 95% margin
   - negative balance/high risk
   - invalid timeframe
   - user isolation

## 14. Handover warning

Do not remove the `Prediction` model or the `predictions` table. They are required for persisted prediction history and Home/Profile synchronization.

Do not remove the `Transaction` model unless another authoritative transaction source is implemented and the prediction service is updated to read from it.

