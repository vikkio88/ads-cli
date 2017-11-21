import {randomizer} from '../../generator';
const actions = {
    acceptedContract(status, payload){
        return {
            ...status,
            trust: randomizer.int(50, 70),
            team: payload.team
        }
    },
    spokeWithJournalist(status){
        let trust = status.trust;
        const multiplier = randomizer.chance(50) ? -1 : 1;
        trust += (multiplier * randomizer.int(0, 20));
        return {
            ...status,
            trust
        }
    },
};