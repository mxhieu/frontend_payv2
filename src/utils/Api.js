import axios from 'axios';
import ApiConfig from '../config/ApiConfig';

// define util of api
const Api = {};

Api.call = (method ,url, body= {} , header = `${ApiConfig.header.contentJson}`) => {
    return axios({
                method: method,
                url: url,
                data: body,
                header: header
            })
};

export default Api;