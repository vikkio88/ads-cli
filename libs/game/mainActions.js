import {success, error, printNewsList, todayInfo} from './cli';
import {Clear} from 'clui';
import {newsHelper} from "./utils";
import {day} from "../simulator/day";
import {db} from "./db";
import {club} from "./club";
import {messagesManager} from "./messages";

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
        action(type) {
            switch (type) {
                case 'news':
                    newsHelper.pressConference({status, context});
                    break;
                default:
                    console.log(error(`invalid action type ${type}`));
                    break;
            }
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
        exit() {
            return true;
        },
        quit() {
            return true;
        }
    }
};