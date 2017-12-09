import 'babel-polyfill';
import {BANNER} from './const/cli';
import {game} from './libs/game/index';

console.log(BANNER);

game.init();
