import inquirer from 'inquirer';
import { TEAM_NUMBER } from "../../const";
import { LIST_TYPE, CONFIRM_TYPE, INPUT_TYPE } from "../../const/cli";
import { nations } from '../../config/nationalities';
import { generator } from '../generator';

const mainMenuMapping = {
    'New Game': 'new',
    'Load': 'load',
    'Quit': 'quit'
}


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
            const { menuChoice } = answers;
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
                validate: value => !(value.match(/^\w+ +\w+ ?$/i) == false) || 'Please enter a valid full name'
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
            player = { ...answers };
            console.log("Generating Teams...");
            const teams = generator.teams(TEAM_NUMBER);
            teams.forEach(t => {
                console.log(t.name);
            });
            mainLoop(player, { teams });
        });
    }
}