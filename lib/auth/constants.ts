export const TOKEN_STORAGE_KEY = 'tucoach_access_token';
export const TOKEN_COOKIE_NAME = 'tucoach_access_token';
export const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días — alineado con refresh futuro

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
