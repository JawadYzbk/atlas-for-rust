import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock electron-store
const mockStore = new Map();
const ElectronStore = {
  get: vi.fn((key) => mockStore.get(key)),
  set: vi.fn((key, value) => mockStore.set(key, value)),
  delete: vi.fn((key) => mockStore.delete(key)),
  clear: vi.fn(() => mockStore.clear()),
};

vi.mock('electron-store', () => ({
  default: class {
    get(key) { return ElectronStore.get(key); }
    set(key, value) { return ElectronStore.set(key, value); }
    delete(key) { return ElectronStore.delete(key); }
    clear() { return ElectronStore.clear(); }
  }
}));

// Import DataStore modules after mocking
import ConfigDataStore from '@/js/datastore/ConfigDataStore';
import ServerDataStore from '@/js/datastore/ServerDataStore';
import EntityDataStore from '@/js/datastore/EntityDataStore';
import FCMDataStore from '@/js/datastore/FCMDataStore';
import NotificationDataStore from '@/js/datastore/NotificationDataStore';

describe('DataStore Modules', () => {
  beforeEach(() => {
    mockStore.clear();
    vi.clearAllMocks();
  });

  describe('ConfigDataStore', () => {
    it('should store and retrieve Rust+ token', () => {
      const token = 'test-token-12345';
      ConfigDataStore.setRustPlusToken(token);
      expect(ElectronStore.set).toHaveBeenCalledWith('rustPlusToken', token);

      const retrieved = ConfigDataStore.getRustPlusToken();
      expect(ElectronStore.get).toHaveBeenCalledWith('rustPlusToken');
    });

    it('should store and retrieve Steam ID', () => {
      const steamId = '76561198012345678';
      ConfigDataStore.setSteamId(steamId);
      expect(ElectronStore.set).toHaveBeenCalledWith('steamId', steamId);

      const retrieved = ConfigDataStore.getSteamId();
      expect(ElectronStore.get).toHaveBeenCalledWith('steamId');
    });

    it('should store and retrieve Expo device ID', () => {
      const deviceId = 'expo-device-id-123';
      ConfigDataStore.setExpoDeviceId(deviceId);
      expect(ElectronStore.set).toHaveBeenCalledWith('expoDeviceId', deviceId);

      const retrieved = ConfigDataStore.getExpoDeviceId();
      expect(ElectronStore.get).toHaveBeenCalledWith('expoDeviceId');
    });

    it('should clear all config data', () => {
      ConfigDataStore.clear();
      expect(ElectronStore.delete).toHaveBeenCalledWith('rustPlusToken');
      expect(ElectronStore.delete).toHaveBeenCalledWith('steamId');
    });
  });

  describe('ServerDataStore', () => {
    const mockServer = {
      id: 'server-1',
      name: 'Test Server',
      ip: '127.0.0.1',
      port: 28082,
      playerId: '12345',
      playerToken: 'token123'
    };

    it('should add a server', () => {
      mockStore.set('servers', []);
      ServerDataStore.addServer(mockServer);

      expect(ElectronStore.set).toHaveBeenCalled();
      const servers = mockStore.get('servers');
      expect(servers).toContainEqual(mockServer);
    });

    it('should retrieve all servers', () => {
      const servers = [mockServer];
      mockStore.set('servers', servers);

      const retrieved = ServerDataStore.getServers();
      expect(ElectronStore.get).toHaveBeenCalledWith('servers');
    });

    it('should remove a server by ID', () => {
      const servers = [mockServer, { ...mockServer, id: 'server-2' }];
      mockStore.set('servers', servers);

      ServerDataStore.removeServer('server-1');

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should update a server', () => {
      mockStore.set('servers', [mockServer]);

      const updated = { ...mockServer, name: 'Updated Server' };
      ServerDataStore.updateServer(updated);

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should return empty array if no servers', () => {
      mockStore.set('servers', undefined);
      const servers = ServerDataStore.getServers();
      expect(servers).toEqual([]);
    });
  });

  describe('EntityDataStore', () => {
    const mockEntity = {
      id: 'entity-1',
      serverId: 'server-1',
      entityId: 123456,
      name: 'Main Switch',
      type: 1
    };

    it('should add an entity', () => {
      mockStore.set('entities', []);
      EntityDataStore.addEntity(mockEntity);

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should get entities for a server', () => {
      const entities = [
        mockEntity,
        { ...mockEntity, id: 'entity-2', serverId: 'server-2' }
      ];
      mockStore.set('entities', entities);

      const serverEntities = EntityDataStore.getEntities('server-1');
      expect(serverEntities).toHaveLength(1);
      expect(serverEntities[0].id).toBe('entity-1');
    });

    it('should remove an entity', () => {
      mockStore.set('entities', [mockEntity]);
      EntityDataStore.removeEntity('entity-1');

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should update an entity', () => {
      mockStore.set('entities', [mockEntity]);

      const updated = { ...mockEntity, name: 'Updated Switch' };
      EntityDataStore.updateEntity(updated);

      expect(ElectronStore.set).toHaveBeenCalled();
    });
  });

  describe('FCMDataStore', () => {
    const mockCredentials = {
      fcm: {
        token: 'fcm-token-123',
        androidId: 'android-id-123',
        securityToken: 'security-token-123'
      }
    };

    it('should store FCM credentials', () => {
      FCMDataStore.setCredentials(mockCredentials);
      expect(ElectronStore.set).toHaveBeenCalledWith('fcmCredentials', mockCredentials);
    });

    it('should retrieve FCM credentials', () => {
      mockStore.set('fcmCredentials', mockCredentials);
      const retrieved = FCMDataStore.getCredentials();
      expect(ElectronStore.get).toHaveBeenCalledWith('fcmCredentials');
    });

    it('should clear FCM credentials', () => {
      FCMDataStore.clear();
      expect(ElectronStore.delete).toHaveBeenCalledWith('fcmCredentials');
    });
  });

  describe('NotificationDataStore', () => {
    const mockNotification = {
      id: 'notif-1',
      timestamp: Date.now(),
      channel: 1001,
      title: 'Test Notification',
      body: 'Test body',
      read: false
    };

    it('should add a notification', () => {
      mockStore.set('notifications', []);
      NotificationDataStore.addNotification(mockNotification);

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should get all notifications', () => {
      const notifications = [mockNotification];
      mockStore.set('notifications', notifications);

      const retrieved = NotificationDataStore.getNotifications();
      expect(retrieved).toEqual(notifications);
    });

    it('should clear all notifications', () => {
      NotificationDataStore.clearNotifications();
      expect(ElectronStore.set).toHaveBeenCalledWith('notifications', []);
    });

    it('should mark notification as read', () => {
      mockStore.set('notifications', [mockNotification]);
      NotificationDataStore.markAsRead('notif-1');

      expect(ElectronStore.set).toHaveBeenCalled();
    });

    it('should remove old notifications', () => {
      const old = { ...mockNotification, timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000) };
      const recent = { ...mockNotification, id: 'notif-2', timestamp: Date.now() };

      mockStore.set('notifications', [old, recent]);
      NotificationDataStore.removeOldNotifications(30); // Keep 30 days

      expect(ElectronStore.set).toHaveBeenCalled();
    });
  });
});
