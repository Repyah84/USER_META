// @ts-check
/// <reference types="cypress" />

import { MODEL_NAME, MODEL_PASSWORD } from "../src/const/auth.js";

describe("Login and check cookies", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("check the form auth", () => {
    cy.intercept("POST", "**/includes/login-access-user.php", (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.equal(200);
      });
    }).as("loginRequest");

    cy.visit("https://www.manyvids.com/Login");

    cy.get('input[name="userName"]').focus().type(MODEL_NAME);

    cy.wait(20000);

    cy.get('input[name="password"]').focus().type(MODEL_PASSWORD);

    cy.wait(30000);

    cy.get('button[type="submit"]').focus().click();

    cy.wait("@loginRequest");

    cy.url().should("not.include", "Login");

    cy.getCookies().then((cookies) => {
      cy.task("saveCookies", cookies);
    });
  });
});
