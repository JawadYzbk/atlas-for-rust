import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Electron modules
global.window = global.window || {};

// Mock Electron Store
vi.mock('electron-store', () => {
  return {
    default: class ElectronStore {
      constructor() {
        this.store = new Map();
      }
      get(key) {
        return this.store.get(key);
      }
      set(key, value) {
        this.store.set(key, value);
      }
      delete(key) {
        this.store.delete(key);
      }
      clear() {
        this.store.clear();
      }
    }
  };
});

// Mock Electron IPC
global.window.ipcRenderer = {
  send: vi.fn(),
  on: vi.fn(),
  once: vi.fn(),
  removeListener: vi.fn(),
  invoke: vi.fn(),
};

// Mock DataStore modules
global.window.DataStore = {
  Config: {
    getRustPlusToken: vi.fn(),
    setRustPlusToken: vi.fn(),
    getExpoDeviceId: vi.fn(),
    setExpoDeviceId: vi.fn(),
  },
  Server: {
    getServers: vi.fn(() => []),
    addServer: vi.fn(),
    removeServer: vi.fn(),
    updateServer: vi.fn(),
  },
  FCM: {
    getCredentials: vi.fn(),
    setCredentials: vi.fn(),
  },
  Entity: {
    getEntities: vi.fn(() => []),
    addEntity: vi.fn(),
    removeEntity: vi.fn(),
    updateEntity: vi.fn(),
  },
  Notification: {
    getNotifications: vi.fn(() => []),
    addNotification: vi.fn(),
    clearNotifications: vi.fn(),
  },
};

// Mock Protocol Buffers
global.window.Protobuf = {
  load: vi.fn(() => Promise.resolve({
    lookupType: vi.fn(() => ({
      encode: vi.fn(() => ({ finish: vi.fn(() => new Uint8Array()) })),
      decode: vi.fn(() => ({})),
    })),
  })),
};

// Mock EntityControlService
global.window.EntityControlService = {
  getEntityInfo: vi.fn(),
  setEntityValue: vi.fn(),
  toggleEntity: vi.fn(),
  getEntityTypeName: vi.fn(),
};

// Suppress console logs during tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
