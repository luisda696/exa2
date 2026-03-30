/**
 * ============================================
 * SCORINGENGINE.JS - Sistema de Puntuación Modular
 * ============================================
 * Mapeo directo del tipo de set seleccionado
 * Validaciones estrictas de puntuación
 */

const ScoringEngine = {
    /**
     * Configuración de cada tipo de set
     */
    configs: {
        normal: {
            gamesPerSet: 6,
            tiebreakPoints: 7,
            setsToWin: 2,
            isProSet: false,
            name: 'Normal'
        },
        short: {
            gamesPerSet: 4,
            tiebreakPoints: 7,
            setsToWin: 2,
            isProSet: false,
            name: 'Short Set'
        },
        pro: {
            gamesPerSet: 8,
            tiebreakPoints: 10,
            setsToWin: 1,
            isProSet: true,
            name: 'Pro Set'
        },
        champions: {
            gamesPerSet: 6,
            tiebreakPoints: 10,
            setsToWin: 2,
            isProSet: false,
            hasSuperTiebreak: true,
            name: 'Champions'
        },
        custom: {
            gamesPerSet: 6,
            tiebreakPoints: 7,
            setsToWin: 2,
            isProSet: false,
            name: 'Personalizado'
        }
    },

    /**
     * Obtiene configuración basada en tipo seleccionado
     * @param {string} setType - Tipo de set (normal, short, pro, champions, custom)
     * @param {object} customConfig - Configuración personalizada si aplica
     * @returns {object} - Configuración completa
     */
    getConfig(setType, customConfig = {}) {
        const base = this.configs[setType] || this.configs.normal;
        
        if (setType === 'custom') {
            return {
                ...base,
                gamesPerSet: Math.max(1, Math.min(15, customConfig.gamesPerSet || 6)),
                tiebreakPoints: Math.max(5, Math.min(25, customConfig.tiebreakPoints || 7))
            };
        }
        
        return { ...base };
    },

    /**
     * Valida un set individual
     * @param {number} score1 - Games jugador 1
     * @param {number} score2 - Games jugador 2
     * @param {object} config - Configuración del set
     * @param {array} tiebreakScores - Puntos de tie-break [p1, p2] si aplica
     * @returns {object} - { valid: boolean, error: string, winner: number|null }
     */
    validateSet(score1, score2, config, tiebreakScores = null) {
        const { gamesPerSet, tiebreakPoints } = config;
        const maxWithTB = gamesPerSet + 1;

        // Set vacío es válido (pendiente)
        if (score1 === 0 && score2 === 0) {
            return { valid: true, error: null, winner: null };
        }

        // Score inválido si supera el máximo
        if (score1 > maxWithTB || score2 > maxWithTB) {
            return { 
                valid: false, 
                error: `Score inválido. Máximo ${maxWithTB} games (con tie-break)`,
                winner: null 
            };
        }

        // Verificar empate en el límite
        if (score1 === gamesPerSet && score2 === gamesPerSet) {
            // Requiere tie-break
            if (!tiebreakScores || (tiebreakScores[0] === 0 && tiebreakScores[1] === 0)) {
                return {
                    valid: false,
                    error: `Empate ${gamesPerSet}-${gamesPerSet}. Debes registrar tie-break`,
                    winner: null
                };
            }

            // Validar tie-break
            const tbDiff = Math.abs(tiebreakScores[0] - tiebreakScores[1]);
            const tbMax = Math.max(tiebreakScores[0], tiebreakScores[1]);
            
            if (tbMax < tiebreakPoints || tbDiff < 2) {
                return {
                    valid: false,
                    error: `Tie-Break inválido. Debe llegar a ${tiebreakPoints} puntos con diferencia de 2`,
                    winner: null
                };
            }

            return {
                valid: true,
                error: null,
                winner: tiebreakScores[0] > tiebreakScores[1] ? 1 : 2
            };
        }

        // Validar diferencia de 2 games
        const diff = Math.abs(score1 - score2);
        const maxScore = Math.max(score1, score2);

        if (maxScore >= gamesPerSet && diff < 2 && maxScore <= gamesPerSet) {
            return {
                valid: false,
                error: `Debe ganar por 2 games de diferencia o llegar a tie-break (${maxWithTB}-${gamesPerSet})`,
                winner: null
            };
        }

        // Determinar ganador
        let winner = null;
        if (score1 > score2) winner = 1;
        else if (score2 > score1) winner = 2;

        return { valid: true, error: null, winner };
    },

    /**
     * Valida partido completo
     * @param {array} sets - Array de sets [[s1a, s1b], [s2a, s2b], ...]
     * @param {object} config - Configuración
     * @returns {object} - { valid: boolean, error: string, winner: number|null }
     */
    validateMatch(sets, config) {
        const { setsToWin, hasSuperTiebreak } = config;
        
        if (!sets || sets.length === 0) {
            return { valid: false, error: 'No hay sets registrados', winner: null };
        }

        let wins1 = 0, wins2 = 0;
        
        for (let i = 0; i < sets.length; i++) {
            const set = sets[i];
            const score1 = set[0] || 0;
            const score2 = set[1] || 0;
            const tbScores = set.length > 2 ? [set[2], set[3]] : null;

            // El último set en Champions puede ser super tie-break
            if (hasSuperTiebreak && i === sets.length - 1 && score1 === 6 && score2 === 6) {
                if (!tbScores || tbScores[0] === 0 && tbScores[1] === 0) {
                    return { valid: false, error: 'Set 3 requiere Super Tie-Break (a 10 puntos)', winner: null };
                }
                
                const tbValid = this.validateSet(6, 6, config, tbScores);
                if (!tbValid.valid) return tbValid;
                
                if (tbValid.winner === 1) wins1++;
                else wins2++;
                continue;
            }

            const setResult = this.validateSet(score1, score2, config, tbScores);
            if (!setResult.valid) {
                return { valid: false, error: `Set ${i + 1}: ${setResult.error}`, winner: null };
            }

            if (setResult.winner === 1) wins1++;
            else if (setResult.winner === 2) wins2++;
        }

        // Determinar ganador del match
        let winner = null;
        if (wins1 >= setsToWin) winner = 1;
        else if (wins2 >= setsToWin) winner = 2;

        if (!winner && wins1 + wins2 >= setsToWin * 2 - 1) {
            // Todos los sets posibles jugados sin ganador claro
            return { valid: false, error: 'No hay ganador claro. Verifica los sets.', winner: null };
        }

        return { valid: winner !== null, error: winner ? null : 'Partido incompleto', winner };
    },

    /**
     * Calcula número de sets necesarios
     * @param {string} setType - Tipo de set
     * @returns {number} - Número de sets
     */
    getSetsCount(setType) {
        const config = this.configs[setType] || this.configs.normal;
        if (config.isProSet) return 1;
        if (config.hasSuperTiebreak) return 3;
        return config.setsToWin * 2 - 1;
    },

    /**
     * Verifica si el formato permite empates
     * @param {string} format - Formato del torneo
     * @returns {boolean} - true si permite empates
     */
    allowsDraws(format) {
        const allowedFormats = ['league', 'groups', 'swiss'];
        return allowedFormats.includes(format);
    }
};

// Exportar para uso global
window.ScoringEngine = ScoringEngine;
