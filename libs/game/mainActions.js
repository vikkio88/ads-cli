import {success, error, printNewsList, todayInfo} from './cli';
import {Clear} from 'clui';
import {newsHelper} from "./utils";
import {day} from "../simulator/day";
import {db} from "./db";
import {club} from "./club";
import {messagesManager} from "./messages";
import {actions} from "./actions";

export const mainActions = (status, context, game) => {
    Clear();
    todayInfo(status);
    return {
        clear() {
            Clear();
            todayInfo(status);
        },
        status(key = null) {
            if (!key) {
                console.log(status);
            } else {
                console.log(status[key]);
            }
        },
        db(entity, action) {
            db({status, context, entity, action});
        },
        club(entity, action, payload) {
            club({status, context, entity, action, payload});
        },
        messages(action, payload) {
            messagesManager({status, context, action, payload});
        },
        read(type, index) {
            switch (type) {
                case 'all':
                    if (index === 'news') {
                        newsHelper.setAllAsRead(status.news);
                        console.log(success("Set all news as read"));
                    }
                    break;
                case 'news':
                    if (index) {
                        newsHelper.read(status.news, index);
                    } else if (index === 'all') {
                        newsHelper.setAllAsRead(status.news);
                    } else {
                        printNewsList(status.news);
                    }
                    break;
                default:
                    console.log(error(`wrong command: read ${type}`));
                    break;
            }
        },
        action(entity, action, payload) {
            actions({status, context, entity, action, payload});
        },
        n() {
            Clear();
            const result = day.simulate(status, context);
            status = result.status;
            context = result.context;
            todayInfo(status);
        },
        next() {
            Clear();
            const result = day.simulate(status, context);
            status = result.status;
            context = result.context;
            todayInfo(status);
        },
        save() {
            game.save({status, context});
        },
        help() {
            console.log('commands:');
            console.log('   next, n : advance time');
            console.log('   read news');
            console.log('   read news INDEX: read the news at INDEX');
            console.log('   messages:');
            console.log('       messages read');
            console.log('       messages reply');
            console.log('       messages list');
            console.log('   db:');
            console.log('       teams: show the teams');
            console.log('       stats: show the stats');
            console.log('       league: ');
            console.log('           db league table: show the league table');
            console.log('           db league scorers: show the league scorers');
            console.log('           db league fixtures: show the league fixtures');
            console.log('           db league results: show the league results');
        },
        exit() {
            return true;
        },
        quit() {
            return true;
        }
    }
};