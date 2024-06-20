// src/utils/auth.js

export function isTokenValid(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);

    if (typeof exp === 'number') {
      return Date.now() < exp * 1000;
    }
    return false;
  } catch (e) {
    console.error("Invalid token:", e);
    return false;
  }
}

export async function refreshToken() {
  try {
    const response = await fetch('http://localhost:5000/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwt', data.token);
      return true;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
