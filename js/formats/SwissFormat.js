/**
 * SwissFormat.js - Formato Suizo (Dutch Pairing)
 * Sin eliminación, emparejamiento por récord
 */

const SwissFormat = {
    /**
     * Genera partidos para formato Suizo
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generateMatches(teams, config) {
        const matches = [];
        const numRounds = Math.ceil(Math.log2(teams.length)) + 1;

        // Inicializar estado de cada equipo
        const teamState = teams.map(t => ({
            id: t.id,
            name: t.name,
            points: 0,
            matchesPlayed: 0,
            opponents: [] // Historial de oponentes
        }));

        for (let round = 0; round < numRounds; round++) {
            // Ordenar por puntos (Dutch pairing)
            teamState.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                return b.matchesPlayed - a.matchesPlayed;
            });

            const paired = new Set();
            const roundMatches = [];

            // Emparejar equipos con mismo/near récord
            for (let i = 0; i < teamState.length - 1; i++) {
                if (paired.has(i)) continue;

                let opponent = -1;

                // Buscar oponente no enfrentado con puntos similares
                for (let j = i + 1; j < teamState.length; j++) {
                    if (!paired.has(j)) {
                        // Verificar que no se hayan enfrentado antes
                        if (!teamState[i].opponents.includes(teamState[j].id)) {
                            opponent = j;
                            break;
                        }
                    }
                }

                // Si no encuentra sin historial, permitir repetición (último recurso)
                if (opponent === -1) {
                    for (let j = i + 1; j < teamState.length; j++) {
                        if (!paired.has(j)) {
                            opponent = j;
                            break;
                        }
                    }
                }

                if (opponent !== -1) {
                    paired.add(i);
                    paired.add(opponent);

                    // Registrar enfrentamiento
                    teamState[i].opponents.push(teamState[opponent].id);
                    teamState[opponent].opponents.push(teamState[i].id);

                    roundMatches.push({
                        id: `sw_r${round}_m${roundMatches.length}`,
                        round: round,
                        matchNum: matches.length + roundMatches.length,
                        t1: [teamState[i].id],
                        t2: [teamState[opponent].id],
                        t1name: teamState[i].name,
                        t2name: teamState[opponent].name,
                        sets: [],
                        done: false,
                        winner: null,
                        court: ((roundMatches.length % config.numCourts) + 1),
                        isBye: false,
                        isSwiss: true
                    });
                }
            }

            matches.push(...roundMatches);
        }

        return matches;
    },

    /**
     * Actualiza standings después de partido Suizo
     * @param {array} matches - Partidos
     * @param {array} teams - Equipos
     * @param {object} config - Configuración
     * @returns {object} - Standings actualizados
     */
    updateStandings(matches, teams, config) {
        const standings = {};

        teams.forEach(t => {
            standings[t.id] = {
                id: t.id,
                name: t.name,
                points: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesDrawn: 0,
                setsWon: 0,
                setsLost: 0,
                gamesWon: 0,
                gamesLost: 0
            };
        });

        matches.filter(m => m.done && m.isSwiss).forEach(match => {
            const t1Id = match.t1[0];
            const t2Id = match.t2[0];

            if (standings[t1Id]) standings[t1Id].matchesPlayed++;
            if (standings[t2Id]) standings[t2Id].matchesPlayed++;

            if (match.winner) {
                if (standings[match.winner]) {
                    standings[match.winner].points += config.ptsWin || 3;
                    standings[match.winner].matchesWon++;
                }
                const loser = match.t1.includes(match.winner) ? t2Id : t1Id;
                if (standings[loser]) {
                    standings[loser].points += config.ptsLoss || 1;
                }
            } else if (ScoringEngine.allowsDraws('swiss')) {
                // Empate permitido en Suizo
                if (standings[t1Id]) {
                    standings[t1Id].points += config.ptsDraw || 2;
                    standings[t1Id].matchesDrawn++;
                }
                if (standings[t2Id]) {
                    standings[t2Id].points += config.ptsDraw || 2;
                    standings[t2Id].matchesDrawn++;
                }
            }

            match.sets.forEach(set => {
                if (set.length >= 2) {
                    if (standings[t1Id]) {
                        standings[t1Id].setsWon += set[0] > set[1] ? 1 : 0;
                        standings[t1Id].setsLost += set[0] < set[1] ? 1 : 0;
                        standings[t1Id].gamesWon += set[0];
                        standings[t1Id].gamesLost += set[1];
                    }
                    if (standings[t2Id]) {
                        standings[t2Id].setsWon += set[1] > set[0] ? 1 : 0;
                        standings[t2Id].setsLost += set[1] < set[0] ? 1 : 0;
                        standings[t2Id].gamesWon += set[1];
                        standings[t2Id].gamesLost += set[0];
                    }
                }
            });
        });

        return standings;
    },

    /**
     * Genera tabla de posiciones para Suizo
     * @param {object} standings - Standings
     * @returns {string} - HTML de tabla
     */
    renderStandings(standings) {
        const arr = Object.values(standings).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
        });

        const header = `
            <thead>
                <tr>
                    <th>#</th>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>Pts</th>
                </tr>
            </thead>
        `;

        const rows = arr.map((s, i) => `
            <tr>
                <td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td style="font-weight:700">${Sanitizer.text(s.name)}</td>
                <td>${s.matchesPlayed}</td>
                <td style="color:#15803d;font-weight:700">${s.matchesWon}</td>
                <td>${s.matchesDrawn || 0}</td>
                <td style="color:#dc2626">${s.matchesPlayed - s.matchesWon - (s.matchesDrawn || 0)}</td>
                <td style="font-weight:900;font-size:15px">${s.points}</td>
            </tr>
        `).join('');

        return `<table class="ltable">${header}<tbody>${rows}</tbody></table>`;
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwissFormat;
}
