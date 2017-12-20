import {error, success} from "./cli";
import {actionsHelper, newsHelper} from "./utils";
import {resign} from "../simulator/actions";

export const actions = state => {
    const {status, context, entity} = state;
    switch (entity) {
        case 'news':
            newsHelper.pressConference({status, context});
            break;
        case 'resign':
            if (!status.hired) {
                console.log(error(`You can't resign, you are not working for anyone`));
                return;
            }
            actionsHelper.push(resign, {}, status);
            console.log(success("Resignation letter handed in"));
            break;
        default:
            console.log(error(`invalid action type ${type}`));
            break;
    }
};