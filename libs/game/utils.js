import inquirer from 'inquirer';
import readline from 'readline-sync';
import moment from 'moment';
import Table from 'cli-table2';
import {TEAM_NUMBER} from "../../const";
import {CONFIRM_TYPE, INPUT_TYPE, LIST_TYPE} from "../../const/cli";
import {nations} from '../../config/nationalities';
import {generator} from '../generator';
import {context, status} from './status';
import {teamHelper} from '../';
import {
    bold, error, link,
    moraleToEmoji, percentageToStar, printMessage, printNews,
    ROW_LINE, SMALL_ROW_LINE
} from './cli';
import {DATE_FORMAT} from "../../const/index";

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
                choices: nations
            }
        ];

        let player = {};
        inquirer.prompt(questions).then(answers => {
            player = {...answers};
            const teams = generator.teams(TEAM_NUMBER);
            mainLoop(
                {
                    ...status,
                    player
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
    table(table) {
        let orderedTable = [];
        Object.keys(table).forEach(t => {
            orderedTable.push(table[t]);
        });
        console.log(bold('League Table'));
        console.log(ROW_LINE);
        orderedTable = orderedTable.sort(tableOrdering('points'));
        orderedTable.forEach((r, index) => {
            console.log(
                `${index + 1} - ${link(r.name)} P ${bold(r.played)} W ${bold(r.won)} D ${bold(r.draw)} L ${bold(r.lost)} DG ${bold(r.goalsScored - r.goalsConceded)}  - ${bold(r.points)}`
            );
            console.log(ROW_LINE);
        });
    },
    scorers(scorers) {
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
        orderedTable.forEach((r, index) => {
            const {player} = r;
            console.log(`${index + 1} - ${player.name} ${player.surname} - ${link(r.team)} - ${bold(r.goals)}`);
            console.log(ROW_LINE);
        });
    },
    fixture(fixture) {
        if (!fixture.length) {
            console.log(error("Fixture for the next season are not available yet"));
        }
        fixture.filter(r => !r.played).some(round => {
            console.log(bold(`Round ${round.index + 1} - ${moment(round.date).format(DATE_FORMAT)}`));
            round.matches.forEach(m => {
                console.log(`${m.home} - ${m.away}`);
            });
            console.log(SMALL_ROW_LINE);
            console.log();
            return !readline.keyInYN('Continue?');
        });
    },
    results(fixture) {
        const playedRounds = fixture.filter(r => r.played);
        if (!playedRounds.length) {
            console.log(error("No games played yet"));
        }
        playedRounds.some(round => {
            console.log(bold(`Round ${round.index + 1} - ${moment(round.date).format(DATE_FORMAT)}`));
            round.results.forEach(m => {
                console.log(`${m.home} - ${m.away} ${m.homeGoal} - ${m.awayGoal}`);
            });
            console.log(SMALL_ROW_LINE);
            console.log();
            return !readline.keyInYN('Continue?');
        });
    }
};

export const teamPrinter = {
    teams(teams) {
        console.log(bold('TEAMS'));
        console.log();
        const table = new Table({head: ['#', 'Name']});
        teams.forEach((t, index) => {
            table.push([`${index + 1}`, t.name]);
        });
        console.log(table.toString());
    },
    team(teams, index) {
        const selectedTeam = teams[index - 1];
        if (selectedTeam) {
            console.log();
            console.log(SMALL_ROW_LINE);
            console.log(bold(selectedTeam.name));
            console.log(bold('Coach'));
            personPrinter.coach(selectedTeam.coach);
            console.log(SMALL_ROW_LINE);
            console.log(bold('Roster'));
            console.log(ROW_LINE);
            selectedTeam.roster.forEach(p => {
                personPrinter.player(p);
                console.log(ROW_LINE);
            });
            console.log();
        } else {
            console.log(error(`No team with selected index ${index}`));
        }
    }
};

const personPrinter = {
    person(person) {
        console.log(`${person.name} ${person.surname}`);
    },
    coach(coach) {
        console.log(
            `${coach.name} ${coach.surname} (${coach.age}) (${coach.nationality}) ${percentageToStar(coach.skill)}`
        );
    },
    player(player) {
        console.log(`${player.position} - ${bold(player.name)} ${bold(player.surname)} (${player.age}) (${player.nationality}) Morale: ${moraleToEmoji(player.status.morale)}  Skill: ${percentageToStar(player.skill)}`);
    }
};