import gameActionTypes from "../actionTypes/game.actiontypes"; 

var initialState = {
    data: {},
    detail: {},
    errors: null
};

var gameReducer = (state = initialState, action) => {
    switch(action.type){
        case gameActionTypes.GET_ALL_GAME:{
            state.data = action.result.data.data;
            return {...state};
        }
        case gameActionTypes.GET_DETAIL_GAME_TO_GAME:{
            state.detail = action.result.data.data;
            return {
                ...state
            };
        }
        default: {
            return {...state};
        }
    }
}

export default gameReducer;