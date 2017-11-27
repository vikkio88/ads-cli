import moment from 'moment';
import {fixtureGenerator} from '../generator'
import {newsGenerator} from './news';
import {DATE_FORMAT} from '../../const/index';

const buildFixture = (status, context) => {
    const thisYear = moment().format('YYYY');
    const nextYear = moment().add(1, 'year').format('YYYY');
    const {teams} = context;
    const fixture = fixtureGenerator.generate(
        teams.list,
        moment(`02-08-${thisYear}`, DATE_FORMAT)
        //moment(`26-08-${thisYear}`, DATE_FORMAT)
    );

    context = {
        ...context,
        league: {
            name: `Serie A ${thisYear}-${nextYear}`,
            ...context.league,
            fixture
        }
    };

    const news = newsGenerator.generate(
        'New Season Calendar!',
        `Presented the new match calendar for ${context.league.name}`,
        moment(status.date).format(DATE_FORMAT)
    );

    return {status, context, news};

};

const marketClose = (status, context) => {
    status = {
        ...status,
        marketOpen: false
    };

    const news = newsGenerator.generate(
        'Transfer Market Closed!',
        'Transfer Market officially closed',
        moment(status.date).format(DATE_FORMAT)
    );

    return {status, context, news};
};


export const triggerDates = {
    '30-07': buildFixture,
    '01-09': marketClose,
};