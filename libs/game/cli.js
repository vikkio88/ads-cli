import chalkPipe from 'chalk-pipe';
import moment from "moment";
import {messageHelper} from "./utils";
import {DATE_FORMAT} from "../../const";

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

const MORALE_COLOURS = [
    chalkPipe('greenBright'),
    chalkPipe('green'),
    chalkPipe('white'),
    chalkPipe('yellow'),
    chalkPipe('orange'),
    chalkPipe('redBright'),
    chalkPipe('red')
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
    console.log(`DATE: ${bold(moment(date).format(DATE_FORMAT))}`);
    printNotifications(messages, news);
};


export const printNotifications = (messages, news) => {
    const unreadMessages = messages.filter(m => !m.read).length;
    const unreadNews = news.filter(n => !n.read).length;
    let message = '';
    if (unreadMessages) {
        message += `You got ${bold(unreadMessages)} unread messages\n`;
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

export const printMessageList = messages => {
    console.log();
    console.log(bold("MESSAGES"));
    console.log(SMALL_ROW_LINE);
    messages.forEach((m, index) => {
        if (!m.read) {
            console.log(`${index + 1} - ${bold(m.subject)} - ${m.date} -  from: ${m.from}`);
        } else {
            console.log(`${index + 1} - ${link(m.subject)} - ${m.date} - from: ${m.from}`);
        }
        console.log(SMALL_ROW_LINE)
    });
    if (!messages.length) {
        console.log();
        console.log('No messages');
    }
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
    return bold(`${FULL_STAR.repeat(fullStars)}${EMPTY_STAR.repeat(NUMBER_OF_STARS - fullStars)}`);
};

export const printMessage = (message, today) => {
    console.log(SMALL_ROW_LINE);
    console.log(bold(message.subject));
    console.log(`from: ${bold(message.from)}`);
    console.log(bold(message.date));
    console.log(SMALL_ROW_LINE);
    console.log(message.message);
    console.log(SMALL_ROW_LINE);
    if (message.actions.length) {
        if (messageHelper.canStillReply(message, today)) {
            console.log(bold('You can reply to this message'));
        } else {
            console.log(bold('You cannot reply to this message anymore'));
        }
        console.log(SMALL_ROW_LINE);
    }
    console.log();
};


export const moraleToEmoji = morale => {
    const moraleCount = MORALE.length;
    const emojiIndex = Math.min(Math.round(morale * moraleCount / PERCENT), moraleCount - 1);
    return MORALE_COLOURS.reverse()[emojiIndex](
        MORALE.reverse()[emojiIndex]
    );
};