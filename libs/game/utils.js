import inquirer from 'inquirer';
import readline from 'readline-sync';
import moment from 'moment';
import Table from 'cli-table2';
import {TEAM_NUMBER} from "../../const";
import {CONFIRM_TYPE, INPUT_TYPE, LIST_TYPE} from "../../const/cli";
import {extendedNationalities, nations, nationsAssoc} from '../../config/nationalities';
import {generator} from '../generator';
import {context, status} from './status';
import {teamHelper} from '../';
import {
    bold, error, link, orangeBold,
    moraleToEmoji, percentageToStar, printMessage, printNews,
    ROW_LINE, SMALL_ROW_LINE, tableFactory
} from './cli';
import {DATE_FORMAT} from "../../const/index";
import {objectFlip} from "../../utils";

const MAX_SCORERS = 10;
const mainMenuMapping = {
    'New Game': 'new',
    'Load': 'load',
    'Quit': 'quit'
};


export const ask = {
    mainMenu(callbacks) {
        const questions = [
            {
                type: LIST_TYPE,
                name: 'menuChoice',
                message: 'Main Menu',
                choices: ['New Game', 'Load', 'Quit']
            },
            {
                type: CONFIRM_TYPE,
                name: 'quit',
                message: 'Are you sure?',
                when: function (answers) {
                    return answers.menuChoice === 'Quit';
                },
                default: false
            }
        ];

        inquirer.prompt(questions).then(answers => {
            const {menuChoice} = answers;
            callbacks[mainMenuMapping[menuChoice]]();
        });
    },

    newGame(mainLoop) {
        const questions = [
            {
                type: INPUT_TYPE,
                name: 'name',
                message: "What's your full name?",
                default: 'Mario Rossi',
                validate: value => !(value.match(/^\w+ +\w+ ?$/i) === false) || 'Please enter a valid full name'
            },
            {
                type: INPUT_TYPE,
                name: 'age',
                message: 'How old are you',
                default: 30,
                validate: value => !isNaN(parseFloat(value)) || 'Please enter a number',
                filter: Number
            },
            {
                type: LIST_TYPE,
                name: 'nationality',
                message: 'Where are you from?',
                choices: Object.keys(objectFlip(nationsAssoc))
            }
        ];

        let player = {};
        inquirer.prompt(questions).then(answers => {
            player = {...answers};
            const teams = generator.teams(TEAM_NUMBER);
            const nationality = objectFlip(nationsAssoc)[player.nationality];
            const currency = extendedNationalities[nationality].currency;
            player = {
                ...player,
                nationality
            };
            mainLoop(
                {
                    ...status,
                    player,
                    settings: {
                        ...status.settings,
                        currency
                    }
                },
                {
                    ...context,
                    teams: {
                        hash: teamHelper.teamsToObject(teams),
                        list: teams
                    },
                    league: {
                        ...context.league,
                        table: teamHelper.createCleanTable(teams)
                    }
                }
            );
        });
    }
};

export const newsHelper = {
    read(news, index) {
        if (index === 'last') {
            index = news.length ? 1 : 0;
        }
        const newsToRead = news[index - 1];
        if (newsToRead) {
            printNews(newsToRead);
            newsHelper.setAsRead(newsToRead);
        } else {
            console.log(error(`No news with index ${index}`));
        }
    },
    setAllAsRead(news) {
        return news.map(newsHelper.setAsRead);
    },
    setAsRead(singleNews) {
        singleNews.read = true;
        return singleNews;
    }
};

export const messageHelper = {
    read(status, index) {
        const {messages} = status;
        if (index === 'last') {
            index = messages.length ? 1 : 0;
        }
        const message = messages[index - 1];
        if (message) {
            printMessage(message, status.date);
            messageHelper.setAsRead(message);
        } else {
            console.log(error(`No messages with index ${index}`));
        }
    },
    reply(status, index) {
        const {messages} = status;
        const message = messages[index - 1];
        if (message) {
            printMessage(message, status.date);
            messageHelper.setAsRead(message);
            if (!messageHelper.canStillReply(message, status.date)) {
                console.log(error('The message has expired...'))
            } else {
                const reply = Number(readline.keyInYN("Your reply?"));
                message.replied = true;
                status.actions = [
                    ...status.actions,
                    {
                        action: message.actions[reply],
                        payload: message.payload
                    }
                ];
            }
            return;
        }

        console.log(error(`No messages with index ${index}`));
    },
    canStillReply(message, today) {
        return !message.replied && moment(today)
            .isSameOrBefore(
                moment(message.date, DATE_FORMAT).add(message.ttl, 'days')
            );
    },
    setAllAsRead(messages) {
        return messages.map(messageHelper.setAsRead);
    },
    setAsRead(message) {
        message.read = true;
        return message;
    }
};

const tableOrdering = field => {
    return (row1, row2) => row1[field] < row2[field] ? 1 : -1;
};

export const leaguePrinter = {
    table(table, options = {}) {
        let orderedTable = [];
        Object.keys(table).forEach(t => {
            orderedTable.push(table[t]);
        });
        console.log(bold('League Table'));
        orderedTable = orderedTable.sort(tableOrdering('points'));
        const tableCli = tableFactory(
            ['#', 'Team', 'P', 'W', 'D', 'L', 'GS', 'GC', 'GD', 'Points']
        );
        orderedTable.forEach((r, index) => {
            let teamRow = [
                `${index + 1}`,
                `${bold(r.name)}`,
                `${r.played}`,
                `${r.won}`,
                `${r.draw}`,
                `${r.lost}`,
                `${r.goalsScored}`,
                `${r.goalsConceded}`,
                `${r.goalsScored - r.goalsConceded}`,
                `${r.points}`
            ];
            if (options.team && options.team === r.name) {
                teamRow = teamRow.map(e => orangeBold(e));
            }
            tableCli.push(teamRow);
        });
        console.log(tableCli.toString());
        console.log();
    },
    scorers(scorers, options = {}) {
        let orderedTable = [];
        Object.keys(scorers).forEach(p => {
            orderedTable.push(scorers[p]);
        });
        orderedTable = orderedTable.sort(tableOrdering('goals'));

        if (orderedTable.length > MAX_SCORERS) {
            orderedTable = orderedTable.slice(0, MAX_SCORERS);
        }
        console.log(bold('League Scorers Table'));
        console.log(ROW_LINE);
        const table = tableFactory(['#', 'Player', 'Team', 'Goals']);
        orderedTable.forEach((r, index) => {
            const {player} = r;
            let tableRow = [index + 1, `${player.name} ${player.surname}`, bold(r.team), bold(r.goals)];
            if (options.team && options.team === r.team) {
                tableRow = tableRow.map(e => orangeBold(e));
            }
            table.push(tableRow)
        });
        console.log(table.toString());
        console.log();
    },
    fixture(fixture, options = {}) {
        if (!fixture.length) {
            console.log(error("Fixture for the next season are not available yet"));
        }
        const matchToPlay = fixture.filter(r => !r.played);
        matchToPlay.some((round, index) => {
            console.log(bold(`Round ${round.index + 1} - ${moment(round.date).format(DATE_FORMAT)}`));
            round.matches.forEach(m => {
                let {home, away} = m;
                if (options.team && options.team === m.home) {
                    home = bold(home);
                }
                if (options.team && options.team === m.away) {
                    away = bold(away);
                }
                console.log(`${home} - ${away}`);
            });
            console.log(SMALL_ROW_LINE);
            console.log();
            return !readline.keyInYN(`Continue? ${index + 1}/${matchToPlay.length}`);
        });
    },
    results(fixture, options = {}) {
        const playedRounds = fixture.filter(r => r.played);
        if (!playedRounds.length) {
            console.log(error("No games played yet"));
        }
        playedRounds.some((round, index) => {
            console.log(bold(`Round ${round.index + 1} - ${moment(round.date).format(DATE_FORMAT)}`));
            round.results.forEach(m => {
                let {home, away} = m;
                if (options.team && options.team === m.home) {
                    home = bold(home);
                }
                if (options.team && options.team === m.away) {
                    away = bold(away);
                }
                console.log(`${home} - ${away} ${m.homeGoal} - ${m.awayGoal}`);
            });
            console.log(SMALL_ROW_LINE);
            console.log();
            return !readline.keyInYN(`Continue? ${index + 1}/${playedRounds.length}`);
        });
    }
};

export const teamPrinter = {
    teams(teams, options = {}) {
        console.log(bold('TEAMS'));
        console.log();
        const table = tableFactory(['#', 'Name']);
        teams.forEach((t, index) => {
            table.push([`${index + 1}`, options.team && options.team === t.name ? bold(t.name) : t.name]);
        });
        console.log(table.toString());
    },
    team(teams, index, options = {}) {
        const selectedTeam = teams[index - 1];
        if (selectedTeam) {
            console.log();
            console.log(SMALL_ROW_LINE);
            console.log(bold(selectedTeam.name));
            console.log(bold('Coach'));
            const coachTable = tableFactory(['Name', 'Age', 'Nation', 'Skill']);
            coachTable.push(personPrinter.coachToRow(selectedTeam.coach));
            console.log(coachTable.toString());
            console.log(SMALL_ROW_LINE);
            console.log(bold('Roster'));
            console.log(ROW_LINE);
            const rosterTable = tableFactory(['Pos.', 'Name', 'Age', 'Nation', 'Morale', 'Skill']);
            selectedTeam.roster.forEach(p => {
                rosterTable.push(personPrinter.playerToRow(p));
            });
            console.log(rosterTable.toString());
            console.log();
        } else {
            console.log(error(`No team with selected index ${index}`));
        }
    }
};

const personPrinter = {
    person(person, options = {}) {
        console.log(`${person.name} ${person.surname}`);
    },
    coachToRow(coach, options = {}) {
        return [`${coach.name} ${coach.surname}`, coach.age, coach.nationality, percentageToStar(coach.skill)];
    },
    playerToRow(player, options = {}) {
        return [player.position, `${bold(player.name)} ${bold(player.surname)}`, player.age, player.nationality, moraleToEmoji(player.status.morale), percentageToStar(player.skill)];
    }
};