import moment from 'moment';
import { fixtureGenerator } from '../generator'
import { newsGenerator } from './news';
import { DATE_FORMAT } from '../../const/index';

const buildFixture = (status, context) => {
    const thisYear = moment().format('YYYY');
    const nextYear = moment().add(1, 'year').format('YYYY');
    const { teams } = context;
    const fixture = fixtureGenerator.generate(
        teams.list,
        moment(`29-08-${thisYear}`, DATE_FORMAT)
    );

    context = {
        ...context,
        league: {
            ...context.league,
            fixture
        }
    };

    newsOfToday = newsGenerator.generate(
        'New Season Calendar!',
        `Presented the new match calendar for season ${thisYear}-${nextYear}`,
        status.date.format(DATE_FORMAT)
    );
    status = {
        ...status,
        news: [...status.news, newsOfToday]
    };
    return { status, context };

};

const marketClose = (status, context) => {
    status = {
        ...status,
        marketOpen: false,
        news: [...status.news,
        newsGenerator.generate(
            'Transfer Market Closed!',
            'Transfer Market officially closed',
            status.date.format(DATE_FORMAT)
        )]
    };

    return { status, context };
};


export const triggerDates = {
    '30-07': buildFixture,
    '01-09': marketClose,
};