import React, {Component} from 'react'
import '../assets/css/paytowallet.css'

import * as _ from 'lodash';

import api from '../utils/Api';
import apiConfig from '../config/ApiConfig';
import commonConfig from '../config/CommonConfig';
import Validate from "../utils/Validate";

import PayBreadcrumb from './PayBreadcrumb'

export default class Paytowallet extends Component {

    /**
     * Constructor
     * @param props
     * @created 2020-03-18 LongTHK
     */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            balance: 0,
            game: {},
            cardsList: commonConfig.CardsList,
            atmValuesList: commonConfig.ATMValuesList,
            serverGroups: [],
            serversList: [],
            isDisableSelectServers: true,
            payItem: {},
            inLoadingPage: false,
            inProcessing: false,
            processingResult: {
                status: null,
                message: ''
            },
            errors: {},
            roleName: '',
            atmResponseMessage: ''
        }
    }

    /**
     * On component did mount event
     * @created 2020-03-18 LongTHk
     */
    componentDidMount() {
        // get md5
        let md5 = require('md5');
        // get username
        let username = JSON.parse(localStorage.getItem('user')).data.username;
        // get query string
        let queryString = require('query-string');

        // set inLoadingPage status
        this.setState({
            inLoadingPage: true
        });

        // call api get page content
        let slug = this.props.match.match.params.slug;
        let sign = md5(username + apiConfig.jwtToken);
        let endPoint = apiConfig.domain + apiConfig.endpoint.getDetailGameToWallet + '?slug=' + slug + '&username=' + username + '&sign=' + sign;
        api.call('GET', endPoint)
            .then((response) => {
                // get return data
                let data = response.data.data;
                // spit servers list into server groups
                let serverGroups = _.chunk(data.servers, 10);

                // set state
                this.setState({
                    username: username,
                    balance: data.balance,
                    game: Object.keys(data).length > 0 ? data.game[0] : null,
                    serverGroups: serverGroups
                });

                // call api check Charging ATM status
                let strParams = this.props.match.location.search;
                let params = queryString.parse(strParams);
                if (_.has(params, 'trans_id')) {
                    let endpointATMSuccess = apiConfig.domain + apiConfig.endpoint.paymentWalletChargeATMSuccess + strParams;
                    api.call('GET', endpointATMSuccess)
                        .then((response) => {

                            // set atm response message
                            this.setState({
                                atmResponseMessage: response.data.messages
                            });
                            // show modal
                            let modalATMReport = window.$('.modal-atm-report');
                            modalATMReport.modal('show');
                            modalATMReport.on('click', function () {
                                modalATMReport.modal('hide')
                            });
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                // set inLoadingPage status
                this.setState({
                    inLoadingPage: false
                });
            });
    }

    /**
     * Action on server group changee
     * @param event
     * @crated 2020-03018 LongTHK
     */
    changeServerGroup = (event) => {
        // get server group value
        let serverGroupValue = event.target.value;

        // load servers list base on group
        if (serverGroupValue !== '') {
            this.setState({
                serversList: this.state.serverGroups[serverGroupValue],
                isDisableSelectServers: false
            })
        } else {
            this.setState({
                isDisableSelectServers: true
            })
        }
    };

    /**
     * Handle changing input data
     * @param event
     * @created 2020-03-19 LongTHK
     */
    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(prevState => ({
            payItem: {
                ...prevState.payItem,
                [name]: value
            }
        }))
    };

    /**
     * Get role name
     * @param event
     */
    handleServerChanged = (event) => {
        // get md5
        let md5 = require('md5');

        // get params
        let userId = JSON.parse(localStorage.getItem('user')).data.id;
        let sign = md5(userId + apiConfig.jwtToken);

        // define endpoint
        let endPoint = apiConfig.domain + apiConfig.endpoint.getRole +
            '?server_id=' + event.target.value +
            '&id_user=' + userId +
            '&productAgent=' + this.state.game.agent +
            '&sign=' + sign;

        // call api
        api.call('GET', endPoint)
            .then((response) => {
                // get response data
                let responseData = response.data;

                if (responseData.status) {
                    this.setState({
                        roleName: responseData.data.role[0].roleName
                    })
                } else {
                    this.setState({
                        roleName: responseData.messages
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };

    /**
     * Change pay item
     * @param payType
     * @created 2020-03-19 LongTHK
     */
    changePayItem = (payType) => {
        switch (payType) {
            case 'card':
                this.setState({
                    payItem: {
                        cardType: '',
                        serie: '',
                        number: ''
                    }
                });
                break;
            case 'atm':
                this.setState({
                    payItem: {
                        amount: '',
                    }
                });
                break;
            default :
                this.setState({
                    payItem: {
                        cardType: '',
                        serie: '',
                        number: ''
                    }
                });
        }

        // push value to pay item
        this.setState(prevState => ({
            payItem: {
                ...prevState.payItem,
                username: this.state.username,
                productAgent: this.state.game.agent
            }
        }));

        // reset error
        this.setState({
            errors: {}
        });
    };

    /**
     * Pay by card
     * @created 2020-03-19 LongTHk
     */
    payByCard = async () => {
        // reset error
        this.setState({
            errors: {}
        });

        if (await this.validatePayByCard()) {
            // set inProcessing mode
            this.setState({
                inProcessing: true
            });
            // get md5
            const md5 = require('md5');
            // get pay item
            const payItem = this.state.payItem;

            // generate endpoint
            const endPoint = apiConfig.domain + apiConfig.endpoint.paymentWalletChargeCard +
                '?serial=' + payItem.serie +
                '&code=' + payItem.number +
                '&username=' + payItem.username +
                '&productAgent=' + payItem.productAgent +
                '&type=' + payItem.cardType +
                '&sign=' + md5(payItem.username + apiConfig.jwtToken);

            // call api
            api.call('GET', endPoint)
                .then((response) => {
                    // get response data
                    let responseData = response.data;

                    // set state
                    if (responseData.status) {
                        this.setState({
                            balance: responseData.data.balance,
                            processingResult: {
                                status: true,
                                message: responseData.messages
                            }
                        });
                    } else {
                        this.setState({
                            processingResult: {
                                status: false,
                                message: responseData.messages
                            }
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    // release inProcessing mode
                    this.setState({
                        inProcessing: false
                    });
                });
        }
    };

    /**
     * Pay by ATM
     * @created 2020-03-19 LongTHk
     */
    payByATM = async () => {
        // reset error
        this.setState({
            errors: {}
        });

        if (await this.validatePayByATM()) {
            // set inProcessing mode
            this.setState({
                inProcessing: true
            });
            // get md5
            const md5 = require('md5');
            // get pay item
            const payItem = this.state.payItem;

            // generate endpoint
            const endPoint = apiConfig.domain + apiConfig.endpoint.paymentWalletChargeATM +
                '?username=' + payItem.username +
                '&productAgent=' + payItem.productAgent +
                '&amount=' + payItem.amount +
                '&sign=' + md5(payItem.username + apiConfig.jwtToken);

            // call api
            api.call('GET', endPoint)
                .then((response) => {
                    window.location.href = response.data.data.link;
                })
                .catch((err) => {
                    // release inProcessing mode
                    this.setState({
                        inProcessing: false
                    });
                    console.log(err)
                });
        }
    };

    /**
     * Validate Pay by card input
     * @returns {Promise<boolean>}
     * @created 2020-03-19 LongTHK
     */
    validatePayByCard = async () => {
        // define valid status
        let isValid = true;
        // define errors
        let errors = {};

        // check card type
        if (Validate.isRequired(this.state.payItem.cardType)) {
            errors.cardType = 'Vui lòng chọn loại thẻ';
            isValid = false;
        }
        // check serie
        if (Validate.isRequired(this.state.payItem.serie)) {
            errors.serie = 'Vui lòng nhập số seri';
            isValid = false;
        }
        // check number
        if (Validate.isRequired(this.state.payItem.number)) {
            errors.number = 'Vui lòng nhập mã thẻ';
            isValid = false;
        }

        // set errors
        await this.setState({
            errors: errors
        });

        return isValid;
    };

    /**
     * Validate Pay by ATM input
     * @returns {Promise<boolean>}
     * @created 2020-03-19 LongTHk
     */
    validatePayByATM = async () => {
        // define valid status
        let isValid = true;
        // define errors
        let errors = {};

        // check amount
        if (Validate.isRequired(this.state.payItem.amount)) {
            errors.amount = 'Vui lòng chọn số tiền nạp';
            isValid = false;
        }

        // set errors
        await this.setState({
            errors: errors
        });

        return isValid;
    };

    /**
     * Render layout
     * @returns {*}
     * @created 2020-03-18 LongTHK
     */
    render() {
        /**
         * Loading page animation
         */
        if (this.state.inLoadingPage) {
            return (
                <div style={{textAlign: "center"}}>
                    <div className="lds-dual-ring"></div>
                </div>
            )
        }

        /**
         * Render in case game not found
         */
        if (this.state.game === null) {
            return (
                <div>
                    <h1 className='text-center'>Không tìm thấy game</h1>
                </div>
            )
        }

        /**
         * Page render
         */
        return (
            <div className="container paytowallet_container">
                <div className="row box">
                    <PayBreadcrumb></PayBreadcrumb>
                    <form method="POST" name="napgold" id="napgold" noValidate="novalidate">
                        <h2>{this.state.game.name}</h2>
                        <div className="qa-message-list" id="wallmessages">
                            <div className="message-item" id="accRole">
                                <div className="message-inner">
                                    <div className="message-head clearfix handle-acc-role">
                                        <div className="user-detail">
                                            <h5 className="handle">Tài khoản : {this.state.username}</h5>
                                            <h6 className="handle">Số dư : {this.state.balance} <u>đ</u></h6>
                                            <input type="hidden" defaultValue={0} name="balance"/>
                                            <input type="hidden" defaultValue={771866} name="id_user" id="id_user"/>
                                            <input type="hidden" defaultValue={0} name="amount" id="amount"/>
                                            <input type="hidden" defaultValue={0} name="gold_id" id="gold_id"/>
                                            <input type="hidden" defaultValue name="theThang" id="theThang"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="message-item" id="accType">
                                <div className="message-inner">
                                    <div className="message-head clearfix">
                                        <div className="user-detail">
                                            <h5 className="handle">Chọn phương thức để nạp tiền vào ví</h5>
                                        </div>
                                    </div>
                                    <div className="qa-message-content">
                                        <div className="collapse-group" id="accordion">
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingOne">
                                                    <h4 className="panel-title">
                                                        <a role="button" data-toggle="collapse" href="#collapseOne"
                                                           onClick={this.changePayItem.bind(window.event, 'card')}
                                                           data-parent="#accordion"
                                                           aria-expanded="true" aria-controls="collapseOne"
                                                           className="trigger collapsed">
                                                            Thẻ cào
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseOne" className="panel-collapse collapse"
                                                     role="tabpanel"
                                                     aria-labelledby="headingOne" data-id="Thẻ cào">
                                                    <div className="panel-body">
                                                        <div className="tab-pane active" id="tab_card_pay">
                                                            <label htmlFor="in_type"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Loại thẻ</span>
                                                                {
                                                                    this.state.errors.hasOwnProperty('cardType') &&
                                                                    <span
                                                                        className="input-error">{this.state.errors.cardType}</span>
                                                                }
                                                                <select name="cardType" className="form-control valid"
                                                                        aria-invalid="false"
                                                                        onChange={this.handleChange}
                                                                >
                                                                    <option value="">Chọn loại thẻ</option>
                                                                    {
                                                                        _.map(this.state.cardsList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.type}>{itemValue.name}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </label>
                                                            <label htmlFor="in_serie"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số serie</span>
                                                                {
                                                                    this.state.errors.hasOwnProperty('serie') &&
                                                                    <span
                                                                        className="input-error">{this.state.errors.serie}</span>
                                                                }
                                                                <input type="text" name="serie"
                                                                       className="form-control"
                                                                       onChange={this.handleChange}/>
                                                            </label>
                                                            <label htmlFor="in_pin"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Mã thẻ</span>
                                                                {
                                                                    this.state.errors.hasOwnProperty('number') &&
                                                                    <span
                                                                        className="input-error">{this.state.errors.number}</span>
                                                                }
                                                                <input type="text" name="number"
                                                                       className="form-control"
                                                                       onChange={this.handleChange}/>
                                                            </label>
                                                            <button className="btn btn-info" id="btnXacnhan"
                                                                    type={"button"}
                                                                    data-id="the-cao"
                                                                    onClick={this.payByCard}
                                                                    disabled={this.state.inProcessing}>
                                                                {
                                                                    !this.state.inProcessing &&
                                                                    <span>Thanh toán</span>
                                                                }
                                                                {
                                                                    this.state.inProcessing &&
                                                                    <div className={'dot-loader'}>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                    </div>
                                                                }
                                                            </button>
                                                            {
                                                                (
                                                                    this.state.processingResult.status !== null &&
                                                                    !this.state.processingResult.status &&
                                                                    <span
                                                                        className="message-alert">{this.state.processingResult.message}</span>
                                                                ) ||
                                                                (
                                                                    this.state.processingResult.status !== null &&
                                                                    this.state.processingResult.status &&
                                                                    <span
                                                                        className="message-success">{this.state.processingResult.message}</span>
                                                                )
                                                            }
                                                            <div className="clearfix"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingTwo">
                                                    <h4 className="panel-title">
                                                        <a role="button" data-toggle="collapse" href="#collapseTwo"
                                                           data-parent="#accordion"
                                                           onClick={this.changePayItem.bind(window.event, 'atm')}
                                                           aria-expanded="true" aria-controls="collapseTwo"
                                                           className="trigger collapsed">
                                                            Thẻ ATM/Nội địa/NAPAS
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseTwo" className="panel-collapse collapse"
                                                     role="tabpanel"
                                                     aria-labelledby="headingTwo" data-id="Thẻ ATM/Nội địa/NAPAS">
                                                    <div className="panel-body">
                                                        <div id="tab_card_pay">
                                                            <label htmlFor="amount_pay"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số tiền thanh toán (VNĐ)</span>
                                                                {
                                                                    this.state.errors.hasOwnProperty('amount') &&
                                                                    <span
                                                                        className="input-error">{this.state.errors.amount}</span>
                                                                }
                                                                <select name="amount" className="form-control"
                                                                        onChange={this.handleChange}>
                                                                    <option value="">Chọn số tiền</option>
                                                                    {
                                                                        _.map(this.state.atmValuesList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.value}>{itemValue.displayText}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </label>
                                                            <button className="btn btn-info" id="btnXacnhan"
                                                                    type={"button"} data-id="the-atm"
                                                                    onClick={this.payByATM}
                                                                    disabled={this.state.inProcessing}>
                                                                {
                                                                    !this.state.inProcessing &&
                                                                    <span>Thanh toán</span>
                                                                }
                                                                {
                                                                    this.state.inProcessing &&
                                                                    <div className={'dot-loader'}>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>
                                                                    </div>
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="message-alert">NẠP HPCODE = 100% ; GATE = 100% ; VCOIN = 90% ; ATM =
                                        100% (Thẻ HPCode có
                                        bán ở các cửa hàng của Payoo &amp; bán online tại Website Napthegame.net )
                                    </div>
                                </div>
                            </div>
                            <div className="message-item" id="accGetRole">
                                <div className="message-inner">
                                    <div className="message-head clearfix">
                                        <div className="user-detail">
                                            <h5 className="handle">Chọn server để nạp tiền vào game</h5>
                                        </div>
                                    </div>
                                    <div className="qa-message-content content_server">
                                        <div className="divserverList">
                                            <input type="hidden" name="agent" id="agent" defaultValue="m002"/>
                                            <label htmlFor="server_group" className="col-sm-12 controll-label">
                                                Chọn cụm máy chủ:
                                            </label>
                                            <select name="server_group" className="form-control "
                                                    id="server_group"
                                                    onChange={this.changeServerGroup}
                                            >
                                                <option value="">Chọn group server</option>
                                                {
                                                    _.map(this.state.serverGroups, (serverGroupValue, serverGroupIndex) =>
                                                        <option key={serverGroupIndex} value={serverGroupIndex}>
                                                            Cụm máy
                                                            chủ {serverGroupIndex * 10 + 1} - {serverGroupIndex * 10 + 10}
                                                        </option>
                                                    )
                                                }
                                            </select>
                                            <label htmlFor="server_list" className="col-sm-12 controll-label"
                                                   style={{width: 'auto'}}>
                                                Chọn server:
                                            </label>
                                            <select name="server_id" className="form-control "
                                                    id="server_list"
                                                    disabled={this.state.isDisableSelectServers}
                                                    onChange={this.handleServerChanged}
                                            >
                                                <option value="">Chọn server</option>
                                                {
                                                    _.map(this.state.serversList, (serverValue, serverIndex) =>
                                                        <option key={serverIndex} value={serverValue.server_id}>
                                                            {serverValue.server_name}
                                                        </option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div id="appentHtml">
                                            <div className="role-name">
                                                {this.state.roleName}
                                            </div>
                                        </div>
                                        <div className="clearfix"/>
                                    </div>
                                </div>
                            </div>
                            <div className="message-item" id="accRang">
                                <div className="message-inner">
                                    <div className="message-head clearfix">
                                        <div className="user-detail">
                                            <h5 className="handle">Chọn gói vật phẩm</h5>
                                            <p className="tab" id="coingold">Gói Nguyên Bảo</p>
                                            <p className="tab" id="coingift">Gói Quà Đặc Biệt</p>
                                        </div>
                                    </div>
                                    <div className="qa-message-content">
                                        <div className="form-group resultCoin">
                                            <div id="showcoingold"/>
                                            <div id="showcoingift"/>
                                        </div>
                                        <div className="clearfix"/>
                                    </div>
                                </div>
                            </div>
                            <div id="myModal" className="modal">
                                <div className="modal-content clearfix">
                                    <h1>Xác nhận giao dịch</h1>
                                    <input type="submit" name="submit" id="submitbutton"
                                           className="col-sm-3 btn btn-primary"
                                           defaultValue="Thanh toán"/>
                                    <div className="clearfix"/>
                                    <span className="close btn-danger">Chấp nhận</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal modal-atm-report fade" tabIndex="-1" role="dialog" data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className={"text-center"}>{this.state.atmResponseMessage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
