import chalkPipe from 'chalk-pipe';

const red = chalkPipe('red');
const white = chalkPipe('white');
const black = chalkPipe('black');
const green = chalkPipe('green');
const blue = chalkPipe('blue');
const yellow = chalkPipe('yellow');
const orange = chalkPipe('orange');
const magenta = chalkPipe('magenta');
const gray = chalkPipe('gray');

const bgBlue = chalkPipe('bgBlue');

export const FULL_BAR = '█';
const EMPTY_BAR = '░';
const BIG_X = '╳';

export const COLOURS = [
    red,
    white,
    green,
    blue,
    yellow,
    black,
    orange,
    magenta,
    gray
];
export const FLAGS = {
    'it': `${green(FULL_BAR)}${white(FULL_BAR)}${red(FULL_BAR)}`,
    'en': `${blue(FULL_BAR)}${red(bgBlue((BIG_X)))}${blue(FULL_BAR)}`,
    'ru': `${white(EMPTY_BAR)}${blue(EMPTY_BAR)}${red(EMPTY_BAR)}`,
    'es': `${red(EMPTY_BAR)}${yellow(EMPTY_BAR)}${yellow(EMPTY_BAR)}`,
    'de': `${black(FULL_BAR)}${red(EMPTY_BAR)}${yellow(EMPTY_BAR)}`,
    'tr': `${red(FULL_BAR)}${white(EMPTY_BAR)}${red(FULL_BAR)}`,
    'fr': `${blue(FULL_BAR)}${white(FULL_BAR)}${red(FULL_BAR)}`,
    'ja': `${white(FULL_BAR)}${red(EMPTY_BAR)}${white(FULL_BAR)}`,
    'nl': `${red(EMPTY_BAR)}${white(EMPTY_BAR)}${blue(EMPTY_BAR)}`,
    'cz': `${blue(FULL_BAR)}${white(EMPTY_BAR)}${red(EMPTY_BAR)}`,
};