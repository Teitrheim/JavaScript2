// login.test.js
const { describe, it, expect } = require("jest");

const jest = require("jest");

const { handleLogin, login, displayErrorMessage } = require("./auth/login");

describe("handleLogin", () => {
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

    // Mock the login function
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue({ accessToken: "your-token" }),
    });

    // Mock the redirectUser function
    const redirectUserMock = jest.spyOn(window.location, "href", "set");

    await handleLogin(event);

    // Ensure preventDefault was called
    expect(event.preventDefault).toHaveBeenCalled();

    // Check if login was called with the correct arguments
    expect(login).toHaveBeenCalledWith("test@example.com", "password123");

    // Check if localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith("jwtToken", "your-token");

    // Check if redirectUser was called with the correct page
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

    // Mock the login function to throw an error for invalid credentials
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("Invalid credentials"));

    // Mock the displayErrorMessage function
    const displayErrorMessageMock = jest.spyOn(
      displayErrorMessage,
      "loginError"
    );

    await handleLogin(event);

    // Ensure preventDefault was called
    expect(event.preventDefault).toHaveBeenCalled();

    // Check if login was called with the correct arguments
    expect(login).toHaveBeenCalledWith(
      "invalid@example.com",
      "invalid-password"
    );

    // Check if displayErrorMessage was called with the correct error message
    expect(displayErrorMessageMock).toHaveBeenCalledWith(
      "loginError",
      "Invalid credentials"
    );

    // Reset mocks
    jest.restoreAllMocks();
  });
});
