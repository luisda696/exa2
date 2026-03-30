/**
 * ============================================
 * VERSIONEDSTORAGE.JS - Persistencia Versionada
 * ============================================
 * Sistema de migraciones entre versiones
 * Manejo de QuotaExceededError
 * Compatibilidad hacia atrás
 */

const VersionedStorage = {
    /**
     * Versión actual del esquema de datos
     */
    CURRENT_VERSION: 2,

    /**
     * Claves de localStorage
     */
    KEYS: {
        DATA: 'pm12',
        HISTORY: 'pm12h',
        ADS: 'pm12ads',
        HEADER: 'pm12_hdr_collapsed'
    },

    /**
     * Carga datos con migración de versión
     * @returns {object|null} - Datos cargados o null
     */
    load() {
        try {
            const raw = localStorage.getItem(this.KEYS.DATA);
            if (!raw) return null;

            const data = JSON.parse(raw);
            
            // Datos sin versión = versión 1
            const version = data.version || 1;

            // Migrar si es necesario
            if (version < this.CURRENT_VERSION) {
                return this._migrate(data, version);
            }

            return data;
        } catch (e) {
            console.error('Error cargando datos:', e);
            return null;
        }
    },

    /**
     * Guarda datos con versión
     * @param {object} data - Datos a guardar
     * @returns {boolean} - true si se guardó exitosamente
     */
    save(data) {
        try {
            // Agregar versión actual
            data.version = this.CURRENT_VERSION;
            data.savedAt = new Date().toISOString();

            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                // Intentar limpiar imágenes antiguas
                return this._handleQuotaExceeded(data);
            }
            console.error('Error guardando datos:', e);
            return false;
        }
    },

    /**
     * Maneja error de cuota excedida
     * @param {object} data - Datos a guardar
     * @returns {boolean} - true si se logró guardar después de limpiar
     */
    _handleQuotaExceeded(data) {
        console.warn('Cuota excedida, intentando limpiar...');

        // Intentar 1: Eliminar imágenes de equipos antiguos
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
            console.log('Datos guardados después de limpiar imágenes');
            return true;
        } catch (e) {
            // Intentar 2: Eliminar historial
            localStorage.removeItem(this.KEYS.HISTORY);
            
            try {
                localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
                console.log('Datos guardados después de limpiar historial');
                return true;
            } catch (e2) {
                console.error('No se pudo guardar incluso después de limpiar:', e2);
                alert('⚠️ Memoria llena. Elimina algunos torneos del historial o imágenes.');
                return false;
            }
        }
    },

    /**
     * Sistema de migraciones entre versiones
     * @param {object} data - Datos antiguos
     * @param {number} fromVersion - Versión de origen
     * @returns {object} - Datos migrados
     */
    _migrate(data, fromVersion) {
        console.log(`Migrando datos de versión ${fromVersion} a ${this.CURRENT_VERSION}`);

        let migrated = { ...data };

        // Migración 1 → 2
        if (fromVersion < 2) {
            migrated = this._migrateV1toV2(migrated);
        }

        // Agregar versión actual
        migrated.version = this.CURRENT_VERSION;

        // Guardar datos migrados
        this.save(migrated);

        return migrated;
    },

    /**
     * Migración de versión 1 a 2
     * - Agregar campo format a partidos
     * - Normalizar estructura de equipos
     * @param {object} data - Datos v1
     * @returns {object} - Datos v2
     */
    _migrateV1toV2(data) {
        const migrated = { ...data };

        // Agregar formato a partidos existentes
        if (migrated.matches && Array.isArray(migrated.matches)) {
            migrated.matches = migrated.matches.map(match => ({
                ...match,
                format: migrated.config?.format || 'elimination'
            }));
        }

        // Normalizar equipos
        if (migrated.teams && Array.isArray(migrated.teams)) {
            migrated.teams = migrated.teams.map(team => ({
                ...team,
                category: team.category || 7,
                seed: team.seed || false,
                players: team.players || []
            }));
        }

        console.log('Migración v1→v2 completada');
        return migrated;
    },

    /**
     * Limpia todos los datos
     */
    clear() {
        try {
            localStorage.removeItem(this.KEYS.DATA);
        } catch (e) {
            console.error('Error limpiando datos:', e);
        }
    },

    /**
     * Guarda en historial
     * @param {object} snapshot - Instantánea del torneo
     */
    saveHistory(snapshot) {
        try {
            const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
            history.unshift({
                id: Date.now(),
                savedAt: new Date().toISOString(),
                ...snapshot
            });
            
            // Mantener solo últimos 25 torneos
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history.slice(0, 25)));
        } catch (e) {
            console.error('Error guardando historial:', e);
        }
    },

    /**
     * Obtiene historial
     * @returns {array} - Lista de torneos guardados
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
        } catch (e) {
            return [];
        }
    },

    /**
     * Elimina entrada del historial
     * @param {number} index - Índice a eliminar
     */
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

// Exportar para uso global
window.VersionedStorage = VersionedStorage;
