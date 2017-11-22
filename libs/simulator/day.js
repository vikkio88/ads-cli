import { triggerDates } from '../game/calendar';
export const day = {
    simulate(status, context) {
        const today = status.date;
        const dateTriggeredEvent = triggerDates[today.format('DD-MM')];
        if (dateTriggeredEvent) {
            result = dateTriggeredEvent(status, context);
            status = result.status;
            context = result.context;
        }
        status.date = status.date.add(1, 'day');
        return { status, context };
    }
};