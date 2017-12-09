import {messageGenerator} from "../../game/messages";
import {newsGenerator} from "../../game/news";
import {DATE_FORMAT} from "../../../const";
import moment from "moment";
import {randomizer} from "../../generator/randomizer";
import {formatCurrency, percentageModify} from "../../../utils";

const empty = {message: null, news: null};
export const noOp = () => empty;
export const acceptContract = (state, payload) => {
    const {status} = state;
    status.hired = true;
    status.contract = payload.contract;
    status.currentTeam = payload.team;
    status.fame = percentageModify(status.fame, randomizer.int(1, 10));
    status.supporters = percentageModify(status.fame, randomizer.int(1, 25));
    status.stability = percentageModify(status.fame, randomizer.int(10, 25));
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
export const acceptOffer = (state, payload) => {
    const {status, context} = state;
    const {currentTeam} = status;
    const {team, player, offer} = payload;
    const {hash} = context.teams;
    hash[currentTeam].finance += offer;
    hash[team].finance -= offer;

    hash[currentTeam].roster = hash[currentTeam].roster.filter(p => p !== player);
    hash[team].roster.push(player);
    const news = [];
    const messages = [];
    if (randomizer.chance(player.skill)) {
        status.supporters = percentageModify(status.supporters, -1 * randomizer.int(1, player.skill));
        messages.push(
            messageGenerator.generate(
                `Supporters angry about losing ${player.surname}`,
                `${currentTeam} FanClub`,
                `Hi mr ${status.player.name},\n` +
                `I just wanted to inform you that the supporters didn't really take well\n` +
                `your decision of selling ${player.surname} to ${team}`,
                moment(status.date).format(DATE_FORMAT)
            )
        )
    }

    news.push(newsGenerator.generate(
        `${currentTeam} sold ${player.surname} to ${team}`,
        `${currentTeam} confirmed on their website that we sold ${player.name} ${player.surname}\n` +
        `to ${team} today, according to some voices the money involved were around ${formatCurrency(offer + randomizer.int(-1, 2))}\n`,
        moment(status.date).format(DATE_FORMAT)
    ));

    return {news, messages};

};