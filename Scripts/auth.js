// auth.js
import { API_REGISTER_URL, API_LOGIN_URL } from "./common.js";

/**
 * Registers a new user
 * @param {string} name User's name
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise<Object>} The response data
 */
export async function register(name, email, password) {
  if (!name.match(/^\w+$/)) {
    throw new Error(
      "Username must not contain punctuation symbols apart from underscore (_)."
    );
  }

  if (!email.match(/@(noroff\.no|stud\.noroff\.no)$/)) {
    throw new Error(
      "Email must be a valid 'stud.noroff.no' or 'noroff.no' address."
    );
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const requestBody = JSON.stringify({ name, email, password });

  try {
    const response = await fetch(API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.error("Registration response data:", data);
      throw new Error(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Register error:", error); // Log any errors with fetching.
    throw error; // Re-throwing the error.
  }
}

/**
 * Logs in a user
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise<Object>} The response data
 */
export async function login(email, password) {
  try {
    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("jwtToken", data.accessToken); // Saving the token in localStorage
      return data;
    } else {
      const errorData = await response.json();
      console.error("Login response data:", errorData);
      throw new Error(
        errorData.message ||
          `Login failed: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Login error:", error); // Log any errors
    throw error; // Re-throwing the error
  }
}

export function logout() {
  localStorage.removeItem("jwtToken"); // Clear the JWT from localStorage
  window.location.href = "../"; // Redirect to the login page or home page
}
