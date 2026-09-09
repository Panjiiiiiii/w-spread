# Project Structure

## Project type

Expo SDK 57 React Native application with a single root component and screen-based navigation implemented through local state. No backend source, API route, database schema, server configuration, or service folder exists in the repository.

## Functional domains

- Authentication: login, registration, and simulated Google sign-in.
- Runway dashboard: cash, runway days, streak, and quick actions.
- Decision support: what-if runway simulation.
- Statement analysis: document selection and simulated expense categorization.
- Membership: plans, promo codes, checkout simulation, and entitlement display.
- Activity history: prediction and statement log listing, filtering, clearing, and replay.
- Profile: membership summary and logout.

## Current layers

- Presentation: `screens/*.js` and `components/*.js`.
- Application orchestration: `App.js`.
- Domain logic: embedded in screen handlers and constants.
- Persistence/integration: absent; all authentication, payment, OCR, and analytics are simulated or hard-coded.

## Architectural observation

The app is a cohesive client MVP, but `App.js` is already an orchestration hub and multiple screens mix rendering, domain calculations, persistence intent, and integration placeholders. The first backend should be one deployable application with explicit modules, not multiple networked services.

