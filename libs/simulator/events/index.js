import {randomizer} from '../../generator';

const events = {
    contractOffer: {
        probability: 1,
        happened(status){
            let prob = this.probability;
            if (status.team === null) {
                prob = 80;
            }
            return randomizer.chance(prob);
        },
        instance(status){

        }
    }
};

const eventPool = {
    getEvents(status){
        const events = [];
        Object.keys(events).forEach(event => {

        });
    }
};

//event
// probability(status)
// name,
// important,
// description
// news,
// emails,
// possibleActions:
//        yes:
//        no: