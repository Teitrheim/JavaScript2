import { register, login } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("login-form");

  registerForm.addEventListener("submit", handleRegister);
  loginForm.addEventListener("submit", handleLogin);
});

/**
 * Handles the registration process.
 * @param {Event} event - The submit event from the registration form.
 */
async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const response = await register(name, email, password);
    console.log("Registration successful", response);

    // If response includes the jwtToken
    localStorage.setItem("jwtToken", response.jwtToken);

    // Redirect to the feed page or update UI
    redirectUser("/feed");
  } catch (error) {
    console.error("Registration failed", error);
    displayErrorMessage("registerError", error.message);
  }
}

/**
 * Handles the login process.
 * @param {Event} event - The submit event from the login form.
 */
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await login(email, password);
    console.log("Login successful", response);
    localStorage.setItem("jwtToken", response.jwtToken);
    redirectUser("/feed");
  } catch (error) {
    console.error(error);
    displayErrorMessage("loginError", error.message);
  }
}

/**
 * Redirects the user to the specified page.
 * @param {string} page - The path to the page to redirect to.
 */
function redirectUser(page) {
  window.location.href = page;
}

/**
 * Displays an error message on the UI.
 * @param {string} elementId - The ID of the element.
 * @param {string} message - The error message to display.
 */
function displayErrorMessage(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.innerText = message;
    errorElement.style.display = "block";
  }
}
