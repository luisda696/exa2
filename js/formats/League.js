export default class LeagueFormat {
  constructor(teams) {
    this.teams = teams;
    this.allowsDraws = true;
  }

  generateSchedule() {
    // Todos vs todos
    const schedule = [];
    for (let i = 0; i < this.teams.length; i++) {
      for (let j = i + 1; j < this.teams.length; j++) {
        schedule.push({
          team1: this.teams[i],
          team2: this.teams[j],
          result: null,
          isDraw: false
        });
      }
    }
    return schedule;
  }
}
