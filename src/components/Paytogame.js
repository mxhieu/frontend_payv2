import React, { Component } from 'react'
import { connect } from 'react-redux'
import "../assets/css/paytogame.css"
import PayBreadcrumb from './PayBreadcrumb'
import gameActions from "../actions/games.actions"
import Validate from "../utils/Validate";

class Paytogame extends Component {

    constructor(props){
        super(props)
        this.state = {
            sltServer: '',
            sltCardType: '',
            txtSerie: '',
            txtCardPin: '',
            sltAmount: '',
            errors: []
        }
    }

    componentDidMount(){
        let {match} = this.props
        this.props.getDetailGameToGame(match.params.id)
    }

    handlePayByCard = (e) =>{
        e.preventDefault();
        if(this.validatePayCard()){
            alert("submitted")
        }
    }

    handlePayByATM = (e) => {
        e.preventDefault();
        if(this.validatePayAtm()){
            alert("submitted")
        }
    }

    validatePayCard = () => {
        const { sltServer, sltCardType, txtSerie, txtCardPin } = this.state;
        let errors = {
            sltServer: [],
            sltCardType: [],
            txtSerie: [],
            txtCardPin: [],
            sltAmount: []
        };
        let isValid = true;
        if (Validate.isRequired( sltServer )) {
            errors.sltServer.push('Vui lòng chọn server');
            isValid = false;
        }
        if (Validate.isRequired( sltCardType )) {
            errors.sltCardType.push('Vui lòng chọn loại thẻ');
            isValid = false;
        }
        if (Validate.isRequired( txtSerie )) {
            errors.txtSerie.push('Loại thẻ bắt buộc nhập');
            isValid = false;
        }
        if (Validate.isRequired( txtCardPin )) {
            errors.txtCardPin.push('Mã thẻ bắt buộc nhập');
            isValid = false;
        }
        this.setState({
            errors: errors
        })
        console.log(errors)
        return isValid
    }

    validatePayAtm = () => {
        const { sltServer, sltAmount } = this.state;
        let errors = {
            sltServer: [],
            sltAmount: []
        };
        let isValid = true;
        if (Validate.isRequired( sltServer )) {
            errors.sltServer.push('Vui lòng chọn server');
            isValid = false;
        }
        if (Validate.isRequired( sltAmount )) {
            errors.sltAmount.push('Vui lòng chọn mệnh giá');
            isValid = false;
        }
        this.setState({
            errors: errors
        })
        return isValid
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
        console.log(this.props)
        return (
            <div className="container paytogame_container">
                <div className="row box">
                    <PayBreadcrumb></PayBreadcrumb>
                    <h2>Thế Giới Cá</h2>
                    <div className="hd-Form"> Bước 1: Chọn thông tin nhân vật (*)</div>
                    <label htmlFor="sltServer" className="col-sm-12 controll-label" id="list_server"> Chọn server:</label>
                    <select name="sltServer" onChange={this.handleChange} className="form-control " id="server_list">
                        <option value>Chọn server</option>
                        <option value="TGC">TGC</option>
                    </select>
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
                                            <select name="sltCardType" onChange={this.handleChange} className="form-control">
                                                <option value="">Chọn loại thẻ</option>
                                                <option value="HPC">HPCode</option>
                                                <option value="GATE">GATE</option>
                                            </select>
                                        </label>
                                        <label htmlFor="txtSerie" className="col-sm-12 controll-label">
                                            <span>Số serie</span>
                                            <input type="text" name="txtSerie" className="form-control" onChange={this.handleChange} />
                                        </label>
                                        <label htmlFor="txtCardPin" className="col-sm-12 controll-label">
                                            <span>Mã thẻ</span>
                                            <input type="text" name="txtCardPin" className="form-control" onChange={this.handleChange} />
                                        </label>
                                        <button id="submitCard" className="col-sm-3 btn btn-primary">Thanh toán</button>
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
                                        <label htmlFor="sltAmount" className="col-sm-12 controll-label"><span>Số tiền thanh toán (VNĐ)</span>
                                            <select name="sltAmount" className="form-control">
                                                <option>Chọn số tiền</option>
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
                                        <button id="submitAtm" className="col-sm-3 btn btn-primary">Thanh toán</button>
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
    gamesReducer: state.gamesReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getDetailGameToGame: (productId) => {
            dispatch(gameActions.getDetailGameToGameRequest(productId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Paytogame)