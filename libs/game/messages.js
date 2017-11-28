export const messageGenerator = {
    generate(subject, from, message, date, actions, payload, ttl) {
        return {
            subject,
            from,
            message,
            date,
            actions,
            payload,
            ttl
        }
    }
};