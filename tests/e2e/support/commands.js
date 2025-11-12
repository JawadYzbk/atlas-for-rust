// Custom Cypress commands for RustLink

// Command to mock Electron IPC
Cy.Commands.add('mockElectronIPC', () => {
  cy.window().then(win => {
    win.ipcRenderer = {
      send: cy.stub().as('ipcSend'),
      on: cy.stub().as('ipcOn'),
      once: cy.stub().as('ipcOnce'),
      removeListener: cy.stub().as('ipcRemoveListener'),
      invoke: cy.stub().as('ipcInvoke').resolves(),
    };
  });
});

// Command to mock DataStore
Cy.Commands.add('mockDataStore', (mockData = {}) => {
  cy.window().then(win => {
    win.DataStore = {
      Config: {
        getRustPlusToken: cy.stub().returns(mockData.rustPlusToken || null),
        getSteamId: cy.stub().returns(mockData.steamId || null),
        getExpoDeviceId: cy.stub().returns(mockData.expoDeviceId || null),
      },
      Server: {
        getServers: cy.stub().returns(mockData.servers || []),
        addServer: cy.stub(),
        removeServer: cy.stub(),
        updateServer: cy.stub(),
      },
      FCM: {
        getCredentials: cy.stub().returns(mockData.fcmCredentials || null),
      },
      Entity: {
        getEntities: cy.stub().returns(mockData.entities || []),
      },
      Notification: {
        getNotifications: cy.stub().returns(mockData.notifications || []),
      },
    };
  });
});

// Command to mock authenticated state
Cy.Commands.add('mockAuthenticatedUser', (steamId = '76561198012345678') => {
  cy.mockDataStore({
    rustPlusToken: 'test-token-12345',
    steamId: steamId,
    expoDeviceId: 'test-device-id',
    servers: [
      {
        id: 'server-1',
        name: 'Test Server',
        ip: '127.0.0.1',
        port: 28082,
        playerId: '12345',
        playerToken: 'token123',
      },
    ],
  });
});

// Command to wait for component to be mounted
Cy.Commands.add('waitForVue', () => {
  cy.window().should('have.property', 'app');
});
