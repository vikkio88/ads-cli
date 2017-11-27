import {newsGenerator} from "../../game/news";
import {DATE_FORMAT} from "../../../const";

export const seasonOver = (today, status, context) => {
    const {name, table, scorers} = context.league;
    status.history.push({name, table, scorers});
    const news = [
        newsGenerator.generate('Season finished, winner announced!', 'Season finished the winner has been announced', today.format(DATE_FORMAT)),
        newsGenerator.generate('Transfer Market Opened!', 'Transfer Market has reopened', today.format(DATE_FORMAT))
    ];
    status.marketOpen = true;
    return {news};
};

export const offerContract = (today, status, context) => {
    const messages = {message: "Ciao"};
    return {messages};
};