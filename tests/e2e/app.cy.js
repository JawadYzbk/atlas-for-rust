/// <reference types="cypress" />

describe('RustLink Application', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockElectronIPC();
  });

  describe('Initial Load', () => {
    it('should load the application', () => {
      cy.contains('RustLink').should('be.visible');
    });

    it('should show connect screen when not authenticated', () => {
      cy.mockDataStore();
      cy.visit('/');
      cy.contains('Connect with Rust+').should('be.visible');
    });

    it('should show main interface when authenticated', () => {
      cy.mockAuthenticatedUser();
      cy.visit('/');
      cy.waitForVue();
      // Should show server selection or main map
      cy.get('[data-testid="app-container"]').should('exist');
    });
  });

  describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.mockDataStore();
    });

    it('should initiate Rust+ authentication on button click', () => {
      cy.contains('Connect with Rust+').click();
      cy.get('@ipcSend').should('have.been.calledWith', 'connect-with-rustplus');
    });

    it('should handle successful authentication', () => {
      cy.window().then(win => {
        // Simulate successful auth callback
        const authData = {
          steamId: '76561198012345678',
          token: 'test-token',
        };

        // Trigger the IPC callback
        const callback = win.ipcRenderer.on.withArgs('connect-with-rustplus.success').firstCall.args[1];
        if (callback) {
          callback({}, authData);
        }
      });

      // Should store credentials and update UI
      cy.contains('Connect with Rust+').should('not.exist');
    });
  });

  describe('Server Management', () => {
    beforeEach(() => {
      cy.mockAuthenticatedUser();
      cy.visit('/');
    });

    it('should display server list when authenticated', () => {
      cy.get('[data-testid="server-list"]').should('exist');
      cy.contains('Test Server').should('be.visible');
    });

    it('should open add server modal', () => {
      cy.get('[data-testid="add-server-btn"]').click();
      cy.get('[data-testid="add-server-modal"]').should('be.visible');
    });

    it('should allow adding a new server manually', () => {
      cy.get('[data-testid="add-server-btn"]').click();

      cy.get('[data-testid="server-ip"]').type('192.168.1.1');
      cy.get('[data-testid="server-port"]').type('28082');
      cy.get('[data-testid="player-id"]').type('12345');
      cy.get('[data-testid="player-token"]').type('test-token');

      cy.get('[data-testid="add-server-submit"]').click();

      // Should call addServer on DataStore
      cy.window().then(win => {
        expect(win.DataStore.Server.addServer).to.have.been.called;
      });
    });
  });

  describe('Notification Center', () => {
    beforeEach(() => {
      cy.mockAuthenticatedUser();
      cy.mockDataStore({
        notifications: [
          {
            id: 'notif-1',
            timestamp: Date.now(),
            channel: 1001,
            title: 'Test Notification',
            body: 'Test notification body',
            read: false,
          },
        ],
      });
      cy.visit('/');
    });

    it('should display notification center', () => {
      cy.get('[data-testid="notification-center"]').should('exist');
    });

    it('should show notification count badge', () => {
      cy.get('[data-testid="notification-badge"]').should('contain', '1');
    });

    it('should open notification center on click', () => {
      cy.get('[data-testid="notification-center-btn"]').click();
      cy.get('[data-testid="notification-list"]').should('be.visible');
    });

    it('should display notifications in the list', () => {
      cy.get('[data-testid="notification-center-btn"]').click();
      cy.contains('Test Notification').should('be.visible');
      cy.contains('Test notification body').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should display error when server connection fails', () => {
      cy.mockAuthenticatedUser();
      cy.visit('/');

      // Simulate connection error
      cy.window().then(win => {
        // Trigger error event
        const errorCallback = win.ipcRenderer.on.withArgs('rustplus-error').firstCall?.args[1];
        if (errorCallback) {
          errorCallback({}, { error: 'Connection failed' });
        }
      });

      cy.contains('Connection failed').should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '**/api/**', { forceNetworkError: true });
      cy.mockAuthenticatedUser();
      cy.visit('/');

      // Should show error message
      cy.contains(/error|failed|unable/i, { timeout: 10000 });
    });
  });
});
