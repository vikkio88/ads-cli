import {newsGenerator} from "../../game/news";
import {CURREMCY_MODIFIERS, DATE_FORMAT} from "../../../const";
import {randomizer} from "../../generator/randomizer";
import {messageGenerator} from "../../game/messages";
import {acceptContract, noOp} from "../actions/index";
import {formatCurrency, percentageModify} from "../../../utils";

export const seasonOver = state => {
    const {status, context, today} = state;
    const {name, table, scorers} = context.league;
    status.history.push({name, table, scorers});
    const news = [
        newsGenerator.generate('Season finished, winner announced!', 'Season finished the winner has been announced', today.format(DATE_FORMAT)),
        newsGenerator.generate('Transfer Market Opened!', 'Transfer Market has reopened', today.format(DATE_FORMAT))
    ];
    status.marketOpen = true;
    return {news};
};

export const offerContract = state => {
    if (randomizer.chance(Math.max(50, state.status.fame))) {
        const {list} = state.context.teams;
        const team = randomizer.pickOne(list);
        const contract = {
            years: randomizer.int(1, 3),
            money: randomizer.int(18, 50) * CURREMCY_MODIFIERS.THOUSANDS
        };
        const teamIndex = list.indexOf(team) + 1;

        const ttl = randomizer.int(1, 3);
        const messages = messageGenerator.generate(
            'Contract Offer',
            team.name,
            `Dear ${state.status.player.name},\n` +
            `${team.name} president is delighted to offer you ${contract.years} years contract\n` +
            `at ${formatCurrency(contract.money)} per year, would you accept?\n` +
            `You need to decide in ${ttl} days.\n` +
            `(team index is ${teamIndex})`,
            state.today.format(DATE_FORMAT),
            [noOp, acceptContract],
            {team: team.name, teamIndex, contract},
            ttl
        );
        return {messages};
    }
    return {};
};

export const playersTeamWon = state => {
    const {status} = state;
    status.fame = percentageModify(status.fame, randomizer.int(0, 2));
    status.stability = percentageModify(status.stability, randomizer.int(0, 2));
    status.supporters = percentageModify(status.supporters, randomizer.int(0, 2));
    return {};
};

export const playersTeamLost = state => {
    const {status} = state;
    status.fame = percentageModify(status.fame, -1 * randomizer.int(0, 2));
    status.stability = percentageModify(status.stability, -1 * randomizer.int(0, 2));
    status.supporters = percentageModify(status.supporters, -1 * randomizer.int(0, 2));
    return {};
};