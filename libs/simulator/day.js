import moment from 'moment';
import {triggerDates} from '../game/calendar';
import {leagueHelper} from '../helpers';
import trigger from "./events/trigger";

const appendNews = (status, news) => {
    if (!news) {
        return;
    }

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
    if (!messages) {
        return;
    }
    if (Array.isArray(messages)) {
        status.messages = [
            ...status.messages,
            ...messages
        ];
    } else {
        status.messages = [
            ...status.messages,
            messages
        ];
    }
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

        status.actions.forEach(action => {
            const {messages, news} = action.action({status, context}, action.payload);
            appendNews(status, news);
            appendMessages(status, messages);
        });
        status.actions = [];

        const league = context.league;
        appendNews(status, leagueHelper.simulateDay(league, context.teams, today));

        trigger({today, status, context}).forEach(event => {
            const {news, messages} = event({today, status, context});
            appendNews(status, news);
            appendMessages(status, messages);
        });

        status.date = moment(status.date).add(1, 'day').format();
        return {status, context};
    }
};