/**
 * ============================================
 * VERSIONEDSTORAGE.JS - Persistencia Versionada
 * ============================================
 */

const VersionedStorage = {
    CURRENT_VERSION: 2,

    KEYS: {
        DATA: 'pm12',
        HISTORY: 'pm12h',
        ADS: 'pm12ads',
        HEADER: 'pm12_hdr_collapsed'
    },

    load() {
        try {
            const raw = localStorage.getItem(this.KEYS.DATA);
            if (!raw) return null;

            const data = JSON.parse(raw);
            const version = data.version || 1;

            if (version < this.CURRENT_VERSION) {
                return this._migrate(data, version);
            }

            return data;
        } catch (e) {
            console.error('Error cargando datos:', e);
            return null;
        }
    },

    save(data) {
        try {
            data.version = this.CURRENT_VERSION;
            data.savedAt = new Date().toISOString();

            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                return this._handleQuotaExceeded(data);
            }
            console.error('Error guardando datos:', e);
            return false;
        }
    },

    _handleQuotaExceeded(data) {
        console.warn('Cuota excedida, intentando limpiar...');

        if (data.teams) {
            data.teams.forEach(team => {
                if (team.photo && team.photo.length > 1000) {
                    team.photo = null;
                }
                if (team.players) {
                    team.players.forEach(p => {
                        if (p.photo && p.photo.length > 1000) {
                            p.photo = null;
                        }
                    });
                }
            });
        }

        try {
            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
            return true;
        } catch (e) {
            localStorage.removeItem(this.KEYS.HISTORY);
            
            try {
                localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
                return true;
            } catch (e2) {
                console.error('No se pudo guardar:', e2);
                alert('⚠️ Memoria llena. Elimina algunos torneos del historial.');
                return false;
            }
        }
    },

    _migrate(data, fromVersion) {
        console.log(`Migrando datos de versión ${fromVersion} a ${this.CURRENT_VERSION}`);

        let migrated = { ...data };

        if (fromVersion < 2) {
            migrated = this._migrateV1toV2(migrated);
        }

        migrated.version = this.CURRENT_VERSION;
        this.save(migrated);

        return migrated;
    },

    _migrateV1toV2(data) {
        const migrated = { ...data };

        if (migrated.matches && Array.isArray(migrated.matches)) {
            migrated.matches = migrated.matches.map(match => ({
                ...match,
                format: migrated.config?.format || 'elimination'
            }));
        }

        if (migrated.teams && Array.isArray(migrated.teams)) {
            migrated.teams = migrated.teams.map(team => ({
                ...team,
                category: team.category || 7,
                seed: team.seed || false,
                players: team.players || []
            }));
        }

        return migrated;
    },

    clear() {
        try {
            localStorage.removeItem(this.KEYS.DATA);
        } catch (e) {
            console.error('Error limpiando datos:', e);
        }
    },

    saveHistory(snapshot) {
        try {
            const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
            history.unshift({
                id: Date.now(),
                savedAt: new Date().toISOString(),
                ...snapshot
            });
            
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history.slice(0, 25)));
        } catch (e) {
            console.error('Error guardando historial:', e);
        }
    },

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        } catch (e) {
            return [];
        }
    },

    deleteHistory(index) {
        try {
            const history = this.getHistory();
            history.splice(index, 1);
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {
            console.error('Error eliminando del historial:', e);
        }
    }
};

window.VersionedStorage = VersionedStorage;
