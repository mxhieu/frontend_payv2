import React, { Component } from 'react'
import { connect } from 'react-redux'
import "../assets/css/paytogame.css"
import gameActions from "../actions/games.actions"
import paymentActions from "../actions/payment.actions"
import Validate from "../utils/Validate";

class Paytogame extends Component {

    constructor(props){
        super(props)
        this.state = {
            username: JSON.parse(localStorage.getItem('user')).data.username,
            userRole: {},
            sltRoleId: '',
            sltServer: '',
            sltCardType: '',
            txtSerie: '',
            txtCardPin: '',
            sltAmount: '',
            gameInfo: {},
            errorsAtm: [],
            errorsCard: [],
            errorSelectServer: []
        }
    }

    componentDidMount(){
        let {match} = this.props
        this.props.getDetailGameToGame(match.params.id)
    }

    handlePayByCard = (e) =>{
        e.preventDefault();
        if(this.validatePayCard()){
            this.props.chargeCard(this.state)
        }
    }

    componentDidUpdate(previousProps, previousState){
        if(Object.keys(previousState.gameInfo).length === 0)
        {
            let gameData = previousProps.gamesReducer.data;
            for (var key in gameData) {
                if (gameData.hasOwnProperty(key)) {
                    if(gameData[key].slug === previousProps.match.params.slug)
                    {
                        this.setState({
                            gameInfo: gameData[key]
                        })
                    }
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        let userRole = nextProps.paymentReducer.userRole.data
        
        if(prevState.sltServer !== '' && userRole)
        {
            return {
                userRole: nextProps.paymentReducer.userRole,
                sltRoleId: prevState.sltRoleId!==''?prevState.sltRoleId:userRole.role[0].roleId
            }            
        }
        return {
            userRole: {},
            sltRoleId: ''
        }
    }

    handlePayByATM = (e) => {
        e.preventDefault();
        if(this.validatePayAtm()){
            this.props.chargeAtm(this.state);
        }
    }

    validatePayCard = () => {
        const { sltServer, sltCardType, txtSerie, txtCardPin } = this.state;
        let errorsCard = {
            sltServer: [],
            sltCardType: [],
            txtSerie: [],
            txtCardPin: [],
            sltAmount: []
        };
        let errorSelectServer = [];
        let isValid = true;
        if (Validate.isRequired( sltServer )) {
            errorSelectServer.push('Vui lòng chọn server');
            isValid = false;
        }
        if (Validate.isRequired( sltCardType )) {
            errorsCard.sltCardType.push('Vui lòng chọn loại thẻ');
            isValid = false;
        }
        if (Validate.isRequired( txtSerie )) {
            errorsCard.txtSerie.push('Loại thẻ bắt buộc nhập');
            isValid = false;
        }
        if (Validate.isRequired( txtCardPin )) {
            errorsCard.txtCardPin.push('Mã thẻ bắt buộc nhập');
            isValid = false;
        }
        this.setState({
            errorsCard: errorsCard,
            errorSelectServer: errorSelectServer
        })
        return isValid
    }

    validatePayAtm = () => {
        const { sltServer, sltAmount } = this.state;
        let errorsAtm = {
            sltServer: [],
            sltAmount: []
        };
        let errorSelectServer = [];
        let isValid = true;
        if (Validate.isRequired( sltServer )) {
            errorSelectServer.push('Vui lòng chọn server');
            isValid = false;
        }
        if (Validate.isRequired( sltAmount )) {
            errorsAtm.sltAmount.push('Vui lòng chọn mệnh giá');
            isValid = false;
        }
        this.setState({
            errorsAtm: errorsAtm,
            errorSelectServer: errorSelectServer
        })
        
        return isValid
    }

    hanleGetRole = (event) =>{
        const target = event.target;
        const serverId = target.value;
        if(serverId !== '')
        {
            this.props.getUserRole(serverId, JSON.parse(localStorage.getItem('user')).data.id, this.state.gameInfo.agent);
        }
        this.setState({
            sltServer: serverId
        })
    }

    handleChange = (event) =>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        let server = this.props.gamesReducer.detail;
        let serverElement = null;
        if(server.length > 0)
        {
            serverElement = server.map((val, index) => {
                return <option key={index} value={val.server_id}>{val.server_name}</option>
            })
        }
        let {errorsCard, errorsAtm, errorSelectServer, gameInfo, userRole} = this.state;
        let {paymentReducer} = this.props;
        return (
            <div className="container paytogame_container">
                <div className="row box">
                    <h2>{gameInfo.name}</h2>
                    <div className="hd-Form"> Bước 1: Chọn thông tin nhân vật (*)</div>
                    <label htmlFor="sltServer" className="col-sm-12 controll-label" id="list_server"> Chọn server:</label>
                    {errorSelectServer && (<span className="input-error">{errorSelectServer[0]}</span>)}
                    <select name="sltServer" value={this.state.sltServer} onChange={this.hanleGetRole} className="form-control " id="server_list">
                        <option value="">Chọn server</option>
                        {serverElement}
                    </select>
                    {
                        Object.keys(userRole).length > 0 ?
                        (<div>
                            <label htmlFor="sltRoleId" className="col-sm-12 controll-label"> Chọn nhân vật:</label>
                            <select name="sltRoleId" onChange={this.handleChange} className="form-control " id="userRole">
                            {userRole.data.role.map((val, index) => {
                                return <option key={index} value={val.roleId}>{val.roleName}</option>
                            })}
                            </select>
                        </div>)
                        :'Không tìm thấy nhân vật'
                    }
                    <div id="appentHtml" />
                    <div className="clearfix" /> <input type="hidden" name="id_user" id="id_user" />
                    <div className="hd-Form"> Bước 2: Chọn phương thức thanh toán (*)</div>
                    <div className="panel-group paytogame" id="accordion">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Nạp thẻ cào</a>
                                </h4>
                            </div>
                            <div id="collapse1" className="panel-collapse collapse in">
                                <form onSubmit={this.handlePayByCard}>
                                    <div className="panel-body">
                                        <label htmlFor="sltCardType" className="col-sm-12 controll-label">
                                            <span>Loại thẻ</span>
                                            {errorsCard.sltCardType && (<span className="input-error">{errorsCard.sltCardType[0]}</span>)}
                                            <select onBlur={this.validatePayCard} name="sltCardType" onChange={this.handleChange} className="form-control">
                                                <option value="">Chọn loại thẻ</option>
                                                <option value="HPC">HPCode</option>
                                                <option value="GATE">GATE</option>
                                            </select>
                                        </label>
                                        <label htmlFor="txtSerie" className="col-sm-12 controll-label">
                                            <span>Số serie</span>
                                            {errorsCard.txtSerie && (<span className="input-error">{errorsCard.txtSerie[0]}</span>)}
                                            <input onBlur={this.validatePayCard} type="text" name="txtSerie" className="form-control" onChange={this.handleChange} />
                                        </label>
                                        <label htmlFor="txtCardPin" className="col-sm-12 controll-label">
                                            <span>Mã thẻ</span>
                                            {errorsCard.txtCardPin && (<span className="input-error">{errorsCard.txtCardPin[0]}</span>)}
                                            <input onBlur={this.validatePayCard} type="text" name="txtCardPin" className="form-control" onChange={this.handleChange} />
                                        </label>
                                        <button disabled={this.props.isLoadingReducer.isLoading} id="submitCard" className="col-sm-3 btn btn-primary">{this.props.isLoadingReducer.isLoading?
                                        <div className={'dot-loader'}>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        :'thanh toán'}</button>
                                        {
                                        paymentReducer.chargeCard.status === 1 ?(<span className="message-success">
                                            {paymentReducer.chargeCard.messages}
                                        </span>):(<span className="message-alert">
                                            {paymentReducer.chargeCard.messages}
                                        </span>)
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Nạp thẻ ATM/iBanking</a>
                                </h4>
                            </div>
                            <div id="collapse2" className="panel-collapse collapse">
                                <form onSubmit={this.handlePayByATM}>
                                    <div className="panel-body">
                                        <label htmlFor="sltAmount" className="col-sm-12 controll-label">
                                            <span>Số tiền thanh toán (VNĐ)</span>
                                            {errorsAtm.sltAmount && (<span className="input-error">{errorsAtm.sltAmount[0]}</span>)}
                                            <select name="sltAmount" className="form-control" onChange={this.handleChange}>
                                                <option value="">Chọn số tiền</option>
                                                <option value={10000}>10,000</option>
                                                <option value={20000}>20,000</option>
                                                <option value={50000}>50,000</option>
                                                <option value={100000}>100,000</option>
                                                <option value={200000}>200,000</option>
                                                <option value={300000}>300,000</option>
                                                <option value={500000}>500,000</option>
                                                <option value={1000000}>1,000,000</option>
                                                <option value={2000000}>2,000,000</option>
                                            </select>
                                        </label>
                                        <button disabled={this.props.isLoadingReducer.isLoading} id="submitAtm" className="col-sm-3 btn btn-primary">{this.props.isLoadingReducer.isLoading?
                                        <div className={'dot-loader'}>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        :'thanh toán'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="message-alert">
                            NẠP HPCODE = 100% ; GATE = 100% ; VCOIN = 90% ; ATM = 100% (Thẻ HPCode có bán ở các cửa hàng của Payoo &amp; bán online tại Website Napthegame.net )
                        </div>
                    </div>
                    <div className="clearfix" />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    gamesReducer: state.gamesReducer,
    paymentReducer: state.paymentReducer,
    isLoadingReducer: state.isLoadingReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getDetailGameToGame: (productId) => {
            dispatch(gameActions.getDetailGameToGameRequest(productId))
        },
        chargeCard: (params) => {
            dispatch(paymentActions.chargeCardRequest(params))
        },
        chargeAtm: (params) => {
            dispatch(paymentActions.chargeAtmRequest(params))
        },
        getUserRole: ( serverId, userId, agent) => {
            dispatch(paymentActions.getUserRoleRequest(serverId, userId, agent))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Paytogame)