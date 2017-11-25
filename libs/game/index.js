import readline from 'readline-sync';
import {ask} from './utils';
import {mainActions} from './mainActions';

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
        readline.promptCLLoop(
            mainActions(status, context)
        );
        game.quit();
    }

};