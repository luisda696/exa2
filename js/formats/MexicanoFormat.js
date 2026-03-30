/**
 * ============================================
 * MEXICANOFORMAT.JS - Formato Mexicano
 * ============================================
 * Emparejamiento por NIVEL/PUNTOS
 * Calcular standings antes de cada ronda
 * Emparejar: 1°+4° vs 2°+3° (por nivel)
 * Sistema de puntos acumulados
 */

const MexicanoFormat = {
    /**
     * Genera partidos para formato Mexicano
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generate(teams, config) {
        const matches = [];
        const activeTeams = teams.filter(t => !t.isBye);
        
        if (activeTeams.length < 4) {
            console.warn('Mexicano: Mínimo 4 equipos requeridos');
            return matches;
        }

        // Número de rondas basado en equipos
        const numRounds = Math.ceil(activeTeams.length * 1.5);
        let matchNum = 0;

        // Inicializar puntos de todos los equipos
        const teamPoints = {};
        activeTeams.forEach(t => {
            teamPoints[t.id] = {
                id: t.id,
                name: t.name,
                points: 0,
                matchesPlayed: 0,
                category: t.category || 7
            };
        });

        for (let round = 0; round < numRounds; round++) {
            // Ordenar equipos por puntos actuales (para emparejamiento por nivel)
            const sortedTeams = activeTeams.sort((a, b) => {
                const ptsA = teamPoints[a.id]?.points || 0;
                const ptsB = teamPoints[b.id]?.points || 0;
                if (ptsB !== ptsA) return ptsB - ptsA;
                return (b.category || 7) - (a.category || 7);
            });

            // Emparejar por nivel: 1°+4° vs 2°+3°, 5°+8° vs 6°+7°, etc.
            const roundMatches = this._generateRound(sortedTeams, round, matchNum, teamPoints, config);
            matches.push(...roundMatches);
            matchNum += roundMatches.length;
        }

        return matches;
    },

    /**
     * Genera una ronda con emparejamiento por nivel
     * @param {array} sortedTeams - Equipos ordenados por puntos
     * @param {number} round - Número de ronda
     * @param {number} matchNum - Número de partido global
     * @param {object} teamPoints - Puntos acumulados por equipo
     * @param {object} config - Configuración
     * @returns {array} - Partidos de la ronda
     */
    _generateRound(sortedTeams, round, matchNum, teamPoints, config) {
        const matches = [];
        const numTeams = sortedTeams.length;
        
        // Emparejamiento mexicano: grupos de 4 equipos
        for (let i = 0; i < numTeams; i += 4) {
            const group = sortedTeams.slice(i, i + 4);
            
            if (group.length >= 4) {
                // 1°+4° vs 2°+3°
                matches.push({
                    id: `mx_r${round}m${matches.length}`,
                    round: round,
                    matchNum: matchNum + matches.length,
                    format: 'mexicano',
                    t1: [group[0].id, group[3].id],
                    t2: [group[1].id, group[2].id],
                    t1name: `${group[0].name} / ${group[3].name}`,
                    t2name: `${group[1].name} / ${group[2].name}`,
                    t1seed: [1, 4],
                    t2seed: [2, 3],
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((matches.length % (config.numCourts || 2)) + 1),
                    isBye: false,
                    autoAdv: false
                });
            } else if (group.length === 2) {
                // Solo 2 equipos restantes - juegan entre sí
                matches.push({
                    id: `mx_r${round}m${matches.length}`,
                    round: round,
                    matchNum: matchNum + matches.length,
                    format: 'mexicano',
                    t1: [group[0].id],
                    t2: [group[1].id],
                    t1name: group[0].name,
                    t2name: group[1].name,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((matches.length % (config.numCourts || 2)) + 1),
                    isBye: false,
                    autoAdv: false
                });
            }
        }

        return matches;
    },

    /**
     * Calcula standings para formato Mexicano
     * @param {array} matches - Todos los partidos
     * @param {array} teams - Todos los equipos
     * @param {object} config - Configuración
     * @returns {array} - Standings ordenados
     */
    calculateStandings(matches, teams, config) {
        const stats = {};
        
        // Inicializar stats para todos los equipos
        teams.filter(t => !t.isBye).forEach(t => {
            stats[t.id] = {
                id: t.id,
                name: t.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                setsWon: 0,
                setsLost: 0,
                gamesWon: 0,
                gamesLost: 0,
                category: t.category || 7
            };
        });

        // Procesar partidos completados
        matches.filter(m => m.done && m.format === 'mexicano').forEach(match => {
            const winner = match.winner;
            const loser = winner === match.t1[0] ? match.t2[0] : match.t1[0];

            // Actualizar ganador (puede ser pareja o individual)
            if (stats[winner]) {
                stats[winner].points += config.ptsWin || 3;
                stats[winner].matchesPlayed++;
                stats[winner].matchesWon++;
            }

            // Actualizar perdedor
            if (stats[loser]) {
                stats[loser].points += config.ptsLoss || 1;
                stats[loser].matchesPlayed++;
                stats[loser].matchesLost++;
            }

            // Actualizar sets y games
            match.sets.forEach(set => {
                const s1 = set[0] || 0;
                const s2 = set[1] || 0;
                
                if (stats[match.t1[0]]) {
                    stats[match.t1[0]].setsWon += s1 > s2 ? 1 : 0;
                    stats[match.t1[0]].setsLost += s1 < s2 ? 1 : 0;
                    stats[match.t1[0]].gamesWon += s1;
                    stats[match.t1[0]].gamesLost += s2;
                }
                if (stats[match.t2[0]]) {
                    stats[match.t2[0]].setsWon += s2 > s1 ? 1 : 0;
                    stats[match.t2[0]].setsLost += s2 < s1 ? 1 : 0;
                    stats[match.t2[0]].gamesWon += s2;
                    stats[match.t2[0]].gamesLost += s1;
                }
            });
        });

        // Ordenar por puntos, luego por partidos ganados, luego por diferencia de games
        return Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            const gdA = a.gamesWon - a.gamesLost;
            const gdB = b.gamesWon - b.gamesLost;
            if (gdB !== gdA) return gdB - gdA;
            return (b.category || 7) - (a.category || 7);
        });
    }
};

// Exportar para uso global
window.MexicanoFormat = MexicanoFormat;
