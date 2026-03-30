/**
 * MexicanoFormat.js - Formato Mexicano (Por Puntos)
 * Emparejamiento por nivel, puntos acumulados
 */

const MexicanoFormat = {
    /**
     * Genera partidos para formato Mexicano
     * @param {array} teams - Equipos registrados
     * @param {object} config - Configuración del torneo
     * @returns {array} - Partidos generados
     */
    generateMatches(teams, config) {
        const matches = [];
        const numRounds = Math.ceil(teams.length * 10 / 20); // ~10 partidos por equipo

        // Calcular nivel inicial por equipo (basado en categoría/ranking)
        const teamLevels = teams.map(t => ({
            id: t.id,
            name: t.name,
            level: t.category || 7,
            points: 0,
            matchesPlayed: 0
        }));

        for (let round = 0; round < numRounds; round++) {
            // Ordenar por puntos para emparejar por nivel
            teamLevels.sort((a, b) => b.points - a.points || b.level - a.level);

            const paired = new Set();
            const roundMatches = [];

            // Emparejar: 1°+4° vs 2°+3° (variante por nivel)
            for (let i = 0; i < teamLevels.length - 1; i++) {
                if (paired.has(i)) continue;

                // Buscar oponente de nivel similar
                let opponent = -1;
                for (let j = i + 1; j < teamLevels.length; j++) {
                    if (!paired.has(j)) {
                        // Preferir oponente con puntos similares
                        if (opponent === -1 || 
                            Math.abs(teamLevels[j].points - teamLevels[i].points) < 
                            Math.abs(teamLevels[opponent].points - teamLevels[i].points)) {
                            opponent = j;
                        }
                    }
                }

                if (opponent !== -1) {
                    paired.add(i);
                    paired.add(opponent);

                    roundMatches.push({
                        id: `mx_r${round}_m${roundMatches.length}`,
                        round: round,
                        matchNum: matches.length + roundMatches.length,
                        t1: [teamLevels[i].id],
                        t2: [teamLevels[opponent].id],
                        t1name: teamLevels[i].name,
                        t2name: teamLevels[opponent].name,
                        sets: [],
                        done: false,
                        winner: null,
                        court: ((roundMatches.length % config.numCourts) + 1),
                        isBye: false,
                        isMexicano: true
                    });
                }
            }

            matches.push(...roundMatches);
        }

        return matches;
    },

    /**
     * Actualiza puntos después de cada partido (para siguiente ronda)
     * @param {array} matches - Todos los partidos
     * @param {array} teams - Equipos
     * @param {object} config - Configuración
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
                setsWon: 0,
                setsLost: 0,
                gamesWon: 0,
                gamesLost: 0
            };
        });

        matches.filter(m => m.done && m.isMexicano).forEach(match => {
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
     * Genera tabla de posiciones para Mexicano
     * @param {object} standings - Standings calculados
     * @returns {string} - HTML de la tabla
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
                    <th>PP</th>
                    <th>S+</th>
                    <th>S-</th>
                    <th>G+</th>
                    <th>G-</th>
                    <th>Pts</th>
                </tr>
            </thead>
        `;

        const rows = arr.map((s, i) => {
            const gd = s.gamesWon - s.gamesLost;
            return `
                <tr>
                    <td>${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                    <td style="font-weight:700">${Sanitizer.text(s.name)}</td>
                    <td>${s.matchesPlayed}</td>
                    <td style="color:#15803d;font-weight:700">${s.matchesWon}</td>
                    <td style="color:#dc2626">${s.matchesPlayed - s.matchesWon}</td>
                    <td>${s.setsWon}</td>
                    <td>${s.setsLost}</td>
                    <td>${s.gamesWon}</td>
                    <td>${s.gamesLost}</td>
                    <td style="font-weight:900;font-size:15px">${s.points}</td>
                </tr>
            `;
        }).join('');

        return `<table class="ltable">${header}<tbody>${rows}</tbody></table>`;
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MexicanoFormat;
}
