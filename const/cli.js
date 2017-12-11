export const CONFIRM_TYPE = 'confirm';
export const INPUT_TYPE = 'input';
export const LIST_TYPE = 'list';
export const RAWLIST_TYPE = 'rawlist';
export const EXPAND_TYPE = 'expand';

export const BANNER =
    `
*************************************************************

 █████╗ ██████╗ ███████╗               ██████╗██╗     ██╗
██╔══██╗██╔══██╗██╔════╝              ██╔════╝██║     ██║
███████║██║  ██║███████╗    █████╗    ██║     ██║     ██║
██╔══██║██║  ██║╚════██║    ╚════╝    ██║     ██║     ██║
██║  ██║██████╔╝███████║              ╚██████╗███████╗██║
╚═╝  ╚═╝╚═════╝ ╚══════╝               ╚═════╝╚══════╝╚═╝
                                                         
*************************************************************
Athletic Director Simulator - v 0.0.1

`;

export const TABLE_CHARS = {
    chars: {
        'top': '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        'bottom': '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        'left': '║',
        'left-mid': '╟',
        'mid': '─',
        'mid-mid': '┼',
        'right': '║',
        'right-mid': '╢',
        'middle': '│'
    }
};

export const BOXEN_DEFAULT_OPTIONS = {
    borderStyle: 'double-single',
    padding: 1
};

/*

Examples

questions = [
    {
        type: 'confirm',
        name: 'toBeDelivered',
        message: 'Is this for delivery?',
        default: false
    },
    {
        type: 'input',
        name: 'phone',
        message: "What's your phone number?",
        validate: function (value) {
            var pass = value.match(
                /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
            );
            if (pass) {
                return true;
            }

            return 'Please enter a valid phone number';
        }
    },
    {
        type: 'list',
        name: 'size',
        message: 'What size do you need?',
        choices: ['Large', 'Medium', 'Small'],
        filter: function (val) {
            return val.toLowerCase();
        }
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number
    },
    {
        type: 'expand',
        name: 'toppings',
        message: 'What about the toppings?',
        choices: [
            {
                key: 'p',
                name: 'Pepperoni and cheese',
                value: 'PepperoniCheese'
            },
            {
                key: 'a',
                name: 'All dressed',
                value: 'alldressed'
            },
            {
                key: 'w',
                name: 'Hawaiian',
                value: 'hawaiian'
            }
        ]
    },
    {
        type: 'rawlist',
        name: 'beverage',
        message: 'You also get a free 2L beverage',
        choices: ['Pepsi', '7up', 'Coke']
    },
    {
        type: 'input',
        name: 'comments',
        message: 'Any comments on your purchase experience?',
        default: 'Nope, all good!'
    },
    {
        type: 'list',
        name: 'prize',
        message: 'For leaving a comment, you get a freebie',
        choices: ['cake', 'fries'],
        when: function (answers) {
            return answers.comments !== 'Nope, all good!';
        }
    }
];

*/