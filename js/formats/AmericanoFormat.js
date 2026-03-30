/**
 * AmericanoFormat.js - Formato Americano (Rotación)
 * Sistema de puntos por bola, rotación de parejas, ranking individual
 */

const AmericanoFormat = {
    /**
     * Genera partidos para formato Americano
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generateMatches(teams, config) {
        const matches = [];
        const numPlayers = teams.length * (config.playersPerTeam || 2);
        const rounds = numPlayers - 1; // Cada jugador juega contra todos
        
        // Crear lista individual de jugadores
        const players = [];
        teams.forEach((team, teamIdx) => {
            team.players.forEach((player, playerIdx) => {
                players.push({
                    id: `p_${teamIdx}_${playerIdx}`,
                    name: player.name,
                    teamId: team.id,
                    teamName: team.name,
                    points: 0,
                    gamesWon: 0,
                    gamesLost: 0
                });
            });
        });

        // Generar rondas con rotación
        for (let round = 0; round < Math.min(rounds, 5); round++) {
            const shuffled = [...players].sort(() => Math.random() - 0.5);
            const roundMatches = [];

            // Emparejar jugadores en parejas diferentes cada ronda
            for (let i = 0; i < Math.floor(shuffled.length / 2); i += 2) {
                if (i + 3 < shuffled.length) {
                    const teamA = [shuffled[i], shuffled[i + 1]];
                    const teamB = [shuffled[i + 2], shuffled[i + 3]];

                    // Verificar que no sean del mismo equipo original
                    if (teamA[0].teamId !== teamA[1].teamId && 
                        teamB[0].teamId !== teamB[1].teamId) {
                        roundMatches.push({
                            id: `am_r${round}_m${roundMatches.length}`,
                            round: round,
                            matchNum: matches.length + roundMatches.length,
                            t1: teamA.map(p => p.id),
                            t2: teamB.map(p => p.id),
                            t1name: `${teamA[0].name} / ${teamA[1].name}`,
                            t2name: `${teamB[0].name} / ${teamB[1].name}`,
                            sets: [],
                            done: false,
                            winner: null,
                            court: ((roundMatches.length % config.numCourts) + 1),
                            isBye: false,
                            isAmericano: true,
                            pointsSystem: {
                                win: 16,
                                loss: 8,
                                perGame: 1
                            }
                        });
                    }
                }
            }

            matches.push(...roundMatches);
        }

        return matches;
    },

    /**
     * Calcula ranking individual para Americano
     * @param {array} matches - Partidos jugados
     * @param {array} players - Lista de jugadores
     * @returns {array} - Ranking ordenado
     */
    calculateRanking(matches, players) {
        const stats = {};

        // Inicializar stats por jugador
        players.forEach(p => {
            stats[p.id] = {
                id: p.id,
                name: p.name,
                teamName: p.teamName,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                gamesWon: 0,
                gamesLost: 0
            };
        });

        // Procesar partidos completados
        matches.filter(m => m.done && m.isAmericano).forEach(match => {
            const allPlayers = [...match.t1, ...match.t2];
            const winner = match.winner;

            allPlayers.forEach(playerId => {
                if (stats[playerId]) {
                    stats[playerId].matchesPlayed++;
                    
                    // Puntos por participación
                    stats[playerId].points += 8;

                    // Puntos por victoria
                    if (winner && match.t1.includes(playerId) && winner === match.t1[0] ||
                        winner && match.t2.includes(playerId) && winner === match.t2[0]) {
                        stats[playerId].matchesWon++;
                        stats[playerId].points += 8; // 16 total por victoria
                    }

                    // Puntos por games
                    match.sets.forEach(set => {
                        if (set.length >= 2) {
                            stats[playerId].gamesWon += set[0] || 0;
                            stats[playerId].gamesLost += set[1] || 0;
                            stats[playerId].points += (set[0] || 0);
                        }
                    });
                }
            });
        });

        // Ordenar por puntos
        return Object.values(stats).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
        });
    },

    /**
     * Genera tabla de posiciones para Americano
     * @param {array} ranking - Ranking calculado
     * @returns {string} - HTML de la tabla
     */
    renderStandings(ranking) {
        const header = `
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>Games +</th>
                    <th>Games -</th>
                    <th>Puntos</th>
                </tr>
            </thead>
        `;

        const rows = ranking.map((p, i) => `
            <tr>
                <td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td style="font-weight:700">${Sanitizer.text(p.name)}</td>
                <td>${Sanitizer.text(p.teamName)}</td>
                <td>${p.matchesPlayed}</td>
                <td style="color:#15803d;font-weight:700">${p.matchesWon}</td>
                <td>${p.gamesWon}</td>
                <td>${p.gamesLost}</td>
                <td style="font-weight:900;font-size:15px">${p.points}</td>
            </tr>
        `).join('');

        return `<table class="ltable">${header}<tbody>${rows}</tbody></table>`;
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmericanoFormat;
}
