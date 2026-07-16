let accessToken = null;
const listeners = new Set();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
  listeners.forEach((listener) => listener(accessToken));
}

export function clearAccessToken() {
  setAccessToken(null);
}

export function subscribeToken(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}
