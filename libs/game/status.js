import moment from 'moment';
import {DATE_FORMAT_GAP} from '../../const';

export const status = {
    player: null,
    hired: false,
    fame: 0,
    contract: null,
    jobStability: null,
    currentTeam: null,
    messages: [],
    news: [],
    //date: moment(`${moment().format('YYYY')}0601`, DATE_FORMAT_GAP),
    date: moment(`${moment().format('YYYY')}0729`, DATE_FORMAT_GAP),
    marketOpen: true,
    history: []
};

export const context = {
    teams: {
        hash: {},
        list: []
    },
    freeAgent: {
        coaches: [],
        players: []
    },
    league: {
        table: {},
        fixture: [],
        scorers: {}
    }
};