import {rangeArray} from "../../utils";
import {moraleToEmoji} from "../../libs/game/cli";

describe('emojiPrinter', () => {
    test('it prints the right emoji in the right order', () => {
        rangeArray(100).forEach(index => {
            console.log(`${index} ${moraleToEmoji(index)}`);
        });
    });
});