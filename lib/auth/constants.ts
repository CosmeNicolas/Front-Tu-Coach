export const TOKEN_STORAGE_KEY = 'tucoach_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'tucoach_refresh_token';
export const TOKEN_COOKIE_NAME = 'tucoach_access_token';
export const REMEMBER_EMAIL_KEY = 'tucoach_remember_email';
/** 7 días — alineado con refresh token */
export const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api/v1';
