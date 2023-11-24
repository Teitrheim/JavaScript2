// Here are the functions for registration and login.

// auth.js
/**
 * Handles user authentication including registration and login
 */

import { API_REGISTER_URL, API_LOGIN_URL } from "./common.js";

/**
 * Registers a new user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Response>} The fetch promise
 */
export async function register(email, password) {
  const response = await fetch(`${API_REGISTER_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

/**
 * Logs in a user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Response>} The fetch promise
 */
export async function login(email, password) {
  const response = await fetch(`${API_LOGIN_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("jwt", data.token); // Assuming the token is returned in data.token
  }
  return data;
}
