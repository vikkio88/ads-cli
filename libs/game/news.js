export const newsGenerator = {
    generate(title, message, date) {
        return {
            newspaper: 'Sport News',
            date,
            title,
            message
        }
    }
};