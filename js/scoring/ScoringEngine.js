/**
 * ============================================
 * SCORING ENGINE - SISTEMA DE PUNTUACIÓN MODULAR
 * ============================================
 * Maneja todas las reglas de puntuación según el tipo de set/tie-break
 * Versión: 2.0
 */

const ScoringEngine = {
    /**
     * Configuración de tipos de set
     */
    SET_CONFIGS: {
        normal: { gamesToWin: 6, tiebreakAt: 6, setsToWin: 2, tiebreakPoints: 7 },
        short: { gamesToWin: 4, tiebreakAt: 4, setsToWin: 2, tiebreakPoints: 7 },
        pro: { gamesToWin: 8, tiebreakAt: 8, setsToWin: 1, tiebreakPoints: 10 },
        champions: { gamesToWin: 6, tiebreakAt: 6, setsToWin: 2, tiebreakPoints: 10, superTiebreak: true },
        custom: { gamesToWin: 6, tiebreakAt: 6, setsToWin: 2, tiebreakPoints: 7 }
    },

    /**
     * Obtiene configuración según tipo seleccionado
     * @param {string} setType - Tipo de set (normal, short, pro, champions, custom)
     * @param {object} customConfig - Configuración personalizada si aplica
     * @returns {object} - Configuración completa
     */
    getConfig(setType, customConfig = {}) {
        const base = { ...this.SET_CONFIGS[setType] } || { ...this.SET_CONFIGS.normal };
        
        if (setType === 'custom') {
            base.gamesToWin = Math.max(1, Math.min(15, parseInt(customConfig.gamesPerSet) || 6));
            base.tiebreakAt = base.gamesToWin;
            base.tiebreakPoints = Math.max(5, Math.min(25, parseInt(customConfig.tiebreakPoints) || 7));
        }
        
        // Champions tiene reglas especiales
        if (setType === 'champions') {
            base.superTiebreak = true;
            base.tiebreakPoints = 10;
        }
        
        return base;
    },

    /**
     * Valida un set individual
     * @param {number} score1 - Games del jugador 1
     * @param {number} score2 - Games del jugador 2
     * @param {object} config - Configuración del set
     * @param {array} tiebreakScores - Puntos del tie-break [p1, p2] si aplica
     * @returns {object} - { valid: boolean, error: string, winner: number|null }
     */
    validateSet(score1, score2, config, tiebreakScores = null) {
        const { gamesToWin, tiebreakAt, tiebreakPoints } = config;
        const maxWithTB = gamesToWin + 1;
        
        // Set vacío es válido (pendiente)
        if (score1 === 0 && score2 === 0) {
            return { valid: true, error: null, winner: null };
        }
        
        // Validar rango máximo
        if (score1 > maxWithTB || score2 > maxWithTB) {
            return { 
                valid: false, 
                error: `Score inválido. Máximo ${maxWithTB} games (con tie-break)`,
                winner: null 
            };
        }
        
        // Verificar empate en límite de tie-break
        if (score1 === gamesToWin && score2 === gamesToWin) {
            if (!tiebreakScores || (tiebreakScores[0] === 0 && tiebreakScores[1] === 0)) {
                return {
                    valid: false,
                    error: `Empate ${gamesToWin}-${gamesToWin}. Debes registrar tie-break (ej: 7-5) o ganar ${maxWithTB}-${gamesToWin}`,
                    winner: null
                };
            }
            
            // Validar tie-break
            const tbValid = this.validateTiebreak(tiebreakScores[0], tiebreakScores[1], tiebreakPoints);
            if (!tbValid.valid) {
                return tbValid;
            }
            
            return { valid: true, error: null, winner: tiebreakScores[0] > tiebreakScores[1] ? 1 : 2 };
        }
        
        // Validar diferencia de 2 games
        const diff = Math.abs(score1 - score2);
        const maxScore = Math.max(score1, score2);
        
        if (maxScore >= gamesToWin && maxScore < maxWithTB && diff < 2) {
            return {
                valid: false,
                error: `Debe ganar por 2 games de diferencia o llegar a tie-break (${maxWithTB}-${gamesToWin})`,
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
     * Valida puntos de tie-break
     * @param {number} p1 - Puntos jugador 1
     * @param {number} p2 - Puntos jugador 2
     * @param {number} pointsToWin - Puntos necesarios para ganar
     * @returns {object} - { valid: boolean, error: string }
     */
    validateTiebreak(p1, p2, pointsToWin) {
        if (p1 === 0 && p2 === 0) {
            return { valid: true, error: null };
        }
        
        const minToWin = pointsToWin;
        const diff = Math.abs(p1 - p2);
        
        if (diff < 2) {
            return {
                valid: false,
                error: `Tie-Break inválido. Debe haber diferencia de 2 puntos (ej: ${pointsToWin}-5, ${pointsToWin + 2}-${pointsToWin})`
            };
        }
        
        if (Math.max(p1, p2) < minToWin) {
            return {
                valid: false,
                error: `Tie-Break inválido. Debe llegar a mínimo ${minToWin} puntos`
            };
        }
        
        return { valid: true, error: null };
    },

    /**
     * Determina si un partido tiene ganador
     * @param {array} sets - Array de sets [[s1g1, s1g2], [s2g1, s2g2], ...]
     * @param {object} config - Configuración del formato
     * @returns {object} - { hasWinner: boolean, winner: number|null, setsWon: [number, number] }
     */
    determineMatchWinner(sets, config) {
        const setsToWin = config.setsToWin || 2;
        const setsWon = [0, 0];
        
        for (const set of sets) {
            if (set.length >= 2) {
                if (set[0] > set[1]) setsWon[0]++;
                else if (set[1] > set[0]) setsWon[1]++;
            }
        }
        
        let winner = null;
        if (setsWon[0] >= setsToWin) winner = 1;
        else if (setsWon[1] >= setsToWin) winner = 2;
        
        return {
            hasWinner: winner !== null,
            winner,
            setsWon
        };
    },

    /**
     * Verifica si se permite empate según formato
     * @param {string} format - Formato del torneo
     * @returns {boolean} - true si se permiten empates
     */
    allowsDraw(format) {
        const drawAllowed = ['league', 'groups', 'swiss'];
        return drawAllowed.includes(format);
    },

    /**
     * Obtiene número de sets según configuración
     * @param {string} setType - Tipo de set
     * @returns {number} - Número de sets máximos
     */
    getSetsCount(setType) {
        const config = this.getConfig(setType);
        if (setType === 'pro') return 1;
        if (setType === 'champions') return 3; // 2 sets + super tiebreak
        return config.setsToWin * 2 - 1; // Mejor de N
    }
};

// Exportar para uso global
window.ScoringEngine = ScoringEngine;
