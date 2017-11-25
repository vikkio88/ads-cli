import {printNewsList, todayInfo} from './cli';
import {Clear} from 'clui';
import {newsHelper} from "./utils";
import {day} from "../simulator/day";

export const mainActions = (status, context) => {
    Clear();
    todayInfo(status);
    return {
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
            printNewsList(status.news);
        },
        read(type, index) {
            switch (type) {
                case 'news':
                    newsHelper.read(status.news, index);
                    break;
                case 'messages':
                    break;
            }
        },
        messages() {
            console.log(status.messages.filter(m => !m.read));
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
        exit() {
            return true;
        },
        quit() {
            return true;
        }
    }
};