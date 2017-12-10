import {generator} from "../generator/generator";
import {speakBadAboutPlayer, speakBadAboutTeam, speakGoodAboutPlayer, speakGoodAboutTeam} from "../simulator/actions";
import {bold} from "./cli";
import {actionsHelper, ask} from "./utils";

export const newsGenerator = {
    generate(title, message, date) {
        return {
            title,
            message,
            date,
            newspaper: generator.newspaper(),
            read: false
        }
    }
};

export const PRESS_CONFERENCE_TYPES = [
    'My Team',
    'One of my Players',
    /*'Another Team',
    `Another Teams's Player`*/
];

export const PRESS_CONFERENCES = [
    state => {
        const {status} = state;
        const payload = {team: status.currentTeam};
        console.log(
            `${bold('Journalist')} : Hello mr ${status.player.name}, what do you want to say about ${payload.team}?`
        );
        const selection = ask.selectFromList('Select an option', ['Say good things', 'Say bad things']);
        let action = null;
        if (selection === 0) {
            action = speakGoodAboutTeam;
        } else if (selection === 1) {
            action = speakBadAboutTeam;
        }

        if (action) {
            actionsHelper.push(action, payload, status);
        }
        console.log(
            `${bold('Journalist')} : Ok, thanks for your time mr ${status.player.name}`
        );
    },
    state => {
        const {status, context} = state;
        const playerIndex = ask.selectFromList('Which one of your players?', context.teams.hash[status.currentTeam].roster, p => `${p.name} ${p.surname}`);
        const player = context.teams.hash[status.currentTeam].roster[playerIndex];
        const playerName = `${player.name} ${player.surname}`;
        const payload = {team: status.currentTeam, player, playerName};
        console.log(
            `${bold('Journalist')} : Hello mr ${status.player.name}, what do you want to say about ${payload.playerName}?`
        );
        const selection = ask.selectFromList('Select an option', ['Say good things', 'Say bad things']);
        let action = null;
        if (selection === 0) {
            action = speakGoodAboutPlayer;
        } else if (selection === 1) {
            action = speakBadAboutPlayer;
        }

        if (action) {
            actionsHelper.push(action, payload, status);
        }
        console.log(
            `${bold('Journalist')} : Ok, thanks for your time mr ${status.player.name}`
        );
    },
    /*
    state => {
        return speakGoodAboutTeam;
        return speakBadAboutTeam;
    },
    state => {
        return speakBadAboutPlayer;
        return speakBadAboutPlayer;
    },
*/
];