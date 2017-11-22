import { ask } from './utils';

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
        console.log(status);
        console.log(context);
    }

};