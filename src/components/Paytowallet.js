import React, {Component} from 'react'
import '../assets/css/paytowallet.css'

import * as _ from 'lodash';

import api from '../utils/Api';
import apiConfig from '../config/ApiConfig';
import commonConfig from '../config/CommonConfig';

import PayBreadcrumb from './PayBreadcrumb'

import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import CheckButton from 'react-validation/build/button';
import {required, minLength, maxLength} from "../utils/validateInput";

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
            goldsList: [],
            isDisableSelectServers: true,
            payItem: {},
            inLoadingPage: false,
            inProcessing: false,
            processingResult: {
                status: null,
                message: ''
            },
            errors: {},
            chargeGameItem: {},
            chargeGameResult: {},
            rolesList: null,
            modalContent: ''
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
                    serverGroups: serverGroups,
                    goldsList: data.golds
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
                                modalContent: response.data.messages
                            });

                            // create modal
                            let modal = window.$('.modal-notification');
                            // modal close action
                            modal.on('click', function () {
                                modal.modal('hide')
                            });

                            // show modal
                            modal.modal('show');
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
        let serverId = event.target.value;

        // define endpoint
        let endPoint = apiConfig.domain + apiConfig.endpoint.getRole +
            '?server_id=' + serverId +
            '&id_user=' + userId +
            '&productAgent=' + this.state.game.agent +
            '&sign=' + sign;

        // call api
        api.call('GET', endPoint)
            .then((response) => {
                // get response data
                let responseData = response.data;

                // set roles list
                if (responseData.status) {
                    // get roles list
                    let rolesList = responseData.data.role;

                    // set roles list
                    this.setState({
                        rolesList: rolesList
                    });

                    // set charge game item
                    this.setState({
                        chargeGameItem: {
                            serverId: serverId,
                            roleId: rolesList[0].roleId
                        }
                    });
                } else {
                    // clear roles list
                    this.setState({
                        rolesList: []
                    });

                    // clear charge game item
                    this.setState({
                        chargeGameItem: {}
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            });
    };

    /**
     * Open charge game modal
     * @param event
     * @returns {Promise<void>}
     */
    openModal = (event) => {
        // get gold id
        let goldId = window.$(event.target).data('gold-id');

        if (window.$(event.target).data('amount') > this.state.balance) {
            // set state
            this.setState({
                modalContent: 'Không đủ số dư trong tài khoản, hãy chọn mệnh giá thấp hơn hoặc nạp thêm tiền vào ví để tiếp tục giao dịch'
            });
            // create modal
            let modal = window.$('.modal-notification');
            // modal close action
            modal.on('click', function () {
                modal.modal('hide')
            });

            // show modal
            modal.modal('show');
        } else {
            // get gold id
            this.setState(prevState => ({
                chargeGameItem: {
                    ...prevState.chargeGameItem,
                    goldId: goldId
                }
            }));

            // create modal
            let modal = window.$('.modal-confirm');
            // modal close action
            modal.on('hidden.bs.modal', function () {
                this.setState({
                    chargeGameResult: {}
                })
            }.bind(this));

            // show modal
            modal.modal('show');
        }
    };

    /**
     * Action on change role
     * @param event
     */
    changeRoleId = (event) => {
        this.setState(prevState => ({
            chargeGameItem: {
                ...prevState,
                roleId: event.target.value
            }
        }))
    };

    /**
     * Charge game
     * @param event
     */
    chargeGame = (event) => {
        // stop propagation
        event.stopPropagation();

        // get md5
        let md5 = require('md5');

        // create end point
        let endPoint = apiConfig.domain + apiConfig.endpoint.payToGame +
            '?roleId=' + this.state.chargeGameItem.roleId +
            '&goldId=' + this.state.chargeGameItem.goldId +
            '&username=' + this.state.username +
            '&productAgent=' + this.state.game.agent +
            '&serverId=' + this.state.chargeGameItem.serverId +
            '&sign=' + md5(this.state.username + apiConfig.jwtToken);

        // call api
        api.call('GET', endPoint)
            .then((response) => {
                // get response data
                let responseData = response.data;

                // set state
                this.setState({
                    chargeGameResult: {
                        status: responseData.status,
                        message: responseData.messages
                    }
                });
            })
            .catch((err) => {
                console.log('err');
            })
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
        this.formCardPay.validateAll();
        if ( this.checkBtn1.context._errors.length === 0) {
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
        this.formAtmPay.validateAll();
        if (this.checkBtn2.context._errors.length === 0) {
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
     * Render layout
     * @returns {*}
     * @created 2020-03-18 LongTHK
     */
    render() {
        /**
         * Render in case game not found
         */
        if (Object.keys(this.state.game).length === 0 || this.state.game === undefined) {
            return (<div style={{textAlign: "center"}}>
                        <div className="lds-dual-ring"></div>
                    </div>)
        }

        /**
         * Page render
         */
        return (
            
            <div className="container paytowallet_container">
                <div className="row box">
                    <PayBreadcrumb match={this.props.match.match}></PayBreadcrumb>
                        <h2>{this.state.game.name}</h2>
                        <div className="qa-message-list" id="wallmessages">
                            <div className="message-item" id="accRole">
                                <div className="message-inner">
                                    <div className="message-head clearfix handle-acc-role">
                                        <div className="user-detail">
                                            <h5 className="handle">Tài khoản : {this.state.username}</h5>
                                            <h6 className="handle">Số dư : {this.state.balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</h6>
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
                                                    <Form ref={c => { this.formCardPay = c }}>
                                                    <div className="panel-body">
                                                        <div className="tab-pane active" id="tab_card_pay">
                                                            <label htmlFor="in_type"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Loại thẻ</span>
                                                                <Select name='sltCardType' onChange={this.handleChange} className="form-control" validations={[required]}>
                                                                    <option value="">Chọn loại thẻ</option>
                                                                    {
                                                                        _.map(this.state.cardsList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.type}>{itemValue.name}</option>
                                                                        )
                                                                    }
                                                                </Select>
                                                            </label>
                                                            <label htmlFor="in_serie"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số serie</span>
                                                                <Input 
                                                                    name="serie" 
                                                                    onChange={this.handleChange}
                                                                    type="text" 
                                                                    placeholder=""
                                                                    className="form-control" 
                                                                    validations={[required, minLength, maxLength]}
                                                                />
                                                            </label>
                                                            <label htmlFor="in_pin"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Mã thẻ</span>
                                                                <Input 
                                                                    name="number" 
                                                                    onChange={this.handleChange}
                                                                    type="text" 
                                                                    placeholder=""
                                                                    className="form-control" 
                                                                    validations={[required, minLength, maxLength]}
                                                                />
                                                            </label>
                                                            <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn1 = c }} />
                                                            <button className="btn btn-info" id="btnCardPay"
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
                                                    </Form>
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
                                                    <Form ref={c => { this.formAtmPay = c }}>
                                                    <div className="panel-body">
                                                        <div id="tab_card_pay">
                                                            <label htmlFor="amount_pay"
                                                                   className="col-sm-12 controll-label">
                                                                <span>Số tiền thanh toán (VNĐ)</span>
                                                                <Select name='amount' onChange={this.handleChange} className="form-control" validations={[required]}>
                                                                    <option value="">Chọn số tiền</option>
                                                                    {
                                                                        _.map(this.state.atmValuesList, (itemValue, itemIndex) =>
                                                                            <option key={itemIndex}
                                                                                    value={itemValue.value}>{itemValue.displayText}</option>
                                                                        )
                                                                    }
                                                                </Select>
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
                                                            <CheckButton style={{ display: 'none' }} ref={c => { this.checkBtn2 = c }} />
                                                        </div>
                                                    </div>
                                                    </Form>
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
                                            <label htmlFor="server_list"
                                                   className="col-sm-12 controll-label"
                                                   style={{width: 'auto'}}>&nbsp;
                                            </label>
                                            {
                                                this.state.rolesList !== null &&
                                                this.state.rolesList.length > 0 &&
                                                <div>
                                                    <select name="rolesList" className="form-control "
                                                            id="server_list" onChange={this.changeRoleId}>
                                                        {
                                                            _.map(this.state.rolesList, (roleValue, roleIndex) =>
                                                                <option key={roleIndex}
                                                                        value={roleValue.roleId}>{roleValue.roleName}</option>
                                                            )
                                                        }
                                                    </select>
                                                </div>
                                            }
                                            {
                                                this.state.rolesList !== null &&
                                                this.state.rolesList.length === 0 &&
                                                <div className="role-name">
                                                    Không tìm thấy nhân vật game
                                                </div>
                                            }
                                        </div>
                                        <div className="clearfix"/>
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.rolesList !== null &&
                                this.state.rolesList.length > 0 &&
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
                                                <div id="showcoingold">
                                                    {
                                                        _.map(this.state.goldsList, (goldItemValue, goldItemIndex) =>
                                                            <div className="gold-item" key={goldItemIndex}>
                                                                <img
                                                                    src={commonConfig.assetDomain + goldItemValue.image}
                                                                    data-amount={goldItemValue.amount}
                                                                    data-gold-id={goldItemValue.id}
                                                                    onClick={this.openModal}
                                                                    alt={goldItemValue.amount}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div id="showcoingift"/>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                    </div>
                                </div>
                            }
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
                </div>

                <div className="modal modal-notification fade" tabIndex="-1" role="dialog" data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p className={"text-center"}>{this.state.modalContent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal modal-confirm fade" tabIndex="-1" role="dialog" data-backdrop="false">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            {
                                Object.keys(this.state.chargeGameItem).length > 0 &&
                                <div className="modal-body">
                                    <p>
                                        <b>Server:</b>&nbsp;
                                        {
                                            this.state.serversList[_.findIndex(this.state.serversList, function (item) {
                                                return item.server_id === this.state.chargeGameItem.serverId
                                            }.bind(this))].server_name
                                        }
                                    </p>
                                    {
                                        this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                        <p>
                                            <b>Gói nạp:</b>&nbsp;
                                            {
                                                this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                    return item.id === this.state.chargeGameItem.goldId
                                                }.bind(this))].gold
                                            }
                                        </p>
                                    }
                                    <p>
                                        <b>Số dư hiện tại:</b>&nbsp;{ this.state.balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) }
                                    </p>
                                    {
                                        this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                        <p>
                                            <b>Số tiền cần thành toán:</b>&nbsp;
                                            {
                                                this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                    return item.id === this.state.chargeGameItem.goldId
                                                }.bind(this))].amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                                            }
                                        </p>
                                    }
                                    {
                                        this.state.chargeGameItem.hasOwnProperty('goldId') &&
                                        <p>
                                            <b>Số dư còn lại:</b>&nbsp;
                                            {
                                                (this.state.balance - this.state.goldsList[_.findIndex(this.state.goldsList, function (item) {
                                                    return item.id === this.state.chargeGameItem.goldId
                                                }.bind(this))].amount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
                                            }
                                        </p>
                                    }
                                </div>
                            }
                            <div className="modal-footer">
                                <div
                                    className={(this.state.chargeGameResult.status !== 0) ? 'text-center text-success' : 'text-center text-danger'}>
                                    {this.state.chargeGameResult.message}
                                </div>
                                <button type={"button"} className="btn btn-primary" onClick={this.chargeGame}>Nạp vào
                                    game
                                </button>
                                <button type={"button"} className="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        )
    }
}
