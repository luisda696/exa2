/**
 * ============================================
 * VERSIONED STORAGE - PERSISTENCIA CON MIGRACIONES
 * ============================================
 * Maneja versiones de datos y migraciones automáticas
 * Previene QuotaExceededError limpiando datos antiguos
 * Versión: 2.0
 */

const VersionedStorage = {
    /**
     * Versión actual del schema de datos
     */
    CURRENT_VERSION: 2,
    
    /**
     * Claves de localStorage
     */
    KEYS: {
        DATA: 'pm12',
        HISTORY: 'pm12h',
        ADS: 'pm12ads',
        HEADER_STATE: 'pm12_hdr_collapsed'
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
            const version = data.version || 1; // Datos sin versión = v1
            
            // Ejecutar migraciones si es necesario
            if (version < this.CURRENT_VERSION) {
                return this.migrate(data, version);
            }
            
            return data;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    },

    /**
     * Guarda datos con versión
     * @param {object} data - Datos a guardar
     * @returns {boolean} - true si se guardó correctamente
     */
    save(data) {
        try {
            const dataWithVersion = {
                ...data,
                version: this.CURRENT_VERSION,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.KEYS.DATA, JSON.stringify(dataWithVersion));
            return true;
        } catch (e) {
            // Manejar QuotaExceededError
            if (e.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded, attempting cleanup...');
                this.handleQuotaExceeded(data);
            } else {
                console.error('Error saving data:', e);
            }
            return false;
        }
    },

    /**
     * Maneja error de cuota excedida
     * @param {object} data - Datos que se intentaron guardar
     */
    handleQuotaExceeded(data) {
        try {
            // Intentar limpiar imágenes antiguas (ocupan más espacio)
            if (data.tourLogo) {
                console.log('Removing tournament logo to free space...');
                data.tourLogo = null;
            }
            
            // Limpiar fotos de equipos
            if (data.teams && Array.isArray(data.teams)) {
                data.teams.forEach(team => {
                    if (team.photo) {
                        team.photo = null;
                        team.isVideo = false;
                    }
                    if (team.players && Array.isArray(team.players)) {
                        team.players.forEach(player => {
                            if (player.photo) {
                                player.photo = null;
                                player.isVideo = false;
                            }
                        });
                    }
                });
            }
            
            // Intentar guardar de nuevo
            localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
            console.log('Data saved after cleanup');
        } catch (e) {
            console.error('Failed to save even after cleanup:', e);
            alert('⚠️ Memoria llena. Elimina algunas imágenes o reinicia el torneo.');
        }
    },

    /**
     * Ejecuta migraciones entre versiones
     * @param {object} data - Datos actuales
     * @param {number} fromVersion - Versión de origen
     * @returns {object} - Datos migrados
     */
    migrate(data, fromVersion) {
        console.log(`Migrating from version ${fromVersion} to ${this.CURRENT_VERSION}`);
        
        let migrated = { ...data };
        
        // Migración 1 -> 2
        if (fromVersion < 2) {
            migrated = this.migrateV1toV2(migrated);
        }
        
        // Actualizar versión
        migrated.version = this.CURRENT_VERSION;
        
        // Guardar datos migrados
        this.save(migrated);
        
        return migrated;
    },

    /**
     * Migración de versión 1 a 2
     * Cambios: Agregar campo formatType a partidos, mejorar estructura
     * @param {object} data - Datos v1
     * @returns {object} - Datos v2
     */
    migrateV1toV2(data) {
        const migrated = { ...data };
        
        // Agregar formatType a partidos existentes
        if (migrated.matches && Array.isArray(migrated.matches)) {
            migrated.matches = migrated.matches.map(match => ({
                ...match,
                formatType: match.formatType || 'elimination' // Default para compatibilidad
            }));
        }
        
        // Agregar campos de configuración faltantes
        if (migrated.config) {
            migrated.config = {
                ...migrated.config,
                ptsWin: migrated.config.ptsWin || 3,
                ptsLoss: migrated.config.ptsLoss || 1,
                ptsDraw: migrated.config.ptsDraw || 2
            };
        }
        
        console.log('Migration v1->v2 completed');
        return migrated;
    },

    /**
     * Limpia todos los datos
     */
    clear() {
        try {
            localStorage.removeItem(this.KEYS.DATA);
        } catch (e) {
            console.error('Error clearing data:', e);
        }
    },

    /**
     * Guarda en historial
     * @param {object} data - Datos del torneo
     */
    saveToHistory(data) {
        try {
            const history = JSON.parse(localStorage.getItem(this.KEYS.HISTORY) || '[]');
            
            const historyEntry = {
                id: Date.now(),
                n: data.tourName || 'Torneo Pádel',
                date: new Date().toLocaleDateString('es'),
                fmt: this.getFormatName(data.config?.format),
                teams: data.teams?.filter(t => !t.isBye)?.length || 0,
                matches: data.matches?.length || 0,
                done: data.matches?.filter(m => m.done)?.length || 0,
                snap: JSON.stringify(data),
                version: this.CURRENT_VERSION
            };
            
            // Mantener solo últimos 25 torneos
            history.unshift(historyEntry);
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history.slice(0, 25)));
        } catch (e) {
            console.error('Error saving to history:', e);
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
    removeFromHistory(index) {
        try {
            const history = this.getHistory();
            history.splice(index, 1);
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {
            console.error('Error removing from history:', e);
        }
    },

    /**
     * Obtiene nombre legible del formato
     * @param {string} format - Código del formato
     * @returns {string} - Nombre del formato
     */
    getFormatName(format) {
        const formatMap = {
            elimination: 'Elim.',
            league: 'Liga',
            groups: 'Grupos',
            americano: 'Americano',
            mexicano: 'Mexicano',
            swiss: 'Suizo',
            custom: 'Personalizado'
        };
        return formatMap[format] || format;
    },

    /**
     * Guarda anuncios
     * @param {array} ads - Lista de anuncios
     */
    saveAds(ads) {
        try {
            localStorage.setItem(this.KEYS.ADS, JSON.stringify(ads));
        } catch (e) {
            console.error('Error saving ads:', e);
        }
    },

    /**
     * Obtiene anuncios
     * @returns {array} - Lista de anuncios
     */
    getAds() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.ADS) || '[]');
        } catch (e) {
            return [];
        }
    },

    /**
     * Guarda estado del header
     * @param {boolean} collapsed - true si está colapsado
     */
    saveHeaderState(collapsed) {
        try {
            localStorage.setItem(this.KEYS.HEADER_STATE, collapsed ? '1' : '0');
        } catch (e) {
            console.error('Error saving header state:', e);
        }
    },

    /**
     * Obtiene estado del header
     * @returns {boolean} - true si está colapsado
     */
    getHeaderState() {
        try {
            return localStorage.getItem(this.KEYS.HEADER_STATE) === '1';
        } catch (e) {
            return false;
        }
    }
};

// Exportar para uso global
window.VersionedStorage = VersionedStorage;
