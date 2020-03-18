import React from 'react'
import Homepage from './pages/homepage/Homepage';
import Loginpage from './pages/login/Loginpage';
import Detailpage from './pages/detailpage/Detailpage';
import PayToGamePage from './pages/paymentpage/PayToGamePage';
import PayToWalletPage from './pages/paymentpage/PayToWalletPage';
import HistoryPayToGamePage from './pages/paymentpage/HistoryPayToGamePage';
import HistoryPayToWalletPage from './pages/paymentpage/HistoryPayToWalletPage';
import Test from './pages/Test';
const Routes = [
    {
        path: "/login",
        exact: true,
        main: () => <Loginpage />,
    },
    {
        path: "/",
        exact: true,
        main: () => <Homepage />,
    },
    {
        path: "/post-detail/:slug",
        exact: false,
        main: ({match, history}) => <Detailpage match={match} history={history} />,
    },
    {
        path: "/nap-game/:slug-g:id",
        exact: false,
        main: ({match}) => <PayToGamePage match={match} />,
        isLogged: true
    },
    {
        path: "/nap-vi/:slug-g:id",
        exact: false,
        main: (match) => <PayToWalletPage match={match} />,
        isLogged: true
    },
    {
        path: "/lich-su/lich-su-game.html",
        exact: true,
        main: () => <HistoryPayToGamePage />,
        isLogged: true
    },
    {
        path: "/lich-su/lich-su-vi.html",
        exact: true,
        main: () => <HistoryPayToWalletPage />,
        isLogged: true
    },
    {
        path: "/test",
        exact: true,
        main: () => <Test />,
    },
]

export default Routes