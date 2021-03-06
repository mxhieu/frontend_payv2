const apiConfig = {};

apiConfig.domain = 'https://18c21623.ngrok.io/';

apiConfig.endpoint = {
    login: 'passport/login',
    loginFb: 'passport/loginFB',
    loginGg: 'passport/loginGoogle',
    loginApple: 'passport/loginApple',
    getSlider: 'sliders/get-default-slider',
    getPosts: 'post/get-list',
    getDetailPost: 'post/get-detail/',
    getGame: 'game/get-list',
    getDetailGameToGame: 'server/list',
    chargeCard: 'paymentGame/charge-card',
    getRole: 'game/get-role',
    chargeAtm: 'paymentGame/charge-atm',
    getDetailGameToWallet: 'game/detail',
    paymentWalletChargeCard: 'paymentWallet/charge-card',
    paymentWalletChargeATM: 'paymentWallet/charge-atm',
    paymentWalletChargeATMSuccess: 'paymentWallet/success-charge-atm',
    getCardHistory: 'history/card',
    getPayToGameHistory: 'history/paytogame',
    payToGame: 'paymentWallet/pay-to-game'
};
apiConfig.jwtToken = 'ADFASVASVASCAS';
apiConfig.header = {
    contentJson: {
        "Content-Type": "application/json"
    },
};

export default apiConfig;