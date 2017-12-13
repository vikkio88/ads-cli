import {ask, messageHelper} from "./utils";
import {error, printMessageList, success} from "./cli";

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

export const messagesManager = state => {
    const {status, action} = state;
    let {payload} = state;
    switch (action) {
        case 'r':
        case 'read': {
            switch (payload) {
                case 'a':
                case 'all':
                    messageHelper.setAllAsRead(status.messages);
                    console.log(success("Set all messages as read"));
                    break;
                default:
                    if (payload !== Number || payload > status.messages.length) {
                        payload = ask.selectFromList('which message?', status.messages, messageLabel);
                    }
                    if (payload === -1) {
                        return;
                    }
                    messageHelper.read(status, payload);
            }
            break;
        }
        case 'reply': {
            if (payload !== Number || payload > status.messages.length) {
                payload = ask.selectFromList('which message?', status.messages, messageLabel);
            }
            if (payload === -1) {
                return;
            }
            messageHelper.reply(status, payload);
            break;
        }
        case 'l':
        case 'ls':
        case 'list': {
            printMessageList(status.messages);
            break;
        }
        default:
            console.log(error(`Wrong command ${action} ${payload}`));
    }
};

const messageLabel = message => `${message.subject} - ${message.from}`;