# Architecture Analysis Index

## Implementation Guide

This index is a navigation guide, not the complete contract. Any implementation or backend design work must read the listed artifact paths before changing behavior.

| Unit | Read first | Why it matters | Completion evidence |
|---|---|---|---|
| auth | `units/auth/behavior.yaml`, `units/auth/bindings.yaml`, `units/auth/unit_decomposition.yaml` | Login/register state and callback contract | Auth provider choice, session persistence, and error states preserve the callbacks |
| home | `units/home/behavior.yaml`, `units/home/bindings.yaml`, `units/home/unit_decomposition.yaml` | Dashboard display and navigation into simulations | Dashboard reads server-owned metrics without duplicating calculation rules |
| prediction | `units/prediction/behavior.yaml`, `units/prediction/bindings.yaml`, `units/prediction/unit_decomposition.yaml` | What-if formula and log creation | Scenario request/response preserves inputs, runway result, and log semantics |
| estatement | `units/estatement/behavior.yaml`, `units/statement/bindings.yaml`, `units/statement/unit_decomposition.yaml` | File selection and future OCR/parser boundary | Upload, processing status, result categories, and failure states remain observable |
| membership | `units/membership/behavior.yaml`, `units/membership/bindings.yaml`, `units/membership/unit_decomposition.yaml` | Plan, promo, and payment flow | Entitlements are verified server-side and never trusted from client state |
| profile | `units/profile/behavior.yaml`, `units/profile/bindings.yaml`, `units/profile/unit_decomposition.yaml` | User profile and logout | Profile/session data comes from the authenticated session |
| logs | `units/logs/behavior.yaml`, `units/logs/bindings.yaml`, `units/logs/unit_decomposition.yaml` | Activity history and replay navigation | Logs are persisted per user and replay produces the same screen parameters |

### Global artifact filtering

- Use `unit_graph.yaml` for entry points, signatures, and dependencies.
- Use `shared_modules.yaml` before moving `App.js`, navigation, or shared components; they are cross-unit coupling points.
- Use `wire_contracts.yaml` for the proposed API boundary and preserve its stable response semantics.
- Use `cross_unit_state.yaml` for state currently held in `App.js`.
- Use `project-structure.md`, `tech-stack.md`, and `data-model.md` for the global design context.

The current evidence supports a modular monolith or managed BaaS backend first. It does not support independently deployed microservices yet.

