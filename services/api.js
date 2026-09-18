import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const SESSION_TOKEN_KEY = 'wspread_session_token';

function formatAuthorizationHeader(token) {
  if (!token) return null;
  return /^(Bearer|Basic)\s+\S+/i.test(token) ? token : `Bearer ${token}`;
}

async function request(path, options = {}) {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  const authorization = formatAuthorizationHeader(token);
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...(authorization ? { Authorization: authorization } : {}),
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
  return token.trim();
}

async function persistSession(responseHeaders) {
  await SecureStore.setItemAsync(
    SESSION_TOKEN_KEY,
    getSessionToken(responseHeaders)
  );
}

export async function loginWithEmail(email, password) {
  const { payload, headers } = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await persistSession(headers);
  return payload?.data || { email, name: email.split('@')[0] || 'User' };
}

export async function registerWithEmail(email, password, name) {
  const { payload, headers } = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  await persistSession(headers);
  return payload?.data || { email, name: name || email.split('@')[0] || 'User' };
}

export async function updateProfileImage(imageUri, imageMetadata = {}) {
  const fileName = imageMetadata.fileName
    || imageUri.split('/').pop()
    || 'profile-image.jpg';
  const extension = fileName.split('.').pop()?.toLowerCase();
  const mimeType = imageMetadata.mimeType
    || (extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg');
  const body = imageMetadata.base64
    ? JSON.stringify({
        imageBase64: `data:${mimeType};base64,${imageMetadata.base64}`,
        fileName,
      })
    : (() => {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        });
        return formData;
      })();

  const { payload } = await request('/auth/me/avatar', {
    method: 'PATCH',
    body,
  });
  return payload?.data;
}

export async function getMyMembership() {
  const { payload } = await request('/memberships/me');
  return payload?.data;
}

export async function linkRevenueCatUser(appUserId) {
  await request('/memberships/revenuecat-user', {
    method: 'PATCH',
    body: JSON.stringify({ appUserId }),
  });
}

// Pushes a snapshot of the client's live RevenueCat entitlement to the
// backend right after a purchase/restore, so the badge doesn't have to wait
// on the async RevenueCat webhook. Response shape matches getMyMembership().
export async function syncMembership(snapshot) {
  const { payload } = await request('/memberships/sync', {
    method: 'POST',
    body: JSON.stringify(snapshot),
  });
  return payload?.data;
}

// Uploads a PDF e-statement for OCR/parsing. Uses XMLHttpRequest instead of
// fetch (which request() is built on) because fetch does not expose upload
// progress events; onProgress receives a 0-100 integer as the multipart body
// streams to the server.
export async function uploadStatement(fileAsset, onProgress) {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  const authorization = formatAuthorizationHeader(token);

  const formData = new FormData();
  formData.append('file', {
    uri: fileAsset.uri,
    name: fileAsset.name || 'statement.pdf',
    type: fileAsset.mimeType || 'application/pdf',
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/analytics/upload-statement`);
    xhr.setRequestHeader('Accept', 'application/json');
    if (authorization) {
      xhr.setRequestHeader('Authorization', authorization);
    }

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      let payload = null;
      try {
        payload = JSON.parse(xhr.responseText);
      } catch (parseError) {
        // fall through with payload = null
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload?.success !== false) {
        resolve(payload?.data);
      } else {
        reject(new Error(payload?.message || `Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error while uploading the statement.'));
    xhr.ontimeout = () => reject(new Error('Uploading the statement timed out.'));

    xhr.send(formData);
  });
}

export async function createPrediction(input) {
  const { payload } = await request('/analytics/predict', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return payload?.data;
}

export async function getPredictionHistory() {
  const { payload } = await request('/analytics/predictions');
  return payload?.data || [];
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
