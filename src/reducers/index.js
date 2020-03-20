import { combineReducers } from "redux";
import gamesReducer from "./game.reducer";
import sliderReducer from "./slider.reducer";
import loginReducer from "./login.reducer";
import postReducer from "./posts.reducer";
import paymentReducer from "./payment.reducer";

const appReducers = combineReducers({
    gamesReducer,
    sliderReducer,
    loginReducer,
    postReducer,
    paymentReducer
});

export default appReducers;