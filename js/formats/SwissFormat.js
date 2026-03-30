/**
 * ============================================
 * SWISSFORMAT.JS - Formato Suizo
 * ============================================
 * Dutch Pairing System (sin eliminación)
 * Emparejamiento por récord (puntos ganados)
 * Verificar historial: NO repetir oponentes
 * Rondas fijas: log₂(n)+1
 */

const SwissFormat = {
    /**
     * Genera partidos para formato Suizo
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generate(teams, config) {
        const matches = [];
        const activeTeams = teams.filter(t => !t.isBye);
        
        if (activeTeams.length < 4) {
            console.warn('Suizo: Mínimo 4 equipos requeridos');
            return matches;
        }

        // Número de rondas: log₂(n) + 1
        const numRounds = Math.ceil(Math.log2(activeTeams.length)) + 1;
        
        // Inicializar estado de cada equipo
        const teamState = {};
        activeTeams.forEach(t => {
            teamState[t.id] = {
                id: t.id,
                name: t.name,
                points: 0,
                matchesPlayed: 0,
                opponents: [], // Historial de oponentes
                category: t.category || 7
            };
        });

        for (let round = 0; round < numRounds; round++) {
            const roundMatches = this._generateRound(
                activeTeams, 
                teamState, 
                round, 
                matches.length, 
                config
            );
            matches.push(...roundMatches);
        }

        return matches;
    },

    /**
     * Genera una ronda con emparejamiento suizo
     * @param {array} teams - Equipos activos
     * @param {object} teamState - Estado de cada equipo
     * @param {number} round - Número de ronda
     * @param {number} matchNum - Número de partido global
     * @param {object} config - Configuración
     * @returns {array} - Partidos de la ronda
     */
    _generateRound(teams, teamState, round, matchNum, config) {
        const matches = [];
        const available = [...teams];
        
        // Ordenar por puntos (score groups)
        available.sort((a, b) => {
            const ptsA = teamState[a.id]?.points || 0;
            const ptsB = teamState[b.id]?.points || 0;
            if (ptsB !== ptsA) return ptsB - ptsA;
            return (b.category || 7) - (a.category || 7);
        });

        // Emparejar dentro de cada grupo de puntos
        while (available.length >= 2) {
            const team1 = available.shift();
            let team2 = null;

            // Buscar oponente que no haya jugado antes
            for (let i = 0; i < available.length; i++) {
                const candidate = available[i];
                const history = teamState[team1.id]?.opponents || [];
                
                if (!history.includes(candidate.id)) {
                    team2 = available.splice(i, 1)[0];
                    break;
                }
            }

            // Si no se encontró oponente sin repetir, tomar el siguiente disponible
            if (!team2 && available.length > 0) {
                team2 = available.shift();
            }

            if (team2) {
                const match = {
                    id: `sw_r${round}m${matches.length}`,
                    round: round,
                    matchNum: matchNum + matches.length,
                    format: 'swiss',
                    t1: [team1.id],
                    t2: [team2.id],
                    t1name: team1.name,
                    t2name: team2.name,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((matches.length % (config.numCourts || 2)) + 1),
                    isBye: false,
                    autoAdv: false
                };

                matches.push(match);

                // Actualizar historial de oponentes
                if (teamState[team1.id]) {
                    teamState[team1.id].opponents.push(team2.id);
                }
                if (teamState[team2.id]) {
                    teamState[team2.id].opponents.push(team1.id);
                }
            }
        }

        return matches;
    },

    /**
     * Calcula standings para formato Suizo
     * @param {array} matches - Todos los partidos
     * @param {array} teams - Todos los equipos
     * @param {object} config - Configuración
     * @returns {array} - Standings ordenados
     */
    calculateStandings(matches, teams, config) {
        const stats = {};
        
        // Inicializar stats
        teams.filter(t => !t.isBye).forEach(t => {
            stats[t.id] = {
                id: t.id,
                name: t.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                matchesDrawn: 0,
                setsWon: 0,
                setsLost: 0,
                gamesWon: 0,
                gamesLost: 0,
                gameDifference: 0
            };
        });

        // Procesar partidos completados
        matches.filter(m => m.done && m.format === 'swiss').forEach(match => {
            const winner = match.winner;
            const t1Id = match.t1[0];
            const t2Id = match.t2[0];

            if (winner) {
                const loser = winner === t1Id ? t2Id : t1Id;
                
                if (stats[winner]) {
                    stats[winner].points += config.ptsWin || 3;
                    stats[winner].matchesPlayed++;
                    stats[winner].matchesWon++;
                }
                if (stats[loser]) {
                    stats[loser].points += config.ptsLoss || 1;
                    stats[loser].matchesPlayed++;
                    stats[loser].matchesLost++;
                }
            } else if (ScoringEngine.allowsDraws('swiss')) {
                // Empate permitido en Suizo
                if (stats[t1Id]) {
                    stats[t1Id].points += config.ptsDraw || 2;
                    stats[t1Id].matchesPlayed++;
                    stats[t1Id].matchesDrawn++;
                }
                if (stats[t2Id]) {
                    stats[t2Id].points += config.ptsDraw || 2;
                    stats[t2Id].matchesPlayed++;
                    stats[t2Id].matchesDrawn++;
                }
            }

            // Actualizar sets y games
            match.sets.forEach(set => {
                const s1 = set[0] || 0;
                const s2 = set[1] || 0;
                
                if (stats[t1Id]) {
                    stats[t1Id].setsWon += s1 > s2 ? 1 : 0;
                    stats[t1Id].setsLost += s1 < s2 ? 1 : 0;
                    stats[t1Id].gamesWon += s1;
                    stats[t1Id].gamesLost += s2;
                }
                if (stats[t2Id]) {
                    stats[t2Id].setsWon += s2 > s1 ? 1 : 0;
                    stats[t2Id].setsLost += s2 < s1 ? 1 : 0;
                    stats[t2Id].gamesWon += s2;
                    stats[t2Id].gamesLost += s1;
                }
            });
        });

        // Calcular diferencia de games
        Object.values(stats).forEach(s => {
            s.gameDifference = s.gamesWon - s.gamesLost;
        });

        // Ordenar: puntos > partidos ganados > diferencia de games > games ganados
        return Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            if (b.gameDifference !== a.gameDifference) return b.gameDifference - a.gameDifference;
            return b.gamesWon - a.gamesWon;
        });
    }
};

// Exportar para uso global
window.SwissFormat = SwissFormat;
