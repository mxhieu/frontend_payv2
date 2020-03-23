const CommonConfig = {};

CommonConfig.assetDomain = 'http://dev-assets.phoeniz.com';
CommonConfig.linkChangePassword = 'https://id.100d.mobi/';
CommonConfig.linkAccountInfo = 'https://id.100d.mobi/';

/**
 * Cards list
 * @type {{"4": {name: string, type: string}, "6": {name: string, type: string}, "7": {name: string, type: string}}}
 */
CommonConfig.CardsList = {
    '6': {
        type: 'HPC',
        name: 'HPCode'
    },
    '7': {
        type: 'GATE',
        name: 'GATE'
    },
    '4': {
        type: 'VTC',
        name: 'VTCVcoin'
    }
};

/**
 * ATM values list
 * @type {{}[]}
 */
CommonConfig.ATMValuesList = [
    {
        value: 10000,
        displayText: '10.000'
    },
    {
        value: 20000,
        displayText: '20.000'
    },
    {
        value: 50000,
        displayText: '50.000'
    },
    {
        value: 100000,
        displayText: '100.000'
    },
    {
        value: 200000,
        displayText: '200.000'
    },
    {
        value: 300000,
        displayText: '300.000'
    },
    {
        value: 500000,
        displayText: '500.000'
    },
    {
        value: 1000000,
        displayText: '1.000.000'
    },
    {
        value: 2000000,
        displayText: '2.000.000'
    }
];

export default CommonConfig;