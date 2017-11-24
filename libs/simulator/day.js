import moment from 'moment';
import { triggerDates } from '../game/calendar';
import { leagueHelper } from '../helpers';

export const day = {
    simulate(status, context) {
        const today = moment(status.date);
        const dateTriggeredEvent = triggerDates[today.add(1, 'day').format('DD-MM')];

        if (dateTriggeredEvent) {
            result = dateTriggeredEvent(status, context);
            status = result.status;
            context = result.context;
        }

        const league = context.league;
        status.news = [
            ...status.news,
            ...leagueHelper.simulateDay(league, context.teams, today)
        ];
        status.date = status.date.add(1, 'day');
        return { status, context };
    }
};