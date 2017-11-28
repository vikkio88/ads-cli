export const noOp = () => {
};
export const acceptContract = (state, payload) => {
    const {status} = state;
    status.hired = true;
    status.contract = payload.contract;
    status.currentTeam = payload.team;
};