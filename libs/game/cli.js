import chalkPipe from 'chalk-pipe';
import Table from 'cli-table2';
import {Progress} from 'clui';
import moment from 'moment';
import {messageHelper} from "./utils";
import {DATE_FORMAT} from "../../const";
import {BOXEN_DEFAULT_OPTIONS, TABLE_CHARS} from "../../const/cli";
import boxen from "boxen";

const FULL_STAR = '★';
const EMPTY_STAR = '☆';
const PERCENT = 100;
const NUMBER_OF_STARS = 5;

const MORALE = [
    '😤',
    '😞',
    '😖',
    '😒',
    '😊',
    '😄',
    '😃',
];

const MORALE_COLOURS = [
    chalkPipe('red'),
    chalkPipe('redBright'),
    chalkPipe('orange'),
    chalkPipe('yellow'),
    chalkPipe('white'),
    chalkPipe('green'),
    chalkPipe('greenBright')
];

export const bold = chalkPipe('bold');
export const link = chalkPipe('blue.underline');
export const error = chalkPipe('bgRed.#cccccc');
export const success = chalkPipe('green.bold');
export const warning = chalkPipe('orange.bold');

export const bgWhiteBlack = chalkPipe('bgWhite.black');
export const bgRedWhite = chalkPipe('bgRedBright.white');

export const cyan = chalkPipe('cyan');
export const orangeBold = chalkPipe('orange.bold');
export const redBold = chalkPipe('red.bold');

export const ROW_LINE = '----------------------------------------------------';
export const SMALL_ROW_LINE = '----------------';

const progressBarPercentage = (label, percent, length = ROW_LINE.length - 8) => {
    length = length - label.length;
    return `${cyan(label)} : ${(new Progress(length)).update(percent, 100)}`;
};

export const tableFactory = (head = null) => {
    const chars = TABLE_CHARS.chars;
    if (head) {
        return new Table({head, chars});
    }
    return new Table({chars});
};

export const boxenFactory = (text, options = {}) => boxen(text, {...BOXEN_DEFAULT_OPTIONS, ...options});

export const todayInfo = status => {
    const {date, messages, news, fame} = status;
    console.log(`DATE: ${bold(moment(date).format(DATE_FORMAT))}`);
    console.log(ROW_LINE);
    console.log(`${progressBarPercentage('Fame', fame)}`);
    printCurrentJobInfo(status);
    console.log(ROW_LINE);
    printNotifications(messages, news);
    console.log();
};


export const printCurrentJobInfo = status => {
    const {hired, currentTeam, stability, supporters} = status;
    if (hired) {
        console.log(ROW_LINE);
        console.log(`team: ${bold(currentTeam)}`);
        console.log(progressBarPercentage('Stability', stability));
        console.log(progressBarPercentage('Supporters', supporters));
    }
};

export const printNotifications = (messages, news) => {
    const unreadMessages = messages.filter(m => !m.read).length;
    const unreadNews = news.filter(n => !n.read).length;
    let message = '';
    if (unreadMessages) {
        message += `${orangeBold(unreadMessages)} unread messages\n`;
    }

    if (unreadNews) {
        message += `${orangeBold(unreadNews)} unread news.\n`;
    }

    console.log(message);
};

export const printNews = news => {
    console.log(boxenFactory(bold(bgRedWhite(news.newspaper))));
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
    if (!messages.length) {
        console.log();
        console.log(error('No messages'));
        console.log();
        return;
    }
    const table = tableFactory(['#', 'Subject', 'Date', 'From']);
    messages.forEach((m, index) => {
        let subject = '';
        if (!m.read) {
            subject = `${bold(m.subject)}`;
        } else {
            subject = `${m.subject}`;
        }
        table.push([`${index + 1}`, subject, `${m.date}`, `${cyan(m.from)}`]);
    });

    console.log(table.toString());
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
    return MORALE_COLOURS[emojiIndex](
        MORALE[emojiIndex]
    );
};

export const percentagePrinter = percentage => `${bold(percentage)}%`;