import readline from 'readline-sync';
import { Clear } from 'clui';
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
        Clear();
        console.log(`DATE: ${status.date.format('DD-MM-YYYY')}`);
        readline.promptCLLoop({
            status(key = null) {
                if (!key) {
                    console.log(status);
                } else {
                    console.log(status[key]);
                }

            },
            context(key = null) {
                if (!key) {
                    console.log(context);
                } else {
                    console.log(context[key]);
                }
            },
            next() {
                Clear();
                const result = day.simulate(status, context);
                status = result.status;
                context = result.context;
                console.log(`DATE: ${status.date.format('DD-MM-YYYY')}`);
            },
            exit() {
                return true;
            },
            quit() {
                return true;
            }
        });

        game.quit();
    }

};