/**
 * ============================================
 * AMERICANOFORMAT.JS - Formato Americano
 * ============================================
 * Sistema de PUNTOS POR BOLA (16, 24 o 32 puntos)
 * Rotación de parejas cada ronda
 * Ranking INDIVIDUAL (no por equipos fijos)
 */

const AmericanoFormat = {
    /**
     * Genera partidos para formato Americano
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generate(teams, config) {
        const matches = [];
        const players = this._extractPlayers(teams);
        const numPlayers = players.length;
        
        if (numPlayers < 4) {
            console.warn('Americano: Mínimo 4 jugadores requeridos');
            return matches;
        }

        // Número de rondas = numPlayers - 1 (cada jugador juega con todos)
        const numRounds = numPlayers - 1;
        const pointsPerMatch = config.americanoPoints || 24;

        for (let round = 0; round < numRounds; round++) {
            const roundMatches = this._generateRound(players, round, numPlayers, pointsPerMatch, round);
            matches.push(...roundMatches);
        }

        return matches;
    },

    /**
     * Extrae jugadores individuales de los equipos
     * @param {array} teams - Equipos
     * @returns {array} - Jugadores individuales
     */
    _extractPlayers(teams) {
        const players = [];
        let playerId = 0;

        teams.forEach((team, teamIdx) => {
            if (team.isBye) return;
            
            team.players.forEach((player, playerIdx) => {
                players.push({
                    id: `am_p${playerId++}`,
                    name: player.name,
                    originalTeamId: team.id,
                    originalTeamName: team.name,
                    gender: player.gender,
                    category: team.category,
                    ranking: player.ranking || 0,
                    totalPoints: 0,
                    matchesPlayed: 0,
                    matchesWon: 0
                });
            });
        });

        return players;
    },

    /**
     * Genera una ronda con rotación de parejas
     * @param {array} players - Jugadores
     * @param {number} round - Número de ronda
     * @param {number} numPlayers - Total de jugadores
     * @param {number} pointsPerMatch - Puntos por partido
     * @param {number} matchNum - Número de partido global
     * @returns {array} - Partidos de la ronda
     */
    _generateRound(players, round, numPlayers, pointsPerMatch, matchNum) {
        const matches = [];
        
        // Algoritmo de rotación circular
        const rotated = this._rotatePlayers(players, round);
        const pairs = this._createPairs(rotated, round);

        // Emparejar parejas contra parejas
        for (let i = 0; i < Math.floor(pairs.length / 2); i++) {
            const pair1 = pairs[i * 2];
            const pair2 = pairs[i * 2 + 1];

            if (pair1 && pair2) {
                matches.push({
                    id: `am_r${round}m${i}`,
                    round: round,
                    matchNum: matchNum++,
                    format: 'americano',
                    t1: pair1.map(p => p.id),
                    t2: pair2.map(p => p.id),
                    t1name: pair1.map(p => p.name).join(' / '),
                    t2name: pair2.map(p => p.name).join(' / '),
                    t1players: pair1,
                    t2players: pair2,
                    pointsPerMatch: pointsPerMatch,
                    t1points: 0,
                    t2points: 0,
                    sets: [],
                    done: false,
                    winner: null,
                    court: ((i % (config.numCourts || 2)) + 1),
                    isBye: false,
                    autoAdv: false
                });
            }
        }

        return matches;
    },

    /**
     * Rota jugadores para nueva ronda
     * @param {array} players - Jugadores
     * @param {number} round - Ronda actual
     * @returns {array} - Jugadores rotados
     */
    _rotatePlayers(players, round) {
        const rotated = [players[0]]; // El primer jugador permanece fijo
        const others = players.slice(1);
        
        // Rotar el resto
        const rotateCount = round % others.length;
        for (let i = 0; i < others.length; i++) {
            const idx = (i + rotateCount) % others.length;
            rotated.push(others[idx]);
        }

        return rotated;
    },

    /**
     * Crea parejas de jugadores
     * @param {array} players - Jugadores rotados
     * @param {number} round - Ronda actual
     * @returns {array} - Array de parejas
     */
    _createPairs(players, round) {
        const pairs = [];
        
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                // Verificar que no sean del mismo equipo original
                if (players[i].originalTeamId !== players[i + 1].originalTeamId) {
                    pairs.push([players[i], players[i + 1]]);
                } else if (i + 2 < players.length) {
                    // Intercambiar para evitar mismo equipo
                    pairs.push([players[i], players[i + 2]]);
                    if (i + 3 < players.length) {
                        pairs.push([players[i + 1], players[i + 3]]);
                    }
                    i += 2;
                } else {
                    pairs.push([players[i]]); // Solo si no hay alternativa
                }
            } else {
                pairs.push([players[i]]);
            }
        }

        return pairs;
    },

    /**
     * Calcula ranking individual después de partidos
     * @param {array} matches - Partidos completados
     * @param {array} allPlayers - Todos los jugadores
     * @returns {array} - Ranking ordenado
     */
    calculateRanking(matches, allPlayers) {
        const playerStats = {};

        // Inicializar stats
        allPlayers.forEach(p => {
            playerStats[p.id] = {
                id: p.id,
                name: p.name,
                originalTeamName: p.originalTeamName,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                totalPointsScored: 0
            };
        });

        // Procesar partidos completados
        matches.filter(m => m.done && m.format === 'americano').forEach(match => {
            const t1Won = match.t1points > match.t2points;
            
            // Equipo 1
            match.t1players.forEach(p => {
                if (playerStats[p.id]) {
                    playerStats[p.id].matchesPlayed++;
                    playerStats[p.id].totalPointsScored += match.t1points;
                    if (t1Won) {
                        playerStats[p.id].matchesWon++;
                        playerStats[p.id].points += 3;
                    } else {
                        playerStats[p.id].matchesLost++;
                        playerStats[p.id].points += 1;
                    }
                }
            });

            // Equipo 2
            match.t2players.forEach(p => {
                if (playerStats[p.id]) {
                    playerStats[p.id].matchesPlayed++;
                    playerStats[p.id].totalPointsScored += match.t2points;
                    if (!t1Won) {
                        playerStats[p.id].matchesWon++;
                        playerStats[p.id].points += 3;
                    } else {
                        playerStats[p.id].matchesLost++;
                        playerStats[p.id].points += 1;
                    }
                }
            });
        });

        // Ordenar por puntos, luego por partidos ganados
        return Object.values(playerStats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            return b.totalPointsScored - a.totalPointsScored;
        });
    }
};

// Exportar para uso global
window.AmericanoFormat = AmericanoFormat;
