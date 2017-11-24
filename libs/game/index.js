import readline from 'readline-sync';
import { Clear } from 'clui';
import { ask, newsHelper } from './utils';
import { day } from '../';
import { printNotifications, todayInfo } from './cli';

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
        todayInfo(status);
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
            news() {
                console.log(status.news.filter(n => !n.read));
                status.news = newsHelper.setAllAsRead(status.news);
            },
            messages() {
                console.log(status.messages.filter(m => !m.read));
            },
            next() {
                Clear();
                const result = day.simulate(status, context);
                status = result.status;
                context = result.context;
                todayInfo(status);
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