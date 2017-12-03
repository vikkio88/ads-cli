import {success, error, printNewsList, printMessageList, todayInfo} from './cli';
import {Clear} from 'clui';
import {messageHelper, newsHelper} from "./utils";
import {day} from "../simulator/day";
import {db} from "./db";

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
        read(type, index) {
            switch (type) {
                case 'all':
                    if (index === 'messages') {
                        messageHelper.setAllAsRead(status.messages);
                        console.log(success("Set all messages as read"));
                    }
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
                case 'message':
                case 'messages':
                    if (index) {
                        messageHelper.read(status, index);
                    } else {
                        printMessageList(status.messages);
                    }
                    break;
                default:
                    console.log(error(`wrong command: read ${type}`));
                    break;
            }
        },
        action(type, index) {
            switch (type) {
                case 'messages':
                case 'message': {
                    if (index && status.messages.length) {
                        messageHelper.reply(status, index);
                    } else {
                        console.log(error(`wrong message index ${index}`));
                    }
                    break;
                }
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