import {newsGenerator} from "../../game/news";
import {DATE_FORMAT} from "../../../const";
import {randomizer} from "../../generator/randomizer";
import {messageGenerator} from "../../game/messages";
import {generator} from "../../generator/generator";
import {acceptContract, noOp} from "../actions/index";

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
            money: randomizer.int(18, 50)
        };
        const teamIndex = list.indexOf(team);

        const ttl = randomizer.int(1, 3);
        const messages = messageGenerator.generate(
            'Contract Offer',
            team.name,
            `Dear ${status.status.name},
            ${team.name} president is delighted to offer you ${contract.years} years contract
            at £${contract.money}k per year, would you accept?
            You need to decide in ${ttl} days.
            (team index is ${teamIndex})`,
            state.today.format(DATE_FORMAT),
            [noOp, acceptContract],
            {team, teamIndex, contract},
            ttl
        );
        return {messages};
    }
    return {};
};