/**
 * ============================================
 * FORMATO SUIZO - DUTCH PAIRING SYSTEM
 * ============================================
 * Sin eliminación, emparejamiento por récord
 * No repetir oponentes
 * Versión: 2.0
 */

const SwissFormat = {
    /**
     * Configuración por defecto
     */
    config: {
        minPlayers: 4,
        roundsFormula: 'log2(n)+1'
    },

    /**
     * Genera partidos para formato Suizo
     * @param {array} teams - Array de equipos
     * @param {object} tournamentConfig - Configuración del torneo
     * @returns {array} - Array de partidos generados
     */
    generateMatches(teams, tournamentConfig) {
        const matches = [];
        const numTeams = teams.length;
        
        if (numTeams < this.config.minPlayers) {
            return matches;
        }
        
        // Calcular número de rondas: log₂(n) + 1
        const numRounds = Math.ceil(Math.log2(numTeams)) + 1;
        let matchId = 0;
        
        // Estado de cada equipo (puntos, oponentes previos)
        let teamState = teams.map(t => ({
            ...t,
            points: 0,
            opponents: [], // IDs de oponentes previos
            matchesPlayed: 0
        }));
        
        for (let round = 0; round < numRounds; round++) {
            // Ordenar por puntos (ranking actual)
            teamState.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return b.matchesPlayed - a.matchesPlayed;
            });
            
            // Emparejar usando Dutch Pairing
            const roundMatches = this.dutchPairing(teamState, matchId, round, tournamentConfig);
            matches.push(...roundMatches);
            matchId += roundMatches.length;
            
            // Actualizar estado (oponentes)
            roundMatches.forEach(match => {
                if (!match.isBye && match.t1[0] && match.t2[0]) {
                    const t1 = teamState.find(t => t.id === match.t1[0]);
                    const t2 = teamState.find(t => t.id === match.t2[0]);
                    if (t1) t1.opponents.push(match.t2[0]);
                    if (t2) t2.opponents.push(match.t1[0]);
                }
            });
        }
        
        return matches;
    },

    /**
     * Dutch Pairing System - Emparejamiento por grupos de puntuación
     * @param {array} teams - Equipos con estado actual
     * @param {number} startId - ID inicial de partido
     * @param {number} round - Número de ronda
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    dutchPairing(teams, startId, round, config) {
        const matches = [];
        const numCourts = config.numCourts || 2;
        const used = new Set();
        
        // Agrupar por puntuación
        const scoreGroups = {};
        teams.forEach(t => {
            if (!used.has(t.id)) {
                const score = t.points;
                if (!scoreGroups[score]) scoreGroups[score] = [];
                scoreGroups[score].push(t);
            }
        });
        
        // Ordenar grupos de mayor a menor puntuación
        const sortedScores = Object.keys(scoreGroups).sort((a, b) => b - a);
        
        // Emparejar dentro de cada grupo
        sortedScores.forEach(score => {
            const group = scoreGroups[score];
            
            for (let i = 0; i < group.length; i += 2) {
                if (i + 1 < group.length) {
                    const team1 = group[i];
                    const team2 = group[i + 1];
                    
                    // Verificar que no se hayan enfrentado antes
                    if (!team1.opponents.includes(team2.id)) {
                        matches.push({
                            id: `sw_r${round}_m${startId + matches.length}`,
                            round: round,
                            matchNum: startId + matches.length,
                            t1: [team1.id],
                            t2: [team2.id],
                            t1name: team1.name,
                            t2name: team2.name,
                            sets: [],
                            done: false,
                            winner: null,
                            court: ((matches.length % numCourts) + 1),
                            isBye: false,
                            autoAdv: false,
                            formatType: 'swiss',
                            scoreGroup: parseInt(score)
                        });
                        
                        used.add(team1.id);
                        used.add(team2.id);
                    }
                }
            }
        });
        
        // Si quedan equipos sin emparejar, intentar con grupo adyacente
        const remaining = teams.filter(t => !used.has(t.id));
        for (let i = 0; i < remaining.length; i += 2) {
            if (i + 1 < remaining.length) {
                const team1 = remaining[i];
                const team2 = remaining[i + 1];
                
                if (!team1.opponents.includes(team2.id)) {
                    matches.push({
                        id: `sw_r${round}_m${startId + matches.length}`,
                        round: round,
                        matchNum: startId + matches.length,
                        t1: [team1.id],
                        t2: [team2.id],
                        t1name: team1.name,
                        t2name: team2.name,
                        sets: [],
                        done: false,
                        winner: null,
                        court: ((matches.length % numCourts) + 1),
                        isBye: false,
                        autoAdv: false,
                        formatType: 'swiss',
                        scoreGroup: -1
                    });
                    
                    used.add(team1.id);
                    used.add(team2.id);
                }
            }
        }
        
        return matches;
    },

    /**
     * Actualiza puntos después de un partido
     * @param {string} winnerId - ID del ganador
     * @param {string} loserId - ID del perdedor (puede ser null si empate)
     * @param {array} teams - Estado de equipos
     * @param {object} config - Configuración de puntos
     */
    updatePoints(winnerId, loserId, teams, config) {
        if (winnerId) {
            const winner = teams.find(t => t.id === winnerId);
            if (winner) {
                winner.points += config.ptsWin || 3;
                winner.matchesPlayed++;
            }
        }
        
        if (loserId) {
            const loser = teams.find(t => t.id === loserId);
            if (loser) {
                loser.points += config.ptsLoss || 1;
                loser.matchesPlayed++;
            }
        }
    },

    /**
     * Calcula standings para formato Suizo
     * @param {array} matches - Partidos jugados
     * @param {array} teams - Todos los equipos
     * @param {object} config - Configuración de puntos
     * @returns {array} - Standings ordenados
     */
    calculateStandings(matches, teams, config) {
        const stats = {};
        
        // Inicializar stats
        teams.forEach(t => {
            if (!t.isBye) {
                stats[t.id] = {
                    id: t.id,
                    name: t.name,
                    points: 0,
                    matchesPlayed: 0,
                    matchesWon: 0,
                    matchesLost: 0,
                    matchesDraw: 0,
                    setsWon: 0,
                    setsLost: 0,
                    gamesWon: 0,
                    gamesLost: 0,
                    buchholz: 0 // Puntos de oponentes (tiebreaker suizo)
                };
            }
        });
        
        // Procesar partidos
        matches.filter(m => m.done && m.formatType === 'swiss' && !m.isBye).forEach(match => {
            const winner = match.winner;
            const t1Id = match.t1[0];
            const t2Id = match.t2[0];
            
            if (stats[t1Id]) stats[t1Id].matchesPlayed++;
            if (stats[t2Id]) stats[t2Id].matchesPlayed++;
            
            if (winner) {
                const loser = winner === t1Id ? t2Id : t1Id;
                const winnerId = winner;
                
                if (stats[winnerId]) {
                    stats[winnerId].points += config.ptsWin || 3;
                    stats[winnerId].matchesWon++;
                }
                if (stats[loser]) {
                    stats[loser].points += config.ptsLoss || 1;
                    stats[loser].matchesLost++;
                }
            } else if (config.ptsDraw) {
                if (stats[t1Id]) {
                    stats[t1Id].points += config.ptsDraw;
                    stats[t1Id].matchesDraw++;
                }
                if (stats[t2Id]) {
                    stats[t2Id].points += config.ptsDraw;
                    stats[t2Id].matchesDraw++;
                }
            }
            
            // Procesar sets y games
            match.sets.forEach(set => {
                if (set.length >= 2) {
                    if (stats[t1Id]) {
                        stats[t1Id].setsWon += set[0] > set[1] ? 1 : 0;
                        stats[t1Id].setsLost += set[1] > set[0] ? 1 : 0;
                        stats[t1Id].gamesWon += set[0];
                        stats[t1Id].gamesLost += set[1];
                    }
                    if (stats[t2Id]) {
                        stats[t2Id].setsWon += set[1] > set[0] ? 1 : 0;
                        stats[t2Id].setsLost += set[0] > set[1] ? 1 : 0;
                        stats[t2Id].gamesWon += set[1];
                        stats[t2Id].gamesLost += set[0];
                    }
                }
            });
        });
        
        // Calcular Buchholz (puntos de oponentes)
        matches.filter(m => m.done && m.formatType === 'swiss').forEach(match => {
            const t1Id = match.t1[0];
            const t2Id = match.t2[0];
            
            if (stats[t1Id] && stats[t2Id]) {
                stats[t1Id].buchholz += stats[t2Id].points || 0;
                stats[t2Id].buchholz += stats[t1Id].points || 0;
            }
        });
        
        // Ordenar: puntos > buchholz > diferencia de games
        return Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
            const gdA = a.gamesWon - a.gamesLost;
            const gdB = b.gamesWon - b.gamesLost;
            if (gdB !== gdA) return gdB - gdA;
            return b.matchesWon - a.matchesWon;
        });
    },

    /**
     * Genera HTML para tabla de posiciones de Suizo
     * @param {array} standings - Standings ordenados
     * @returns {string} - HTML de la tabla
     */
    generateStandingsHTML(standings) {
        let html = `<thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PP</th><th>PE</th><th>Pts</th><th>Buchholz</th></tr></thead><tbody>`;
        
        standings.forEach((team, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<b style="color:#64748b">${index + 1}</b>`;
            
            html += `<tr>
                <td>${medal}</td>
                <td><div style="display:flex;align-items:center;gap:6px">
                    <span style="font-weight:700;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(team.name)}</span>
                </div></td>
                <td>${team.matchesPlayed}</td>
                <td style="color:#15803d;font-weight:700">${team.matchesWon}</td>
                <td style="color:#dc2626">${team.matchesLost}</td>
                <td>${team.matchesDraw || 0}</td>
                <td style="font-weight:900;font-size:15px">${team.points}</td>
                <td style="color:#64748b">${team.buchholz}</td>
            </tr>`;
        });
        
        html += '</tbody>';
        return html;
    }
};

// Exportar para uso global
window.SwissFormat = SwissFormat;
