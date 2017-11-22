import readline from 'readline-sync';
import { ask } from './utils';
import { day } from '../';

export const game = {
    init() {
        ask.mainMenu({
            new: this.new,
            load: this.load,
            quit: this.quit
        });
    },

    new() {
        ask.newGame(game.mainLoop);
    },

    load() {
        console.log("load");
    },

    save() {

    },

    quit() {
        console.log("Bye");
        process.exit(0);
    },

    mainLoop(status, context) {
        let command = '';
        while (command !== 'quit') {
            console.log(`DATE: ${status.date.format('DD-MM-YYYY')}`);
            command = readline.prompt('> ');
            if (command == 'status') {
                console.log(status);
            }
            if (command == 'context') {
                console.log(context);
            }
            if (command == 'next') {
                const result = day.simulate(status, context);
                status = result.status;
                context = result.context;
            }


        }
        game.quit();
    }

};