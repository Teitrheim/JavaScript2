import fetchMock from "jest-fetch-mock";
import { handleLogin } from "./index";

fetchMock.enableMocks();

const { describe, it, expect, afterEach } = require("@jest/globals");

jest.mock("./index.js", () => ({
  ...jest.requireActual("./index.js"), // Import actual module contents
  redirectUser: jest.fn(), // Create a mock function for redirectUser
  displayErrorMessage: jest.fn(), // Create a mock function for displayErrorMessage
}));

const { login } = require("./index");

describe("handleLogin", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.resetMocks();
  });
  it("should prevent default form submission and call login function", async () => {
    const emailInput = document.createElement("input");
    emailInput.id = "login-email";
    emailInput.value = "test@example.com";

    const passwordInput = document.createElement("input");
    passwordInput.id = "login-password";
    passwordInput.value = "password123";

    const form = document.createElement("form");
    form.addEventListener = jest.fn();

    form.appendChild(emailInput);
    form.appendChild(passwordInput);

    const event = {
      preventDefault: jest.fn(),
      target: form,
    };

    // Mock the login function using fetchMock
    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ accessToken: "your-token" }),
    });

    // Mock the redirectUser and displayErrorMessage functions
    const redirectUserMock = jest.fn();
    const displayErrorMessageMock = jest.fn();

    redirectUser.mockImplementation(redirectUserMock);
    displayErrorMessage.mockImplementation(displayErrorMessageMock);

    await handleLogin(event);

    // Ensure preventDefault was called
    expect(event.preventDefault).toHaveBeenCalled();

    // Check if login was called with the correct arguments
    expect(login).toHaveBeenCalledWith("test@example.com", "password123");

    // Check if localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith("jwtToken", "your-token");

    // Check if redirectUser was called with the correct arguments
    expect(redirectUserMock).toHaveBeenCalledWith("/feed");

    // Reset mocks
    jest.restoreAllMocks();
  });

  it("should display an error message for invalid credentials", async () => {
    const emailInput = document.createElement("input");
    emailInput.id = "login-email";
    emailInput.value = "invalid@example.com";

    const passwordInput = document.createElement("input");
    passwordInput.id = "login-password";
    passwordInput.value = "invalid-password";

    const form = document.createElement("form");
    form.addEventListener = jest.fn();

    form.appendChild(emailInput);
    form.appendChild(passwordInput);

    const event = {
      preventDefault: jest.fn(),
      target: form,
    };

    // Mock the login function to throw an error for invalid credentials using fetchMock
    fetchMock.mockRejectedValueOnce(new Error("Invalid credentials"));

    // Mock the displayErrorMessage function
    const displayErrorMessageMock = jest.fn();

    displayErrorMessage.mockImplementation(displayErrorMessageMock);

    await handleLogin(event);

    // Ensure preventDefault was called
    expect(event.preventDefault).toHaveBeenCalled();

    // Check if login was called with the correct arguments
    expect(login).toHaveBeenCalledWith(
      "invalid@example.com",
      "invalid-password"
    );

    // Check if displayErrorMessage was called with the correct arguments
    expect(displayErrorMessageMock).toHaveBeenCalledWith(
      "loginError",
      "Invalid credentials"
    );

    // Reset mocks
    jest.restoreAllMocks();
  });
});

// Export the wrapper function
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
