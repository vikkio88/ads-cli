import {generator} from "../generator/generator";

export const newsGenerator = {
    generate(title, message, date) {
        return {
            title,
            message,
            date,
            newspaper: generator.newspaper(),
            read: false
        }
    }
};