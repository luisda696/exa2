// js/storage/VersionedStorage.js
// Almacenamiento con versionado y migración

import { STORAGE_KEYS, DEFAULT_CONFIG } from '../config/constants.js';

export class VersionedStorage {
  static VERSION = 2;

  static save(data) {
    try {
      const payload = {
        version: this.VERSION,
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(STORAGE_KEYS.TOURNAMENT, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage', e);
      return false;
    }
  }

  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENT);
      if (!raw) return null;

      const payload = JSON.parse(raw);
      if (payload.version !== this.VERSION) {
        // Migrar datos de versión anterior (si es necesario)
        return this.migrate(payload);
      }
      return payload.data;
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return null;
    }
  }

  static migrate(oldPayload) {
    // Migración simple: si es versión 1, convertir a v2
    if (oldPayload.version === 1) {
      const oldData = oldPayload.data;
      // Asegurar campos nuevos
      const migrated = {
        ...oldData,
        config: {
          ...DEFAULT_CONFIG,
          ...oldData.config,
          selectedDays: oldData.config?.selectedDays || DEFAULT_CONFIG.selectedDays
        }
      };
      // Guardar con nueva versión
      this.save(migrated);
      return migrated;
    }
    return null;
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEYS.TOURNAMENT);
  }

  static saveHistory(historyEntry) {
    try {
      const history = this.loadHistory();
      history.unshift(historyEntry);
      // Mantener últimos 25
      const trimmed = history.slice(0, 25);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
      return true;
    } catch (e) {
      return false;
    }
  }

  static loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  static clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  static saveAds(ads) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
    } catch (e) {}
  }

  static loadAds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}
