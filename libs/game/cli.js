export const printNotifications = ({ messages, news }) => {
    const unreadMessages = messages.filter(m => !m.read).length;
    const unreadNews = news.filter(n => !n.read).length;
    let message = ''
    if (unreadMessages) {
        message += `You got ${unreadMessages} unread mail\n`;
    }

    if (unreadNews) {
        message += `You got ${unreadNews} unread news.\n`;
    }

    console.log(message);
}