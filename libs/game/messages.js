export const messageGenerator = {
    generate(subject, from, message, date, actions, payload, ttl) {
        actions = actions || [];
        payload = payload || [];
        ttl = ttl || 0;
        return {
            subject,
            from,
            message,
            date,
            actions,
            payload,
            ttl,
            replied: false
        }
    }
};