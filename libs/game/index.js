import readline from 'readline-sync';
import {ask} from './utils';
import {mainActions} from './mainActions';
import jsonfile from "jsonfile";
import {SAVE_FILENAME} from "../../const/index";

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
        console.log("loading...");
        try {
            const state = jsonfile.readFileSync(SAVE_FILENAME);
            game.mainLoop(state.status, state.context);
        } catch (e) {
            console.error(`Cannot load savegame ${e}`);
        }
    },

    save(state) {
        console.log("saving game...");
        try {
            jsonfile.writeFileSync(SAVE_FILENAME, state, 'utf8');
            console.log("Saved successfully");
        } catch (e) {
            console.error(`Error while saving ${e}`);
        }
    },

    quit() {
        console.log("Bye");
        process.exit(0);
    },

    mainLoop(status, context) {
        readline.promptCLLoop(
            mainActions(status, context, game)
        );
        game.quit();
    }

};