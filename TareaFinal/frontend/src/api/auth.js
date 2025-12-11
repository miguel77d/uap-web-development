import { apiFetch } from "./api";

/**
 * POST /api/auth/register
 */
export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

/**
 * POST /api/auth/login
 */
export function loginUser(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

/**
 * GET /api/auth/me
 */
export function fetchCurrentUser() {
  return apiFetch("/auth/me");
}

/**
 * POST /api/auth/logout
 */
export function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST"
  });
}
