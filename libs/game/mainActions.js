import {error, printNewsList, todayInfo} from './cli';
import {Clear} from 'clui';
import {leaguePrinter, newsHelper, teamPrinter} from "./utils";
import {day} from "../simulator/day";

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
                    const {table, scorers, fixture} = context.league;
                    switch (action) {
                        case 't':
                        case 'table':
                            leaguePrinter.table(table);
                            break;
                        case 's':
                        case 'scorers':
                            leaguePrinter.scorers(scorers);
                            break;
                        case 'f':
                        case 'fixture':
                            leaguePrinter.fixture(fixture);
                            break;
                        case 'r':
                        case 'results':
                            leaguePrinter.results(fixture);
                            break;
                        default:
                            console.log(error(`invalid action on League ${action}`));
                    }

                    break;
                case 'market':
                    break;
                default:
                    console.log(error(`wrong command ${entity} ${action}`));
            }
        },
        read(type, index) {
            switch (type) {
                case 'news':
                    if (index) {
                        newsHelper.read(status.news, index);
                    } else {
                        printNewsList(status.news);
                    }
                    break;
                case 'messages':
                    break;
                default:
                    console.log(error(`no ${type} to read`));
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