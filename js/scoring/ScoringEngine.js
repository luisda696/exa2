/**
 * ScoringEngine.js - Sistema de Puntuación Modular
 * Maneja todas las reglas de puntuación según configuración
 */

const ScoringEngine = {
    /**
     * Obtiene configuración de scoring basada en el tipo seleccionado
     * @param {string} setType - Tipo de set (normal, short, pro, champions, custom)
     * @param {string} tiebreakType - Tipo de tie-break
     * @param {number} customGames - Games personalizados (si aplica)
     * @param {number} customTiebreak - Puntos tie-break personalizados (si aplica)
     * @returns {object} - Configuración de scoring
     */
    getConfig(setType, tiebreakType, customGames = 6, customTiebreak = 7) {
        const config = {
            gamesPerSet: 6,
            tiebreakPoints: 7,
            setsToWin: 2,
            isProSet: false,
            isChampions: false
        };

        // Mapeo directo del tipo de set seleccionado
        switch (setType) {
            case 'normal':
                config.gamesPerSet = 6;
                config.tiebreakPoints = 7;
                config.setsToWin = 2;
                break;
            case 'short':
                config.gamesPerSet = 4;
                config.tiebreakPoints = 7;
                config.setsToWin = 2;
                break;
            case 'pro':
                config.gamesPerSet = 8;
                config.tiebreakPoints = 10;
                config.setsToWin = 1;
                config.isProSet = true;
                break;
            case 'champions':
                config.gamesPerSet = 6;
                config.tiebreakPoints = 10;
                config.setsToWin = 2;
                config.isChampions = true;
                break;
            case 'custom':
                config.gamesPerSet = Math.max(1, Math.min(15, customGames));
                config.tiebreakPoints = Math.max(5, Math.min(25, customTiebreak));
                config.setsToWin = 2;
                break;
        }

        // Override según tipo de tie-break
        if (tiebreakType === 'match' || tiebreakType === 'champions') {
            config.tiebreakPoints = 10;
        } else if (tiebreakType === 'custom') {
            config.tiebreakPoints = Math.max(5, Math.min(25, customTiebreak));
        }

        return config;
    },

    /**
     * Valida un set individual
     * @param {number} score1 - Games jugador 1
     * @param {number} score2 - Games jugador 2
     * @param {object} config - Configuración de scoring
     * @returns {object} - { valid: boolean, message: string, needsTiebreak: boolean }
     */
    validateSet(score1, score2, config) {
        const { gamesPerSet, tiebreakPoints } = config;
        const maxWithTB = gamesPerSet + 1;

        // Score vacío es válido (set no completado)
        if (score1 === 0 && score2 === 0) {
            return { valid: true, message: '', needsTiebreak: false };
        }

        // Verificar máximo
        if (score1 > maxWithTB || score2 > maxWithTB) {
            return { 
                valid: false, 
                message: `Máximo ${maxWithTB} games (con tie-break)`, 
                needsTiebreak: false 
            };
        }

        // Verificar empate en límite → requiere tie-break
        if (score1 === gamesPerSet && score2 === gamesPerSet) {
            return { valid: true, message: '', needsTiebreak: true };
        }

        // Verificar diferencia de 2 games si llegó al límite
        const maxScore = Math.max(score1, score2);
        const diff = Math.abs(score1 - score2);
        
        if (maxScore >= gamesPerSet && diff < 2 && maxScore <= gamesPerSet) {
            return { 
                valid: false, 
                message: 'Debe ganar por 2 games o llegar a tie-break', 
                needsTiebreak: false 
            };
        }

        return { valid: true, message: '', needsTiebreak: false };
    },

    /**
     * Valida puntos de tie-break
     * @param {number} tb1 - Puntos jugador 1
     * @param {number} tb2 - Puntos jugador 2
     * @param {number} tiebreakPoints - Puntos necesarios para ganar
     * @returns {object} - { valid: boolean, message: string }
     */
    validateTiebreak(tb1, tb2, tiebreakPoints) {
        if (tb1 === 0 && tb2 === 0) {
            return { valid: false, message: 'Ingrese puntos de tie-break' };
        }

        const diff = Math.abs(tb1 - tb2);
        const maxTb = Math.max(tb1, tb2);

        if (maxTb < tiebreakPoints) {
            return { valid: false, message: `Debe llegar a ${tiebreakPoints} puntos` };
        }

        if (diff < 2) {
            return { valid: false, message: 'Debe haber diferencia de 2 puntos' };
        }

        return { valid: true, message: '' };
    },

    /**
     * Determina ganador del set
     * @param {array} set - [score1, score2, tb1?, tb2?]
     * @param {object} config - Configuración de scoring
     * @returns {number} - 1 si gana jugador 1, 2 si gana jugador 2, 0 si incompleto
     */
    getSetWinner(set, config) {
        if (!set || set.length < 2) return 0;
        
        const [s1, s2, tb1, tb2] = set;
        const { gamesPerSet } = config;

        // Si hay empate en games, usar tie-break
        if (s1 === gamesPerSet && s2 === gamesPerSet) {
            if (tb1 > tb2) return 1;
            if (tb2 > tb1) return 2;
            return 0;
        }

        // Ganador por games
        if (s1 > s2) return 1;
        if (s2 > s1) return 2;
        return 0;
    },

    /**
     * Determina ganador del match
     * @param {array} sets - Array de sets
     * @param {object} config - Configuración de scoring
     * @returns {number} - 1 si gana jugador 1, 2 si gana jugador 2, 0 si incompleto
     */
    getMatchWinner(sets, config) {
        const { setsToWin, isProSet } = config;
        
        let wins1 = 0, wins2 = 0;
        
        for (const set of sets) {
            const winner = this.getSetWinner(set, config);
            if (winner === 1) wins1++;
            if (winner === 2) wins2++;
        }

        // Pro Set: 1 set único
        if (isProSet && sets.length >= 1) {
            const winner = this.getSetWinner(sets[0], config);
            return winner;
        }

        // Champions: 2 sets + super TB
        if (config.isChampions && sets.length >= 2) {
            if (wins1 > wins2) return 1;
            if (wins2 > wins1) return 2;
            // Si empate 1-1, verificar super TB en set 3
            if (sets.length >= 3) {
                return this.getSetWinner(sets[2], config);
            }
            return 0;
        }

        // Normal: mejor de 3 sets
        if (wins1 >= setsToWin) return 1;
        if (wins2 >= setsToWin) return 2;
        
        return 0;
    },

    /**
     * Permite empates según formato
     * @param {string} format - Formato del torneo
     * @returns {boolean} - true si permite empates
     */
    allowsDraws(format) {
        const drawFormats = ['league', 'groups', 'swiss'];
        return drawFormats.includes(format);
    },

    /**
     * Formatea score para display
     * @param {array} sets - Sets del match
     * @param {object} config - Configuración
     * @returns {string} - Score formateado
     */
    formatScore(sets, config) {
        if (!sets || sets.length === 0) return '—';
        
        return sets.map(set => {
            const [s1, s2, tb1, tb2] = set;
            if (s1 === config.gamesPerSet && s2 === config.gamesPerSet && tb1 && tb2) {
                return `${s1}-${s2}(${tb1}-${tb2})`;
            }
            return `${s1}-${s2}`;
        }).join(' ');
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoringEngine;
}
