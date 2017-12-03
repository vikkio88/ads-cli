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
            ...news,
            ...status.news
        ];
    } else {
        status.news = [
            news,
            ...status.news
        ];
    }
};
const appendMessages = (status, messages) => {
    if (!messages) {
        return;
    }
    if (Array.isArray(messages)) {
        status.messages = [
            ...messages,
            ...status.messages
        ];
    } else {
        status.messages = [
            messages,
            ...status.messages
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
            this.parseResultToStatus(action.action({status, context}, action.payload), status);
        });
        status.actions = [];

        const {league, teams} = context;
        const {currentTeam} = status;
        const leagueDayResult = leagueHelper.simulateDay(league, teams, today, currentTeam);
        this.parseResultToStatus(
            leagueDayResult,
            status
        );
        const {playerTeamMatch} = leagueDayResult;
        status.tempEvents = {playerTeamMatch};

        trigger({today, status, context}).forEach(event => {
            this.parseResultToStatus(event({today, status, context}), status);
        });

        status.date = moment(status.date).add(1, 'day').format();
        return {status, context};
    },

    parseResultToStatus(result, status) {
        const {news, messages} = result;
        appendMessages(status, messages);
        appendNews(status, news)
    }
};