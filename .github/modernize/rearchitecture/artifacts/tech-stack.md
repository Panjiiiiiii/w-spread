# Technology Stack

- Runtime: Expo SDK 57, React Native 0.86.2, React 19.2.3.
- Package manager: npm (`package-lock.json`).
- Client integrations present: `expo-document-picker`, `react-native-purchases`, `lucide-react-native`.
- Backend libraries: none detected.
- Data/auth libraries: none detected.
- Build/deploy backend files: none detected.

## Runtime blockers for a real backend

1. Auth handlers use `setTimeout` and fabricate a user object.
2. Google sign-in is simulated.
3. Statement processing uses a timeout and fixed categories.
4. Payment is simulated and promo codes are embedded in the client.
5. Prediction values and activity logs live only in React state.
6. No secure token/session persistence is installed despite the roadmap requiring it.

These blockers favor introducing a single backend/BaaS boundary and moving trust-sensitive rules out of screens before splitting services.

