import {offerContract, seasonOver} from "./events";

export default {
    noMoreGamesToPlay(state) {
        const {context} = state;
        if (context.fixture && context.fixture.filter(r => !r.played).length === 0) {
            return seasonOver;
        }
    },
    unemployed(state) {
        const {status} = state;
        if (!status.hired) {
            return offerContract;
        }
    }
}