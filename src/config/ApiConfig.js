const apiConfig = {};

apiConfig.domain = 'https://dev-api-v2.phoeniz.com/';

apiConfig.endpoint = {
    login: 'passport/login',
    loginFb: 'passport/loginFB',
    loginGg: 'passport/loginGoogle',

    getSlider: 'sliders/get-default-slider',
    getPosts: 'post/get-list',
    getDetailPost: 'post/get-detail/',
    getGame: 'game/get-list',
    getDetailGameToGame: 'server/list',
    getDetailGameToWallet: 'game/detail',
    paymentWalletChargeCard: 'paymentWallet/charge-card',
    paymentWalletChargeATM: 'paymentWallet/charge-atm'
};
apiConfig.jwtToken = 'ADFASVASVASCAS';
apiConfig.header = {
    contentJson: {
        "Content-Type": "application/json"
    },
};

export default apiConfig;