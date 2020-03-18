import loginActionTypes from '../actionTypes/login.actiontypes';
import Api from '.././utils/Api';
import ApiConfig from '../config/ApiConfig';

const loginAction = {};

loginAction.Login = (username, password) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.login + '?username='+ username + '&password=' + password;
    return async (dispatch) => {
        await Api.call('GET', endpoint ).then( result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
    }
}

loginAction.loginFacebookRequest = (accessToken) => {
    let endpoint = 'https://graph.facebook.com/me?fields=token_for_business&access_token='+accessToken;
    return async (dispatch) => {
        //Get bussiness token
        await Api.call('GET', endpoint ).then(res => {
            if(res.status === 200 && res.data.token_for_business)
            {
                dispatch(loginAction.loginFacebook(accessToken, res.data.token_for_business));
            }            
        })
        
    }
}

loginAction.loginFacebook = (bussinessToken) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.loginFb + "?tokenForBusiness="+ bussinessToken;
    return async (dispatch) => {
        //Get data form api
        await Api.call('GET', endpoint ).then(result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
    }
}

loginAction.loginGoogle = (email) => {
    let endpoint = ApiConfig.domain + ApiConfig.endpoint.loginGg + "?email="+ email;
    return async (dispatch) => {
        //Get data form api
        await Api.call('GET', endpoint ).then(result => {
            if(result.data.status === 1){
                dispatch(loginAction.success(result))
            }
            else{
                dispatch(loginAction.failure(result))
            }
        })
    }
}

loginAction.success = (result) => {
    return {
        type: loginActionTypes.LOGIN_SUCCESS,
        result
    };
}

loginAction.failure = (result) => {
    return {
        type: loginActionTypes.LOGIN_FAILURE,
        result
    };
}

loginAction.logout = () => {
    return {
        type: loginActionTypes.LOGOUT,
    };
}

export default loginAction;