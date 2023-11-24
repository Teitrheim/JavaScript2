// This is the main JS file
// Wherever possible, use object and array destructuring for cleaner code.
// Document all functions using JSDocs for clarity and maintainability.

// index.js
import { register, login } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("login-form");

  registerForm.addEventListener("submit", handleRegister);
  loginForm.addEventListener("submit", handleLogin);
});

async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const response = await register(email, password);
    console.log("Registration successful", response);
    // Handle successful registration
  } catch (error) {
    console.error("Registration failed", error);
    // Handle registration errors
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await login(email, password);
    console.log("Login successful", response);
    // Handle successful login
  } catch (error) {
    console.error("Login failed", error);
    // Handle login errors
  }
}
