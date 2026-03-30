/**
 * VersionedStorage.js - Persistencia Versionada
 * Maneja migraciones entre versiones de datos
 */

const VersionedStorage = {
    CURRENT_VERSION: 2,
    KEY: 'pm12',
    HIST_KEY: 'pm12h',
    ADS_KEY: 'pm12ads',

    /**
     * Guarda datos con versión
     * @param {object} data - Datos a guardar
     */
    save(data) {
        try {
            const versioned = {
                ...data,
                version: this.CURRENT_VERSION,
                savedAt: Date.now()
            };
            localStorage.setItem(this.KEY, JSON.stringify(versioned));
        } catch (e) {
            // Manejar QuotaExceededError
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            console.error('Storage save error:', e);
        }
    },

    /**
     * Carga datos con migración automática
     * @returns {object|null} - Datos cargados o null
     */
    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return null;

            const data = JSON.parse(raw);
            const version = data.version || 1;

            // Ejecutar migraciones
            let migrated = data;
            if (version < this.CURRENT_VERSION) {
                migrated = this.migrate(data, version);
            }

            return migrated;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },

    /**
     * Ejecuta migraciones entre versiones
     * @param {object} data - Datos antiguos
     * @param {number} fromVersion - Versión de origen
     * @returns {object} - Datos migrados
     */
    migrate(data, fromVersion) {
        let migrated = { ...data };

        // Migración 1 → 2: Agregar campo version y normalizar formatos
        if (fromVersion < 2) {
            migrated = this.migrateV1toV2(migrated);
        }

        // Futuras migraciones aquí
        // if (fromVersion < 3) { migrated = this.migrateV2toV3(migrated); }

        migrated.version = this.CURRENT_VERSION;
        return migrated;
    },

    /**
     * Migración de versión 1 a 2
     * @param {object} data - Datos v1
     * @returns {object} - Datos v2
     */
    migrateV1toV2(data) {
        // Normalizar formato (eliminar 'custom' de formatos)
        if (data.c && data.c.format === 'custom') {
            data.c.format = 'elimination';
        }

        // Asegurar campos requeridos
        if (data.c) {
            data.c.gamesPerSet = data.c.gamesPerSet || 6;
            data.c.tiebreakPoints = data.c.tiebreakPoints || 7;
        }

        // Normalizar matches
        if (data.m && Array.isArray(data.m)) {
            data.m = data.m.map(m => ({
                ...m,
                isAmericano: m.isAmericano || false,
                isMexicano: m.isMexicano || false,
                isSwiss: m.isSwiss || false
            }));
        }

        return data;
    },

    /**
     * Maneja error de cuota excedida
     */
    handleQuotaExceeded() {
        try {
            // Limpiar imágenes antiguas del historial
            const hist = localStorage.getItem(this.HIST_KEY);
            if (hist) {
                const history = JSON.parse(hist);
                // Mantener solo últimos 10 torneos
                const trimmed = history.slice(0, 10).map(h => {
                    // Eliminar imágenes para ahorrar espacio
                    if (h.snap) {
                        const snap = JSON.parse(h.snap);
                        if (snap.logo) delete snap.logo;
                        if (snap.t) {
                            snap.t = snap.t.map(t => {
                                if (t.photo) delete t.photo;
                                if (t.players) {
                                    t.players = t.players.map(p => {
                                        if (p.photo) delete p.photo;
                                        return p;
                                    });
                                }
                                return t;
                            });
                        }
                        h.snap = JSON.stringify(snap);
                    }
                    return h;
                });
                localStorage.setItem(this.HIST_KEY, JSON.stringify(trimmed));
            }
        } catch (e) {
            console.error('Quota handling error:', e);
        }
    },

    /**
     * Guarda historial
     * @param {object} tournament - Datos del torneo
     */
    saveHistory(tournament) {
        try {
            const history = JSON.parse(localStorage.getItem(this.HIST_KEY) || '[]');
            const formats = {
                elimination: 'Elim.',
                league: 'Liga',
                groups: 'Grupos',
                americano: 'Americano',
                mexicano: 'Mexicano',
                swiss: 'Suizo'
            };

            history.unshift({
                id: Date.now(),
                n: tournament.tourName || 'Torneo',
                date: new Date().toLocaleDateString('es'),
                fmt: formats[tournament.config?.format] || tournament.config?.format || '—',
                teams: tournament.teams?.filter(t => !t.isBye).length || 0,
                matches: tournament.matches?.length || 0,
                done: tournament.matches?.filter(m => m.done).length || 0,
                snap: JSON.stringify({
                    n: tournament.tourName,
                    c: tournament.config,
                    t: tournament.teams,
                    m: tournament.matches
                })
            });

            // Mantener máximo 25 torneos
            localStorage.setItem(this.HIST_KEY, JSON.stringify(history.slice(0, 25)));
        } catch (e) {
            console.error('History save error:', e);
        }
    },

    /**
     * Obtiene historial
     * @returns {array} - Lista de torneos
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem(this.HIST_KEY) || '[]');
        } catch (e) {
            return [];
        }
    },

    /**
     * Limpia todos los datos
     */
    clear() {
        try {
            localStorage.removeItem(this.KEY);
        } catch (e) {
            console.error('Storage clear error:', e);
        }
    },

    /**
     * Guarda anuncios
     * @param {array} ads - Anuncios
     */
    saveAds(ads) {
        try {
            localStorage.setItem(this.ADS_KEY, JSON.stringify(ads));
        } catch (e) {
            console.error('Ads save error:', e);
        }
    },

    /**
     * Obtiene anuncios
     * @returns {array} - Lista de anuncios
     */
    getAds() {
        try {
            return JSON.parse(localStorage.getItem(this.ADS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionedStorage;
}
