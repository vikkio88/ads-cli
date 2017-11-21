import moment from 'moment';
import {day} from '../../libs/simulator';
import {DATE_FORMAT, TEAM_NUMBER} from '../../const';

describe('day simulator test', () => {
    const initialDay = moment(`10-06-${moment().format('YYYY')}`, DATE_FORMAT);
    const statusMock = {
        date: initialDay,
        team: null,
        trust: null,
        isMarketOpen: true,
        gamesLeft: ((TEAM_NUMBER - 1 ) * 2)
    };
    const events = {
        importantMessages: [],
        notifications: {
            mails: [],
            news: []
        }
    };
    const actions = [];

    test('given a status, and some actions, will return a modified status and some events', () => {
        const result = day.simulate(statusMock, actions, events);
        expect(result).toEqual({
            status: expect.objectContaining({
                date: initialDay.add(1, 'day'),
                team: null,
                trust: null,
                isMarketOpen: true,
                gamesLeft: ((TEAM_NUMBER - 1 ) * 2)
            }),
            events: expect.objectContaining({
                importantMessages: expect.any(Array),
                notifications: expect.objectContaining({
                    mails: expect.any(Array),
                    news: expect.any(Array),
                })
            })
        })
    });

    test('if player has no team, there is a chance that one will make an offer', () => {
        const result = day.simulate(statusMock, actions, events);
    });
});

describe('events test', () => {
    test('events contract offered', () => {

    })
});