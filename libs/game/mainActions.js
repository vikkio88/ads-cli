import {error, printNewsList, todayInfo} from './cli';
import {Clear} from 'clui';
import {leaguePrinter, newsHelper, teamPrinter} from "./utils";
import {day} from "../simulator/day";

export const mainActions = (status, context) => {
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
            switch (entity) {
                case 'ts':
                case 'teams':
                    teamPrinter.teams(context.teams.list);
                    break;
                case 't':
                case 'team':
                    teamPrinter.team(context.teams.list, action);
                    break;
                case 'l':
                case 'league':
                    const {table, scorers} = context.league;
                    if (action === 'table' || action === 't') {
                        leaguePrinter.table(table);
                    } else if (action === 'scorers') {
                        leaguePrinter.scorers(scorers);
                    }
                    break;
                case 'market':
                    break;
                default:
                    console.log(error(`wrong command ${entity} ${action}`))
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
                default:
                    console.log(error(`no ${type} to read`));
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