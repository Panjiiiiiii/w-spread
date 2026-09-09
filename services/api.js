import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const SESSION_TOKEN_KEY = 'wspread_session_token';

async function request(path, options = {}) {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: token } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return { payload, headers: response.headers };
}

function getSessionToken(headers) {
  const token = headers.get('Authorization');
  if (!token) {
    throw new Error('The auth API did not return an Authorization header.');
  }
  return token;
}

async function persistSession(responseHeaders) {
  await SecureStore.setItemAsync(
    SESSION_TOKEN_KEY,
    getSessionToken(responseHeaders)
  );
}

export async function loginWithEmail(email, password) {
  const { headers } = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await persistSession(headers);
  return { email, name: email.split('@')[0] || 'User' };
}

export async function registerWithEmail(email, password, name) {
  const { headers } = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  await persistSession(headers);
  return { email, name: name || email.split('@')[0] || 'User' };
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}

