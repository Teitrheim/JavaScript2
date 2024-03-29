import { register, login, logout } from "./auth.js";

// Registration and login handling

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("login-form");

  registerForm.addEventListener("submit", handleRegister);
  loginForm.addEventListener("submit", handleLogin);

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logout();
    });
  }
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

    // If response includes the jwtToken
    localStorage.setItem("jwtToken", response.accessToken);
    // Display a success message without redirecting
    displaySuccessMessage("Registration successful. Please login below.");
    // Clear the form fields
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
  } catch (error) {
    console.error("Registration failed", error);
    displayErrorMessage("registerError", error.message);
  }
}
/**
 * Displays a success message.
 * @param {string} message - The success message to display.
 */
function displaySuccessMessage(message) {
  const successElement = document.getElementById("registerSuccess");
  if (successElement) {
    successElement.innerText = message;
    successElement.classList.remove("d-none");
  }
}
/**
 * Handles the login process.
 * @param {Event} event - The submit event from the login form.
 */
export async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await login(email, password);

    localStorage.setItem("jwtToken", response.accessToken);
    redirectUser("/feed");
  } catch (error) {
    console.error(error);
    displayErrorMessage("loginError", error.message);
  }
}

/**
 * Redirects the user to the specified page.
 * @param {string} page
 */
function redirectUser(page) {
  window.location.href = page;
}

/**
 * Displays an error message.
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
