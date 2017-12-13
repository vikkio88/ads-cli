import {newsGenerator} from "../../game/news";
import {CURRENCY_MODIFIERS, DATE_FORMAT, MONTH_SHORT} from "../../../const";
import {randomizer} from "../../generator/randomizer";
import {messageGenerator} from "../../game/messages";
import {acceptContract, acceptOffer, noOp} from "../actions";
import {formatCurrency, percentageModify, ucFirst} from "../../../utils";
import {leagueHelper, playerHelper, teamHelper} from "../../helpers";
import moment from "moment";
import {bold} from "../../game/cli";

export const seasonOver = state => {
    const {status, context, today} = state;
    const {currentTeam} = status;
    let {name, season, table, scorers} = context.league;
    const positionMap = {};
    const orderedTable = leagueHelper.orderedTable(table);
    orderedTable.forEach((r, index) => {
        let position = index + 1;
        positionMap[r.name] = {...r, position};
    });
    scorers = leagueHelper.orderedScorers(scorers);

    Object.keys(context.teams.hash).forEach(t => {
        t = context.teams.hash[t];
        t.stats.history.push({season, ...positionMap[t.name]});
    });

    let position = {};
    if (currentTeam) {
        position = {...positionMap[currentTeam]};
    }

    status.marketOpen = true;
    status.history.seasons.push({name, season, table: orderedTable, scorers});
    status.history.player.push({season, team: currentTeam, position});

    context.league.table = teamHelper.createCleanTable(context.teams.list);
    context.league.fixture = [];
    context.league.scorers = {};

    const winner = orderedTable[0];
    const second = orderedTable[1];
    const third = orderedTable[2];
    const topScorer = scorers[0];
    const topScorerPlayer = `${topScorer.player.name} ${topScorer.player.surname}`;
    const news = [
        newsGenerator.generate(
            `Season finished, ${winner.name} won the ${name} ${season}!`,
            `The ${name} ${season} winner has been announced: ${bold(winner.name)} !\n` +
            `They won the league with ${bold(winner.points)} points, seconded by ${bold(second.name)} with ${bold(second.points)} points.\n` +
            `${ucFirst(bold(third.name))} classified third instead, with ${bold(third.points)} points.\n` +
            `The scorers table instead was dominated by ${bold(topScorerPlayer)} (${bold(topScorer.team)}) with ${bold(topScorer.goals)} goals.`,
            today.format(DATE_FORMAT)
        ),
        newsGenerator.generate(
            'Transfer Market Opened!', 'Transfer Market has reopened', today.format(DATE_FORMAT)
        )
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
            money: randomizer.int(18, 50) * CURRENCY_MODIFIERS.THOUSANDS
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

export const sackPlayer = state => {
    const {status, context, today} = state;
    const {season} = context.league;
    const team = status.currentTeam;
    status.hired = false;
    status.contract = null;
    status.currentTeam = null;
    status.fame = percentageModify(status.fame, -1 * randomizer.int(1, 10));
    status.supporters = 0;
    status.stability = 0;
    status.history.player.push({
        season: `${season} - ${moment(state.date).format(MONTH_SHORT)}`,
        team,
        stats: {...context.league.table[team]}
    });
    const {name} = status.player;
    const date = today.format(DATE_FORMAT);
    return {
        messages: messageGenerator.generate(
            'Termination of your contract',
            `${team}`,
            `Dear Mr ${name},\n` +
            `We decided today to terminate your contract seen the recent results of the team.\n` +
            `Thanks for your work`,
            date
        ),
        news: newsGenerator.generate(
            `${team} sacked ${name}`,
            `${team} announced today that they terminated the contract of ${name} as Athletic Director.\n`,
            date,
        )
    }
};

export const transferOffer = state => {
    const {context, status, today} = state;
    const {hash} = context.teams;
    const {currentTeam} = status;
    const player = randomizer.pickOne(hash[currentTeam].roster);
    const team = randomizer.pickOne(Object.keys(hash));
    const offer = playerHelper.generateOffer(player);
    const ttl = randomizer.int(1, 5);

    return {
        messages: messageGenerator.generate(
            `Formal Offer for ${player.name} ${player.surname}`,
            `${team}`,
            `Dear Mr ${status.player.name},\n` +
            `We are formalizing you an offer of ${formatCurrency(offer)}\n` +
            `for the player ${player.name} ${player.surname}.\n` +
            `Please let us know in max ${ttl} days`,
            today.format(DATE_FORMAT),
            [noOp, acceptOffer],
            {player, offer, team},
            ttl
        )
    };
};