import inquirer from 'inquirer';
import {TEAM_NUMBER} from "../../const";
import {CONFIRM_TYPE, INPUT_TYPE, LIST_TYPE} from "../../const/cli";
import {nations} from '../../config/nationalities';
import {generator} from '../generator';
import {context, status} from './status';
import {teamHelper} from '../';
import {bold, error, printNews} from './cli';

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
            console.log("Generating Teams...");
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
        return news.map(newsHelper.setAsRead)
    },
    setAsRead(singleNews) {
        singleNews.read = true;
        return singleNews;
    }
};

export const messageHelper = {};

export const leaguePrinter = {
    table(table) {
        let orderedTable = [];
        Object.keys(table).forEach(t => {
            orderedTable.push(table[t]);
        });
        console.log(bold('League Table'));
        orderedTable = orderedTable.sort((r1, r2) => r1.points < r2.points);
        orderedTable.forEach((r, index) => {
            console.log(
                `${index + 1} - ${r.name} P ${bold(r.played)} W ${bold(r.won)} D ${bold(r.draw)} L ${bold(r.lost)} DG ${bold(r.goalsScored - r.goalsConceded)}  - ${bold(r.points)}`
            );
            console.log('----------------------------------------------------');
        });
    },
    scorers(scorers) {
        console.log(scorers);
    },
    results(results) {
        console.log(results);
    }
};

export const teamPrinter = {
    teams(teams) {
        teams.forEach((t, index) => {
            console.log(`${index + 1} - ${t.name}`);
        });
    },
    team(teams, index) {
        const selectedTeam = teams[index - 1];
        if (selectedTeam) {
            console.log();
            console.log(bold(selectedTeam.name));
            console.log(bold('Coach'));
            personPrinter.coach(selectedTeam.coach);
            console.log('-------------');
            console.log(bold('Roster'));
            selectedTeam.roster.forEach(p => {
                personPrinter.player(p);
            });
        } else {
            console.log(error(`No team with selected index ${index}`));
        }
    }
};

const personPrinter = {
    coach(coach) {
        console.log(
            `${coach.name} ${coach.surname} (${coach.age}) (${coach.nationality})`
        );
    },
    player(player) {
        console.log(
            `${player.position} - ${player.name} ${player.surname} (${player.age}) (${player.nationality})`
        );
    }
};