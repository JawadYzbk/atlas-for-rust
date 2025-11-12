// Cypress E2E support file

// Import commands
import './commands';

// Global before hook
before(() => {
  // Clear application data before running tests
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Global beforeEach hook
beforeEach(() => {
  // Reset state before each test
  cy.clearLocalStorage();
});

// Handle uncaught exceptions
Cy.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // You can customize this based on your needs
  console.error('Uncaught exception:', err);
  return false;
});
