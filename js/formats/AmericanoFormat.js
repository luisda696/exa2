/**
 * ============================================
 * FORMATO AMERICANO - ROTACIÓN DE PAREJAS
 * ============================================
 * Sistema de puntos por bola con rotación de parejas
 * Cada jugador acumula puntos individuales
 * Versión: 2.0
 */

const AmericanoFormat = {
    /**
     * Configuración por defecto
     */
    config: {
        pointsPerMatch: 24, // 16, 24, o 32 puntos por partido
        minPlayers: 4,
        rotationStrategy: 'balanced' // balanced, random, sequential
    },

    /**
     * Genera partidos para formato Americano
     * @param {array} teams - Array de equipos/jugadores
     * @param {object} tournamentConfig - Configuración del torneo
     * @returns {array} - Array de partidos generados
     */
    generateMatches(teams, tournamentConfig) {
        const matches = [];
        const numPlayers = teams.length;
        
        if (numPlayers < this.config.minPlayers) {
            return matches;
        }
        
        // Calcular número de rondas (cada jugador juega con diferentes compañeros)
        const rounds = numPlayers - 1;
        let matchId = 0;
        
        for (let round = 0; round < rounds; round++) {
            // Rotar jugadores para crear nuevas parejas
            const rotated = this.rotatePlayers(teams, round);
            
            // Crear parejas
            const pairs = this.createPairs(rotated);
            
            // Emparejar parejas para partidos
            const roundMatches = this.pairUpTeams(pairs, matchId, round, tournamentConfig);
            matches.push(...roundMatches);
            matchId += roundMatches.length;
        }
        
        return matches;
    },

    /**
     * Rota jugadores para crear nuevas combinaciones
     * @param {array} players - Lista de jugadores
     * @param {number} round - Número de ronda
     * @returns {array} - Jugadores rotados
     */
    rotatePlayers(players, round) {
        const rotated = [players[0]]; // El primer jugador permanece fijo
        const others = players.slice(1);
        
        // Rotar el resto
        for (let i = 0; i < others.length; i++) {
            const newIndex = (i + round) % others.length;
            rotated.push(others[newIndex]);
        }
        
        return rotated;
    },

    /**
     * Crea parejas de jugadores
     * @param {array} players - Jugadores rotados
     * @returns {array} - Array de parejas
     */
    createPairs(players) {
        const pairs = [];
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                pairs.push([players[i], players[i + 1]]);
            }
        }
        return pairs;
    },

    /**
     * Empareja parejas para crear partidos
     * @param {array} pairs - Parejas de jugadores
     * @param {number} startId - ID inicial de partido
     * @param {number} round - Número de ronda
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    pairUpTeams(pairs, startId, round, config) {
        const matches = [];
        const numCourts = config.numCourts || 2;
        
        for (let i = 0; i < pairs.length; i += 2) {
            if (i + 1 < pairs.length) {
                const pair1 = pairs[i];
                const pair2 = pairs[i + 1];
                
                matches.push({
                    id: `am_r${round}_m${startId + matches.length}`,
                    round: round,
                    matchNum: startId + matches.length,
                    t1: [pair1[0].id, pair1[1].id],
                    t2: [pair2[0].id, pair2[1].id],
                    t1name: `${pair1[0].name} / ${pair1[1].name}`,
                    t2name: `${pair2[0].name} / ${pair2[1].name}`,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((matches.length % numCourts) + 1),
                    isBye: false,
                    autoAdv: false,
                    formatType: 'americano',
                    individualPoints: {} // Para tracking de puntos individuales
                });
            } else if (pairs.length % 2 === 1) {
                // Un jugador descansa en esta ronda
                const pair1 = pairs[i];
                matches.push({
                    id: `am_r${round}_m${startId + matches.length}`,
                    round: round,
                    matchNum: startId + matches.length,
                    t1: [pair1[0].id, pair1[1].id],
                    t2: ['BYE'],
                    t1name: `${pair1[0].name} / ${pair1[1].name}`,
                    t2name: 'Descanso',
                    sets: [],
                    done: true,
                    winner: [pair1[0].id, pair1[1].id],
                    court: ((matches.length % numCourts) + 1),
                    isBye: true,
                    autoAdv: true,
                    formatType: 'americano'
                });
            }
        }
        
        return matches;
    },

    /**
     * Calcula ranking individual para Americano
     * @param {array} matches - Partidos jugados
     * @param {array} players - Todos los jugadores
     * @param {object} config - Configuración de puntos
     * @returns {array} - Ranking individual ordenado
     */
    calculateIndividualRanking(matches, players, config) {
        const playerStats = {};
        
        // Inicializar stats para cada jugador
        players.forEach(p => {
            playerStats[p.id] = {
                id: p.id,
                name: p.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                setsWon: 0,
                gamesWon: 0
            };
        });
        
        // Procesar cada partido
        matches.filter(m => m.done && m.formatType === 'americano').forEach(match => {
            const pointsPerMatch = config.pointsPerMatch || 24;
            const winner = match.winner;
            
            // Distribuir puntos
            if (winner && Array.isArray(winner)) {
                // Ganadores obtienen más puntos
                winner.forEach(playerId => {
                    if (playerStats[playerId]) {
                        playerStats[playerId].points += Math.floor(pointsPerMatch * 0.6);
                        playerStats[playerId].matchesWon++;
                    }
                });
                
                // Perdedores obtienen puntos de participación
                const allPlayers = [...match.t1, ...match.t2].filter(id => !winner.includes(id));
                allPlayers.forEach(playerId => {
                    if (playerStats[playerId]) {
                        playerStats[playerId].points += Math.floor(pointsPerMatch * 0.4);
                    }
                });
            }
            
            // Actualizar partidos jugados
            [...match.t1, ...match.t2].forEach(playerId => {
                if (playerStats[playerId] && playerId !== 'BYE') {
                    playerStats[playerId].matchesPlayed++;
                }
            });
            
            // Actualizar sets y games
            match.sets.forEach(set => {
                if (set.length >= 2) {
                    [...match.t1].forEach(playerId => {
                        if (playerStats[playerId]) {
                            playerStats[playerId].setsWon += set[0] > set[1] ? 1 : 0;
                            playerStats[playerId].gamesWon += set[0];
                        }
                    });
                    [...match.t2].forEach(playerId => {
                        if (playerStats[playerId]) {
                            playerStats[playerId].setsWon += set[1] > set[0] ? 1 : 0;
                            playerStats[playerId].gamesWon += set[1];
                        }
                    });
                }
            });
        });
        
        // Ordenar por puntos
        return Object.values(playerStats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            return b.gamesWon - a.gamesWon;
        });
    },

    /**
     * Genera HTML para tabla de posiciones de Americano
     * @param {array} ranking - Ranking individual
     * @returns {string} - HTML de la tabla
     */
    generateStandingsHTML(ranking) {
        let html = `<thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>PG</th><th>Sets+</th><th>Games+</th><th>Pts</th></tr></thead><tbody>`;
        
        ranking.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<b style="color:#64748b">${index + 1}</b>`;
            html += `<tr>
                <td>${medal}</td>
                <td style="font-weight:700;color:#1e293b">${Sanitizer.text(player.name)}</td>
                <td>${player.matchesPlayed}</td>
                <td style="color:#15803d;font-weight:700">${player.matchesWon}</td>
                <td>${player.setsWon}</td>
                <td>${player.gamesWon}</td>
                <td style="font-weight:900;font-size:15px">${player.points}</td>
            </tr>`;
        });
        
        html += '</tbody>';
        return html;
    }
};

// Exportar para uso global
window.AmericanoFormat = AmericanoFormat;
