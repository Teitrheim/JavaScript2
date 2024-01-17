describe("User Login Tests", () => {
  beforeEach(() => {
    // Mock the login API response for a successful login
    cy.intercept("POST", "https://api.noroff.dev/api/v1/social/auth/login", {
      statusCode: 200,
      body: {
        name: "my_username",
        email: "user@noroff.no",
        accessToken: "mocked_access_token",
      },
    }).as("loginRequest");
    // Visit the login page before each test
    cy.visit("/JavaScript2/index.html");
  });

  it("successfully logs in with valid credentials", () => {
    // Fill in the login form
    cy.get("#login-email").type("user@noroff.no");
    cy.get("#login-password").type("password123");
    cy.get('#login-form button[type="submit"]').click();

    cy.wait("@loginRequest"); // Wait for the mocked request to complete
    cy.url().should("include", "/feed");
    cy.get("#logout-button").should("exist");
  });

  it("displays an error for invalid credentials", () => {
    // Fill in the login form with invalid credentials
    cy.get("#login-email").type("invalid@noroff.no");
    cy.get("#login-password").type("wrongpassword");
    cy.get('#login-form button[type="submit"]').click();

    // Assert that an error message is shown
    cy.get("#loginError").should("exist");
    cy.get("#loginError").should("contain", "Invalid email or password");
  });
});
