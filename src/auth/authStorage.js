const ACCESS_TOKEN_KEY = "diichi_student_access_token";
let signOutReason = null;
export function getSignOutReason() {
  return signOutReason;
}

export function subscribeAuth(listener) {
  window.addEventListener("auth:changed", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("auth:changed", listener);
    window.removeEventListener("storage", listener);
  };
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  signOutReason = null;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearAccessToken(reason = null) {
  signOutReason = reason;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.dispatchEvent(new Event("auth:changed"));
}
