import {messageGenerator} from "../../game/messages";
import {newsGenerator} from "../../game/news";
import {DATE_FORMAT, MONTH_SHORT} from "../../../const";
import moment from "moment";
import {randomizer} from "../../generator/randomizer";
import {formatCurrency, percentageModify} from "../../../utils";
import {bold} from "../../game/cli";
import {playerHelper} from "../../helpers";

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
    const {season, scorers} = context.league;
    const {currentTeam} = status;
    const {team, player, offer} = payload;
    const {hash} = context.teams;

    let playerGoals = 0;
    if (scorers[`${player.name}${player.surname}`]) {
        playerGoals = scorers[`${player.name}${player.surname}`].goals;
        scorers[`${player.name}${player.surname}`].team = team;
        scorers[`${player.name}${player.surname}`].goals = 0;
    }

    hash[currentTeam].finance += offer;
    hash[team].finance -= offer;
    hash[currentTeam].roster = hash[currentTeam].roster.filter(p => p !== player);
    player.stats.history.push({
        season: `${season} - ${moment(state.date).format(MONTH_SHORT)}`,
        team: currentTeam,
        stats: {goals: playerGoals}
    });
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

export const resign = state => {
    const {status, context} = state;
    const {season} = context.league;
    status.hired = false;
    status.contract = null;
    const team = status.currentTeam;
    status.currentTeam = null;
    status.fame = percentageModify(status.fame, -1 * randomizer.int(1, 10));
    status.fame = percentageModify(status.fame, randomizer.int(1, 10));
    status.history.player.push({
        season: `${season} - ${moment(state.date).format(MONTH_SHORT)}`,
        team,
        stats: {...context.league.table[team]}
    });

    const {name} = status.player;
    const date = moment(state.date).format(DATE_FORMAT);
    return {
        messages: messageGenerator.generate(
            'Termination of your contract',
            `${team}`,
            `Dear Mr ${name},\n` +
            `It is sad to see you leaving.\n` +
            `Thanks for your work`,
            date
        ),
        news: newsGenerator.generate(
            `${name} resigned from ${team}`,
            `${team} announced today that ${name} resigned from the position of Athletic Director.\n`,
            date,
        )
    }
};

export const speakGoodAboutTeam = (state, payload) => {
    const {status} = state;
    const {currentTeam, player} = status;
    if (payload.team === currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, randomizer.int(1, 5));
        status.supporters = percentageModify(status.supporters, randomizer.int(1, 10));
        status.fame = percentageModify(status.fame, randomizer.int(1, 3));
    }
    if (payload.team !== currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, (-1 * randomizer.int(1, 5)));
        status.supporters = percentageModify(status.supporters, (-1 * randomizer.int(1, 10)));
        status.fame = percentageModify(status.fame, randomizer.int(1, 10));
    }

    return {
        news: newsGenerator.generate(
            `${player.name} spoke really well about ${payload.team} club`,
            `${player.name}, yesterday, during a press conference was speaking really well about\n` +
            `${bold(payload.team)}${currentTeam === payload.team ? ', his own team' : ''}.`,
            moment(status.date).format(DATE_FORMAT)
        )
    };
};
export const speakBadAboutTeam = (state, payload) => {
    const {status} = state;
    const {currentTeam, player} = status;
    if (payload.team === currentTeam && randomizer.chance(80)) {
        status.stability = percentageModify(status.stability, -1 * randomizer.int(1, 5));
        status.supporters = percentageModify(status.supporters, -1 * randomizer.int(1, 10));
        status.fame = percentageModify(status.fame, randomizer.int(1, 5));
    }
    if (payload.team !== currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, randomizer.int(1, 5));
        status.supporters = percentageModify(status.supporters, randomizer.int(1, 10));
        status.fame = percentageModify(status.fame, randomizer.int(1, 3));
    }

    return {
        news: newsGenerator.generate(
            `${player.name} expressed his concerns about ${payload.team}`,
            `${player.name}, yesterday, during a press conference, expressed some concerns\n` +
            `about the current performance of ${bold(payload.team)}${currentTeam === payload.team ? ', his own team' : ''}.`,
            moment(status.date).format(DATE_FORMAT)
        )
    };
};
export const speakGoodAboutPlayer = (state, payload) => {
    const {status} = state;
    const {currentTeam, player} = status;
    if (payload.team === currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, randomizer.int(1, 5));
        status.supporters = percentageModify(status.supporters, randomizer.int(1, 5));
        status.fame = percentageModify(status.fame, randomizer.int(0, 2));
    }
    if (payload.team !== currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, randomizer.int(1, 2));
        status.supporters = percentageModify(status.supporters, randomizer.int(1, 2));
        status.fame = percentageModify(status.fame, randomizer.int(0, 2));
    }

    payload.player.status.morale = randomizer.chance(60) ?
        percentageModify(payload.player.status.morale, randomizer.int(1, 5))
        : percentageModify(payload.player.status.morale, -1 * randomizer.int(1, 15));

    return {
        news: newsGenerator.generate(
            `${player.name} had really good words for ${payload.playerName}`,
            `${player.name}, yesterday, during a press conference, was speaking really well about\n` +
            `the current performance of ${bold(payload.playerName)} (${payload.team})${currentTeam === payload.team ? ', currently playing in his own team' : ''}.` +
            `${currentTeam !== payload.team ? 'Is he probably planning to make an offer?' : ''}`,
            moment(status.date).format(DATE_FORMAT)
        )
    };
};
export const speakBadAboutPlayer = (state, payload) => {
    const {status} = state;
    const {currentTeam, player} = status;
    if (payload.team === currentTeam && randomizer.chance(80)) {
        status.stability = percentageModify(status.stability, -1 * randomizer.int(1, 5));
        status.supporters = percentageModify(status.supporters, -1 * randomizer.int(1, 5));
        status.fame = percentageModify(status.fame, randomizer.int(0, 2));
    }
    if (payload.team !== currentTeam && randomizer.chance(50)) {
        status.stability = percentageModify(status.stability, randomizer.int(1, 2));
        status.supporters = percentageModify(status.supporters, randomizer.int(1, 2));
        status.fame = percentageModify(status.fame, randomizer.int(0, 2));
    }

    payload.player.status.morale = randomizer.chance(70) ?
        percentageModify(payload.player.status.morale, -1 * randomizer.int(1, 10))
        : percentageModify(payload.player.status.morale, randomizer.int(1, 10));

    return {
        news: newsGenerator.generate(
            `${player.name} expressed some concerns about ${payload.playerName}`,
            `${player.name}, yesterday, during a press conference, expressed some concerns about\n` +
            `the current performance of ${bold(payload.playerName)} (${payload.team})${currentTeam === payload.team ? ', currently playing in his own team' : ''}.`,
            moment(status.date).format(DATE_FORMAT)
        )
    };
};