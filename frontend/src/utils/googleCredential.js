export function decodeGoogleCredential(credential) {
  try {
    const payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(payload));
  } catch {
    return {};
  }
}
