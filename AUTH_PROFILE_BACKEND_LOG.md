# Auth and Profile Diagnostic Log

Date: 2026-09-11

## Executive summary

The three reported symptoms are not all backend problems:

1. **Profile image does not change on the Home screen:** confirmed frontend bug.
   `HomeScreen` always renders `assets/avatar.png`; it never receives or renders
   `profileImageUri`. The image selected in `EditProfileScreen` is only stored in
   React state in `App.js` and is passed to `ProfileScreen`.
2. **Nickname changes to the email prefix after logout/login:** confirmed
   frontend data-handling bug, plus a backend response contract that needs to be
   verified. `loginWithEmail` discards the login response body and returns
   `{ name: email.split('@')[0] }`, so the app cannot display the persisted
   backend name after a fresh login. Registration does send `name`, but login
   does not request or map the user profile.
3. **Google login/register does not work:** confirmed not integrated in this
   repository. The button calls a simulation that only displays an alert. There
   is no Google auth SDK dependency, no auth-session flow, no Google client ID
   configuration, and no API call for a Google credential.

## Confirmed frontend evidence

- `services/api.js`
  - `loginWithEmail()` only uses response headers to persist a token and then
    returns `name: email.split('@')[0]`.
  - `registerWithEmail()` sends `{ email, password, name }`, but the login path
    does not fetch the user profile returned by the backend.
  - Requests send the exact value returned by the server in the
    `Authorization` header. Confirm whether the backend expects a scheme plus
    token (for example, the standard scheme followed by `<token>`).
- `App.js`
  - The authenticated user object is updated only when `userData.name` exists.
  - `profileImageUri` is local React state and is not persisted or uploaded.
  - `HomeScreen` receives `userName` but does not receive `profileImageUri`.
- `screens/HomeScreen.js`
  - The avatar source is hardcoded to `require('../assets/avatar.png')`.
- `screens/ProfileScreen.js`
  - The profile screen does render the `profileImageUri` prop, which explains why
    profile and home can show different images.
- `screens/AuthScreen.js`
  - `handleGoogleSignIn()` only shows: “Google Identity Services is not
    configured yet. Use email and password for now.”
- `package.json`, `package-lock.json`, and `app.json`
  - No Google authentication package or OAuth client IDs are configured.

## Backend checks required

Please verify the following API behavior before changing the backend:

### Email login response

`POST /api/v1/auth/login` should return a stable JSON shape containing both the
session token and the authenticated user profile, for example:

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "person@example.com",
    "name": "Person Name",
    "profileImageUrl": null
  }
}
```

The token must be returned in the `Authorization` response header, or the
frontend must be changed to read a documented JSON token field. Do not return a
different user shape for register and login.

### Registration persistence

Confirm that `POST /api/v1/auth/register`:

- validates and stores the submitted `name`;
- returns the same user fields as login;
- does not replace a supplied name with the email prefix;
- creates a unique user record and a usable session token.

### Authenticated profile endpoint

If login intentionally returns only a token, provide a documented endpoint such
as `GET /api/v1/me` or `GET /api/v1/users/me`. It must use the same token
format and return the persisted `name` and profile image URL. The frontend must
call it immediately after login.

### Authorization format

Confirm whether protected endpoints require:

```text
Authorization: <scheme> <token>
```

The current client sends the raw header value returned by the login response.
If the server returns only a bare token but expects `Bearer`, either normalize
the client header or return the complete header value consistently.

### Profile image API

The current app only stores a local device URI. There is no upload/update API
call. If profile images are expected to survive logout or another device, the
backend needs an authenticated upload/update endpoint and a durable
`profileImageUrl` field. A local URI cannot be used by the backend or reliably
survive app data changes.

## Google Auth status

Google authentication is **not integrated** in this app. The visible button is
UI-only and intentionally shows an alert. Backend Google endpoints alone will
not make this button work.

A complete integration requires all of the following:

1. Choose one provider flow (Expo AuthSession/browser OAuth, Firebase Auth, or
   another agreed provider).
2. Configure Android, iOS, and web client IDs/redirect URIs for the Expo SDK 57
   app.
3. Add the matching frontend dependency and native/app configuration.
4. Replace the simulation with a real sign-in flow.
5. Send the provider ID token or authorization code to a backend endpoint such
   as `POST /api/v1/auth/google`.
6. On the backend, verify the token signature, issuer, audience, expiry, and
   email, then find-or-create the user and return the same session/user shape
   as email login.
7. Define account-linking behavior when the Google email already belongs to an
   email/password account.

Until those steps are implemented, “Continue with Google” and “Sign Up with
Google” cannot log in or register by design.

## Copy-paste backend prompt

> Investigate W-Spread auth contract for the mobile client. `POST
> /api/v1/auth/register` receives `{ email, password, name }`; preserve the
> supplied name. `POST /api/v1/auth/login` must return a session token and the
> persisted user profile (`id`, `email`, `name`, optional `profileImageUrl`) in
> the same shape as register, or provide `GET /api/v1/me` for the client to
> call after login. Confirm whether the client must send an authorization scheme
> plus `<token>` and make the response/header contract consistent. Verify that login
> never derives or overwrites the name from the email prefix. Add or document
> `POST /api/v1/auth/google` only after agreeing on the Google ID-token/code
> flow; verify issuer, audience, signature, expiry, and account-linking rules,
> then return the same session/user shape. If profile images must persist,
> provide an authenticated upload/update endpoint and durable image URL.

## Recommended frontend follow-up

After the backend contract is confirmed:

- map the login response user instead of deriving the name locally;
- pass `profileImageUri` into `HomeScreen` and render it there;
- persist profile updates through the backend;
- implement the agreed Google provider flow and call the backend Google endpoint;
- add loading/error handling for profile fetch and Google cancellation/failure.
