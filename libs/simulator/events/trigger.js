import conditions from "./conditions";

export default (today, status, context) => {
    const events = [];

    Object.keys(conditions).forEach(condition => {
        const triggered = conditions[condition](today, status, context);
        if (triggered) {
            events.push(triggered)
        }
    });

    return events;
};
