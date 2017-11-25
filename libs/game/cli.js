import chalkPipe from 'chalk-pipe';

export const bold = chalkPipe('bold');
export const link = chalkPipe('blue.underline');
export const error = chalkPipe('bgRed.#cccccc');
export const warning = chalkPipe('orange.bold');

export const bgWhiteBlack = chalkPipe('bgWhite.black');
export const bgRedWhite = chalkPipe('bgRedBright.white');

export const orangeBold = chalkPipe('orange.bold');
export const redBold = chalkPipe('red.bold');

export const todayInfo = ({ date, messages, news }) => {
    console.log(`DATE: ${bold(date.format('DD-MM-YYYY'))}`);
    printNotifications(messages, news);
}


export const printNotifications = (messages, news) => {
    const unreadMessages = messages.filter(m => !m.read).length;
    const unreadNews = news.filter(n => !n.read).length;
    let message = ''
    if (unreadMessages) {
        message += `You got ${bold(unreadMessages)} unread mail\n`;
    }

    if (unreadNews) {
        message += `You got ${bold(unreadNews)} unread news.\n`;
    }

    console.log(message);
}

export const printNews = news => {
    console.log();
    console.log(bold(bgRedWhite(news.newspaper)));
    console.log("----------------");
    console.log(bold(news.title));
    console.log("----------------");
    console.log(bold(news.date));
    console.log(news.message);
    console.log();
};

export const printNewsList = newsList => {
    const unreadNews = newsList.filter(n => !n.read);
    const readNews = newsList.filter(n => n.read);
    console.log(bold("UNREAD NEWS"));
    console.log();
    if (!unreadNews.length) {
        console.log('-');
    }
    unreadNews.forEach(n => {
        console.log(`${newsList.indexOf(n) + 1} - ${n.date} - ${bold(n.title)}`)
    });
    console.log();
    console.log(bold("READ NEWS"));
    console.log();
    if (!readNews.length) {
        console.log('-');
    }
    readNews.forEach(n => {
        console.log(`${newsList.indexOf(n) + 1} - ${n.date} - ${link(n.title)}`)
    });
    console.log();
};