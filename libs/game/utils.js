import inquirer from 'inquirer';
import {TEAM_NUMBER} from "../../const";
import {LIST_TYPE, CONFIRM_TYPE, INPUT_TYPE} from "../../const/cli";
import {nations} from '../../config/nationalities';
import {generator} from '../generator';
import {status, context} from './status';
import {teamHelper} from '../';
import {printNews, error} from './cli';

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

export const messageHelper = {
    read(news) {
        const unreadNews = news.filter(n => !n.read);
        if (unreadNews.length) {
            latestUnread = unreadNews.pop();
            printNews(latestUnread);
            newsHelper.setAsRead(latestUnread);
        } else {
            console.log(error("No unread news"));
        }
    },
    setAllAsRead(news) {
        return news.map(newsHelper.setAsRead)
    },
    setAsRead(singleNews) {
        singleNews.read = true;
        return singleNews;
    }
}