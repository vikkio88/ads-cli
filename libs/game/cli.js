import chalkPipe from 'chalk-pipe';

const FULL_STAR = '★';
const EMPTY_STAR = '☆';
const PERCENT = 100;
const NUMBER_OF_STARS = 5;

const MORALE = [
    '😃',
    '😄',
    '😊',
    '😒',
    '😖',
    '😞',
    '😤',
];

export const bold = chalkPipe('bold');
export const link = chalkPipe('blue.underline');
export const error = chalkPipe('bgRed.#cccccc');
export const warning = chalkPipe('orange.bold');

export const bgWhiteBlack = chalkPipe('bgWhite.black');
export const bgRedWhite = chalkPipe('bgRedBright.white');

export const orangeBold = chalkPipe('orange.bold');
export const redBold = chalkPipe('red.bold');

export const ROW_LINE = '----------------------------------------------------';
export const SMALL_ROW_LINE = '----------------';

export const todayInfo = ({date, messages, news}) => {
    console.log(`DATE: ${bold(date.format('DD-MM-YYYY'))}`);
    printNotifications(messages, news);
};


export const printNotifications = (messages, news) => {
    const unreadMessages = messages.filter(m => !m.read).length;
    const unreadNews = news.filter(n => !n.read).length;
    let message = '';
    if (unreadMessages) {
        message += `You got ${bold(unreadMessages)} unread mail\n`;
    }

    if (unreadNews) {
        message += `You got ${bold(unreadNews)} unread news.\n`;
    }

    console.log(message);
};

export const printNews = news => {
    console.log(SMALL_ROW_LINE);
    console.log(bold(bgRedWhite(news.newspaper)));
    console.log(SMALL_ROW_LINE);
    console.log(bold(news.title));
    console.log(SMALL_ROW_LINE);
    console.log(bold(news.date));
    console.log(news.message);
    console.log(SMALL_ROW_LINE);
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

export const percentageToStar = percentage => {
    const fullStars = Math.round(percentage * NUMBER_OF_STARS / PERCENT);
    return `${FULL_STAR.repeat(fullStars)}${EMPTY_STAR.repeat(NUMBER_OF_STARS - fullStars)}`;
};

export const moraleToEmoji = morale => {
    const moraleCount = MORALE.length;
    const emojiIndex = Math.min(Math.round(morale * moraleCount / PERCENT), moraleCount - 1);
    return MORALE.reverse()[emojiIndex];
};