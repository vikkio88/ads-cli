export const status = {
    player: null,
    hired: false,
    fame: 0,
    jobStability: null,
    currentTeam: null,
    notifications: [],
    news: [],
    date: moment()
};

export const context = {
    teams: {
        hash: {},
        list: []
    },
    freeAgent: {
        coaches: [],
        players: []
    },
    league: {
        table: {},
        fixture: [],
        scorers: {}
    }
}