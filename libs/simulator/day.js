const extractEvents = events => {
    const importantMessages = [];
    const mails = [];
    const news = [];

    events.forEach(e => {
        const messages = e.importantMessages || [];
        importantMessages.push(...messages);
        mails.push(...e.mails);
        news.push(...e.news);
    });
    return {
        importantMessages,
        notifications: {
            mails,
            news
        }
    }
};

const day = {
    simulate(status, actions, context){
        const actionsResult = this.applyActions(status, actions, context);
        const eventsArray = actionsResult.events;
        status = actionsResult.status;
        const eventsResult = this.todayEvents(status, actions, context);
        eventsArray.push(...eventsResult.events);
        const events = extractEvents(eventsArray);
        return {
            status,
            events
        }
    },
    applyActions(status, actions, context){
        return {
            status,
            events: []
        }
    },
    todayEvents(status, actions, context){
        return {
            status,
            events: []
        }
    }
};

export {day};