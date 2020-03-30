import loginActionTypes from '../actionTypes/login.actiontypes'; 

let initialState = {
    isLogged : localStorage.getItem('user') ? true : false,
    data: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {"id": null,"username": null,"email": null,"fullname": null,"birthday": null,"sex": null,"identityNumber": null,"mobile": null,"address": null,"city": null,"company": null,"companyAddress": null,"createDate": null,"fastReg": null,"lastLogin": null,"identityDate": null,"identityPlace": null,"ip": null,"status": null},
    error: null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case loginActionTypes.LOGIN_RESQUEST: {
            return {
                ...state
            };
        }
        case loginActionTypes.LOGIN_SUCCESS:{
            localStorage.setItem("user", JSON.stringify(action.result.data));
            state.data = action.result.data;
            state.isLogged = true;
            return {
                ...state,
                error: null
            };
        }
        case loginActionTypes.LOGIN_FAILURE:{
            state.isLogged = false;
            state.error = action.result.data
            return {
                ...state
            };
        }
        case loginActionTypes.LOGOUT:{
            localStorage.removeItem("user");
            state.isLogged = false;
            return {
                ...state
            };
        }
        default: return {
            ...state
        }
    }

}

export default loginReducer;