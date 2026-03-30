/**
 * ============================================
 * FORMATO MEXICANO - EMPAREJAMIENTO POR NIVEL
 * ============================================
 * Emparejamiento basado en puntos/ranking acumulado
 * 1°+4° vs 2°+3° (o variante similar)
 * Versión: 2.0
 */

const MexicanoFormat = {
    /**
     * Configuración por defecto
     */
    config: {
        minPlayers: 4,
        pairingStrategy: '1v4_2v3', // 1+4 vs 2+3
        pointsWin: 3,
        pointsLoss: 1,
        pointsDraw: 2
    },

    /**
     * Genera partidos para formato Mexicano
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
        
        // Calcular número de rondas
        const numRounds = Math.ceil(numTeams * 10 / 20);
        let matchId = 0;
        
        // Copia de equipos con puntos acumulados
        let teamStats = teams.map(t => ({
            ...t,
            accumulatedPoints: 0,
            matchesPlayed: 0
        }));
        
        for (let round = 0; round < numRounds; round++) {
            // Ordenar por puntos acumulados (ranking actual)
            teamStats.sort((a, b) => b.accumulatedPoints - a.accumulatedPoints);
            
            // Emparejar por nivel
            const roundMatches = this.pairByLevel(teamStats, matchId, round, tournamentConfig);
            matches.push(...roundMatches);
            matchId += roundMatches.length;
            
            // Actualizar puntos basados en resultados simulados (para siguiente ronda)
            // En implementación real, esto se actualiza cuando se guardan resultados
        }
        
        return matches;
    },

    /**
     * Empareja equipos por nivel de puntos
     * @param {array} teams - Equipos con puntos acumulados
     * @param {number} startId - ID inicial de partido
     * @param {number} round - Número de ronda
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    pairByLevel(teams, startId, round, config) {
        const matches = [];
        const numCourts = config.numCourts || 2;
        const numTeams = teams.length;
        
        // Estrategia 1+4 vs 2+3 para 4 equipos
        // Para más equipos, emparejar 1° vs último, 2° vs penúltimo, etc.
        const paired = [];
        const used = new Set();
        
        for (let i = 0; i < Math.floor(numTeams / 2); i++) {
            const top = i;
            const bottom = numTeams - 1 - i;
            
            if (!used.has(top) && !used.has(bottom) && top !== bottom) {
                paired.push([teams[top], teams[bottom]]);
                used.add(top);
                used.add(bottom);
            }
        }
        
        // Crear partidos
        paired.forEach((pair, idx) => {
            const team1 = pair[0];
            const team2 = pair[1];
            
            matches.push({
                id: `mx_r${round}_m${startId + matches.length}`,
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
                formatType: 'mexicano',
                ranking: {
                    t1Position: teams.indexOf(team1) + 1,
                    t2Position: teams.indexOf(team2) + 1
                }
            });
        });
        
        return matches;
    },

    /**
     * Actualiza puntos acumulados después de un partido
     * @param {string} matchId - ID del partido
     * @param {string} winnerId - ID del ganador
     * @param {array} teams - Todos los equipos
     * @param {object} config - Configuración de puntos
     */
    updateAccumulatedPoints(matchId, winnerId, teams, config) {
        const match = teams.find(t => t.id === matchId); // Esto es simplificado
        // En implementación real, buscar el partido y actualizar stats
    },

    /**
     * Calcula standings para formato Mexicano
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
                    gamesLost: 0
                };
            }
        });
        
        // Procesar partidos
        matches.filter(m => m.done && m.formatType === 'mexicano' && !m.isBye).forEach(match => {
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
                // Empate
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
        
        // Ordenar por puntos
        return Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            const gdA = a.gamesWon - a.gamesLost;
            const gdB = b.gamesWon - b.gamesLost;
            if (gdB !== gdA) return gdB - gdA;
            return b.matchesWon - a.matchesWon;
        });
    },

    /**
     * Genera HTML para tabla de posiciones de Mexicano
     * @param {array} standings - Standings ordenados
     * @param {boolean} showDetails - Mostrar columnas detalladas
     * @returns {string} - HTML de la tabla
     */
    generateStandingsHTML(standings, showDetails = true) {
        let html = `<thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PP</th>`;
        
        if (showDetails) {
            html += `<th>PE</th><th>S+</th><th>S-</th><th>G+</th><th>G-</th><th>DG</th>`;
        }
        
        html += `<th>Pts</th></tr></thead><tbody>`;
        
        standings.forEach((team, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<b style="color:#64748b">${index + 1}</b>`;
            const gd = team.gamesWon - team.gamesLost;
            
            html += `<tr>
                <td>${medal}</td>
                <td><div style="display:flex;align-items:center;gap:6px">
                    <span style="font-weight:700;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${Sanitizer.text(team.name)}</span>
                </div></td>
                <td>${team.matchesPlayed}</td>
                <td style="color:#15803d;font-weight:700">${team.matchesWon}</td>
                <td style="color:#dc2626">${team.matchesLost}</td>`;
            
            if (showDetails) {
                html += `<td>${team.matchesDraw || 0}</td>
                    <td>${team.setsWon}</td>
                    <td>${team.setsLost}</td>
                    <td>${team.gamesWon}</td>
                    <td>${team.gamesLost}</td>
                    <td style="${gd >= 0 ? 'color:#15803d' : 'color:#dc2626'};font-weight:700">${gd >= 0 ? '+' : ''}${gd}</td>`;
            }
            
            html += `<td style="font-weight:900;font-size:15px">${team.points}</td></tr>`;
        });
        
        html += '</tbody>';
        return html;
    }
};

// Exportar para uso global
window.MexicanoFormat = MexicanoFormat;
