import paymentActionTypes from "../actionTypes/payment.actiontypes"; 
var initialState = {
    chargeCard: {},
    chargeAtm: {},
}

var paymentReducer = (state = initialState, action) => {
    switch(action.type){
        case paymentActionTypes.CHARGE_CARD:{
            state.chargeCard = action.result.data
            return state;
        }
        default: {
            return state;
        }
    }
}

export default paymentReducer;