import moment from 'moment';
import {triggerDates} from '../game/calendar';
import {leagueHelper} from '../helpers';
import trigger from "./events/trigger";

const noMoreGamesToPlay = fixture => fixture.filter(r => !r.played).length === 0;
const appendNews = (status, news) => {
    status.news = [
        ...status.news,
        ...news
    ];
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
        }

        const league = context.league;
        appendNews(status, leagueHelper.simulateDay(league, context.teams, today));

        trigger(status, context).forEach(event => {
            const {news, messages} = event(status, context);
            appendNews(status, news);
            appendMessages(status, messages);
        });

        if (noMoreGamesToPlay(league.fixture)) {

        }
        status.date = status.date.add(1, 'day');
        return {status, context};
    }
};