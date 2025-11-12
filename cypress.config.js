const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/e2e.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: false,
    screenshotOnRunFailure: true,
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack',
    },
    specPattern: 'tests/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});
