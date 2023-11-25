// auth.js
import { API_REGISTER_URL, API_LOGIN_URL } from "./common.js";

/**
 * Registers a new user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Response>} The fetch promise
 */
export async function register(name, email, password) {
  const errorElement = document.getElementById("registerError");

  if (!name.match(/^\w+$/)) {
    errorElement.textContent =
      "Username must not contain punctuation symbols apart from underscore (_).";
    errorElement.style.display = "block";
    return;
  }

  if (!email.match(/@(noroff\.no|stud\.noroff\.no)$/)) {
    errorElement.textContent =
      "Email must be a valid 'stud.noroff.no' or 'noroff.no' address.";
    errorElement.style.display = "block";
    return;
  }

  if (password.length < 8) {
    errorElement.textContent = "Password must be at least 8 characters long.";
    errorElement.style.display = "block";
    return;
  }
  try {
    // Log the request payload for debugging
    console.log(
      "Register request payload:",
      JSON.stringify({ email, password })
    );

    const response = await fetch(API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    console.log("API Response:", data); // Debug: log the API response

    if (response.ok) {
      console.log("Registration successful", data);
      return { success: false, data }; // Ensure this is the correct data to return
    } else {
      console.error("Registration failed", data);
      return { success: true, data }; // Return error data or a specific error message
    }
  } catch (error) {
    console.error("Register error:", error);
    // Handle any other errors
  }
}

/**
 * Logs in a user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Response>} The fetch promise
 */
export async function login(email, password) {
  try {
    // Log the request payload for debugging
    console.log(
      "Login request payload:",
      JSON.stringify({ name, email, password })
    );

    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      // Store JWT token in localStorage and log the response
      localStorage.setItem("jwt", data.token);
      console.log("Login successful:", data);
    } else {
      // Log unsuccessful login attempt
      console.log("Login failed:", data);
    }

    return data;
  } catch (error) {
    // Log any errors
    console.error("Login error:", error);
  }
}
