import { combineReducers } from "redux";
import gamesReducer from "./game.reducer";
import sliderReducer from "./slider.reducer";
import loginReducer from "./login.reducer";
import postReducer from "./posts.reducer";

const appReducers = combineReducers({
    gamesReducer,
    sliderReducer,
    loginReducer,
    postReducer
});

export default appReducers;