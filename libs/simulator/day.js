import moment from 'moment';
import {triggerDates} from '../game/calendar';
import {leagueHelper} from '../helpers';
import trigger from "./events/trigger";
import {newsGenerator} from "../game/news";
import {DATE_FORMAT} from "../../const/index";

const noMoreGamesToPlay = fixture => fixture.filter(r => !r.played).length === 0;
const appendNews = (status, news) => {
    if (Array.isArray(news)) {
        status.news = [
            ...status.news,
            ...news
        ];
    } else {
        status.news = [
            ...status.news,
            news
        ];
    }
};
const appendMessages = (status, messages) => {
    status.messages = [
        ...status.messages,
        ...messages
    ];
};

export const day = {
    simulate(status, context) {
        const today = moment(status.date);
        const dateTriggeredEvent = triggerDates[today.add(1, 'day').format('DD-MM')];

        if (dateTriggeredEvent) {
            const result = dateTriggeredEvent(status, context);
            status = result.status;
            context = result.context;
            appendNews(status, result.news);
        }

        const league = context.league;
        appendNews(status, leagueHelper.simulateDay(league, context.teams, today));

        trigger(today, status, context).forEach(event => {
            const {news, messages} = event(status, context);
            appendNews(status, news);
            appendMessages(status, messages);
        });

        if (noMoreGamesToPlay(league.fixture)) {
            const {name, table, scorers} = league;
            status.history.push({name, table, scorers});
            appendNews(status, newsGenerator.generate('Season finished, winner announced!', 'Season finished the winner has been announced', today.format(DATE_FORMAT)));
            appendNews(status, newsGenerator.generate('Transfer Market Opened!', 'Transfer Market has reopened', today.format(DATE_FORMAT)));
            status.marketOpen = true;
        }

        status.date = moment(status.date).add(1, 'day').format();
        return {status, context};
    }
};