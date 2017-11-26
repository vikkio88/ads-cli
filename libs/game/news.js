import {generator} from "../generator/generator";

export const newsGenerator = {
    generate(title, message, date) {
        return {
            newspaper: generator.newspaper(),
            date,
            title,
            message,
            read: false
        }
    }
};