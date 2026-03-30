export default class GroupsFormat {
  constructor(teams, groupsCount = 4) {
    this.teams = teams;
    this.groupsCount = groupsCount;
    this.allowsDraws = true;
  }

  createGroups() {
    // Dividir equipos en grupos
    const shuffledTeams = [...this.teams].sort(() => Math.random() - 0.5);
    const groups = Array.from({ length: this.groupsCount }, () => []);

    shuffledTeams.forEach((team, index) => {
      groups[index % this.groupsCount].push(team);
    });

    return groups;
  }

  generateGroupSchedule(group) {
    // Todos vs todos dentro del grupo
    const schedule = [];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        schedule.push({
          team1: group[i],
          team2: group[j],
          result: null
        });
      }
    }
    return schedule;
  }
}
