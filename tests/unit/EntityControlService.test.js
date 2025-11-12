import { describe, it, expect, vi, beforeEach } from 'vitest';
import EntityControlService from '@/js/services/EntityControlService';

describe('EntityControlService', () => {
  let service;
  let mockProtospec;
  let mockClient;

  beforeEach(() => {
    // Create mock protospec
    mockProtospec = {
      lookupType: vi.fn(() => ({
        encode: vi.fn(() => ({ finish: vi.fn(() => new Uint8Array([1, 2, 3])) })),
        decode: vi.fn(() => ({
          response: {
            entityInfo: {
              payload: { value: true }
            }
          }
        })),
      })),
    };

    // Create mock WebSocket client
    mockClient = {
      send: vi.fn(),
      on: vi.fn(),
      readyState: 1, // OPEN
    };

    service = new EntityControlService(mockProtospec, mockClient);
  });

  describe('Constructor', () => {
    it('should initialize with protospec and client', () => {
      expect(service.protospec).toBe(mockProtospec);
      expect(service.client).toBe(mockClient);
    });

    it('should initialize with default sequence number', () => {
      expect(service.seq).toBe(1);
    });
  });

  describe('getEntityInfo', () => {
    it('should request entity info for given entity ID', async () => {
      const entityId = 123456;

      // Mock the response
      const mockResponse = {
        response: {
          entityInfo: {
            type: 1,
            payload: { value: true, capacity: 100 }
          }
        }
      };

      // Setup mock to resolve with response
      service.sendRequest = vi.fn().mockResolvedValue(mockResponse);

      const result = await service.getEntityInfo(entityId);

      expect(service.sendRequest).toHaveBeenCalledWith({
        entityId: entityId,
        getEntityInfo: {}
      });
      expect(result).toEqual(mockResponse.response.entityInfo);
    });

    it('should handle errors when getting entity info', async () => {
      const entityId = 123456;
      service.sendRequest = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(service.getEntityInfo(entityId)).rejects.toThrow('Network error');
    });
  });

  describe('setEntityValue', () => {
    it('should set entity value to true', async () => {
      const entityId = 123456;
      const value = true;

      service.sendRequest = vi.fn().mockResolvedValue({
        response: { success: true }
      });

      const result = await service.setEntityValue(entityId, value);

      expect(service.sendRequest).toHaveBeenCalledWith({
        entityId: entityId,
        setEntityValue: { value: value }
      });
      expect(result.response.success).toBe(true);
    });

    it('should set entity value to false', async () => {
      const entityId = 123456;
      const value = false;

      service.sendRequest = vi.fn().mockResolvedValue({
        response: { success: true }
      });

      await service.setEntityValue(entityId, value);

      expect(service.sendRequest).toHaveBeenCalledWith({
        entityId: entityId,
        setEntityValue: { value: value }
      });
    });
  });

  describe('toggleEntity', () => {
    it('should toggle entity from true to false', async () => {
      const entityId = 123456;

      // Mock getEntityInfo to return current value = true
      service.getEntityInfo = vi.fn().mockResolvedValue({
        payload: { value: true }
      });

      // Mock setEntityValue
      service.setEntityValue = vi.fn().mockResolvedValue({
        response: { success: true }
      });

      const newValue = await service.toggleEntity(entityId);

      expect(service.getEntityInfo).toHaveBeenCalledWith(entityId);
      expect(service.setEntityValue).toHaveBeenCalledWith(entityId, false);
      expect(newValue).toBe(false);
    });

    it('should toggle entity from false to true', async () => {
      const entityId = 123456;

      service.getEntityInfo = vi.fn().mockResolvedValue({
        payload: { value: false }
      });

      service.setEntityValue = vi.fn().mockResolvedValue({
        response: { success: true }
      });

      const newValue = await service.toggleEntity(entityId);

      expect(service.setEntityValue).toHaveBeenCalledWith(entityId, true);
      expect(newValue).toBe(true);
    });

    it('should handle missing payload gracefully', async () => {
      const entityId = 123456;

      service.getEntityInfo = vi.fn().mockResolvedValue({});
      service.setEntityValue = vi.fn().mockResolvedValue({
        response: { success: true }
      });

      const newValue = await service.toggleEntity(entityId);

      expect(service.setEntityValue).toHaveBeenCalledWith(entityId, true);
      expect(newValue).toBe(true);
    });

    it('should throw error on failure', async () => {
      const entityId = 123456;

      service.getEntityInfo = vi.fn().mockRejectedValue(new Error('Connection lost'));

      await expect(service.toggleEntity(entityId)).rejects.toThrow('Failed to toggle entity');
    });
  });

  describe('getEntityTypeName', () => {
    it('should return "Switch" for type 1', () => {
      expect(EntityControlService.getEntityTypeName(1)).toBe('Switch');
    });

    it('should return "Smart Alarm" for type 2', () => {
      expect(EntityControlService.getEntityTypeName(2)).toBe('Smart Alarm');
    });

    it('should return "Storage Monitor" for type 3', () => {
      expect(EntityControlService.getEntityTypeName(3)).toBe('Storage Monitor');
    });

    it('should return "Unknown" for invalid type', () => {
      expect(EntityControlService.getEntityTypeName(999)).toBe('Unknown');
    });

    it('should return "Unknown" for null', () => {
      expect(EntityControlService.getEntityTypeName(null)).toBe('Unknown');
    });
  });

  describe('Sequence Number Management', () => {
    it('should increment sequence number on each request', () => {
      const initialSeq = service.seq;
      service.getNextSeq();
      expect(service.seq).toBe(initialSeq + 1);
    });

    it('should return current seq before incrementing', () => {
      const initialSeq = service.seq;
      const returnedSeq = service.getNextSeq();
      expect(returnedSeq).toBe(initialSeq);
      expect(service.seq).toBe(initialSeq + 1);
    });
  });
});
