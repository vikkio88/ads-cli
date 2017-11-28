import {messageGenerator} from "../../game/messages";
import {newsGenerator} from "../../game/news";
import {DATE_FORMAT} from "../../../const";
import moment from "moment";
import {randomizer} from "../../generator/randomizer";

export const noOp = () => {
};
export const acceptContract = (state, payload) => {
    const {status} = state;
    status.hired = true;
    status.contract = payload.contract;
    status.currentTeam = payload.team;
    status.fame = status.fame + randomizer.int(1, 10);
    const today = moment(status.date).format(DATE_FORMAT);

    return {
        messages: messageGenerator.generate(
            'Great news!',
            `${payload.team}`,
            `Dear ${status.player.name},\n` +
            `Thanks for accepting. We can't wait to start working with you`,
            today
        ),
        news: newsGenerator.generate(
            `${payload.team} hired ${status.player.name}`,
            `${payload.team} announced today that they hired ${status.player.name} as new Athletic Director.\n` +
            `He was offered a ${payload.contract.years} years contract.`,
            today
        )
    };
};