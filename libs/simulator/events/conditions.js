import {offerContract, seasonOver} from "./events";

export default {
    noMoreGamesToPlay(today, status, context) {
        if (context.fixture && context.fixture.filter(r => !r.played).length === 0) {
            return seasonOver
        }
        return null;
    },
    unemployed(today, status, context) {
        if (!status.hired) {
            console.log("not hired");
            return offerContract
        }
        return null;
    }
}