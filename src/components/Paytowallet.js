import React, { Component } from 'react'
import '../assets/css/paytowallet.css'
import PayBreadcrumb from './PayBreadcrumb'

export default class Paytowallet extends Component {
    render() {
        return (
            <div className="container paytowallet_container">
                <div className="row box">
                    <PayBreadcrumb></PayBreadcrumb>
                    <form method="POST" name="napgold" id="napgold" noValidate="novalidate">
                        <h2>Hành Tẩu Giang Hồ</h2>
                        <div className="qa-message-list" id="wallmessages">
                            <div className="message-item" id="accRole">
                                <div className="message-inner">
                                    <div className="message-head clearfix handle-acc-role">
                                        <div className="user-detail">
                                            <h5 className="handle">Tài khoản : xuanhieu001</h5>
                                            <h6 className="handle">Số dư : 0 <u>đ</u></h6>
                                            <input type="hidden" defaultValue={0} name="balance" />
                                            <input type="hidden" defaultValue={771866} name="id_user" id="id_user" />
                                            <input type="hidden" defaultValue={0} name="amount" id="amount" />
                                            <input type="hidden" defaultValue={0} name="gold_id" id="gold_id" />
                                            <input type="hidden" defaultValue name="theThang" id="theThang" />
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
                                                        <a role="button" data-toggle="collapse" href="#collapseOne" data-parent="#accordion"
                                                            aria-expanded="true" aria-controls="collapseOne" className="trigger collapsed">
                                                            Thẻ cào
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseOne" className="panel-collapse collapse" role="tabpanel"
                                                    aria-labelledby="headingOne" data-id="Thẻ cào">
                                                    <div className="panel-body">
                                                        <div className="tab-pane active" id="tab_card_pay">
                                                            <label htmlFor="in_type" className="col-sm-12 controll-label">
                                                                <span>Loại thẻ</span>
                                                                <select name="in_type" className="form-control valid" aria-invalid="false">
                                                                    <option value="HPC">HPCode</option>
                                                                    <option value="GATE">GATE</option>
                                                                    <option value="VTC">VCOIN</option>
                                                                </select>
                                                            </label>
                                                            <label htmlFor="in_serie" className="col-sm-12 controll-label"><span>Số
                                                                    serie</span><input type="text" name="in_serie" className="form-control"
                                                                    defaultValue /></label><label htmlFor="in_pin"
                                                                className="col-sm-12 controll-label"><span>Mã thẻ</span><input type="text"
                                                                    name="in_pin" className="form-control" defaultValue /></label>
                                                            <div className="btn btn-info" id="btnXacnhan" data-id="the-cao">Thanh toán</div>
                                                            <div className="clearfix" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id="headingTwo">
                                                    <h4 className="panel-title">
                                                        <a role="button" data-toggle="collapse" href="#collapseTwo" data-parent="#accordion"
                                                            aria-expanded="true" aria-controls="collapseTwo" className="trigger collapsed">
                                                            Thẻ ATM/Nội địa/NAPAS
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel"
                                                    aria-labelledby="headingTwo" data-id="Thẻ ATM/Nội địa/NAPAS">
                                                    <div className="panel-body">
                                                        <div id="tab_card_pay">
                                                            <label htmlFor="amount_pay" className="col-sm-12 controll-label"><span>Số tiền
                                                                    thanh toán (VNĐ)</span><select name="amount_pay"
                                                                    className="form-control">
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
                                                                </select></label>
                                                            <div className="btn btn-info" id="btnXacnhan" data-id="the-atm">Thanh toán</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="message-alert">NẠP HPCODE = 100% ; GATE = 100% ; VCOIN = 90% ; ATM = 100% (Thẻ HPCode có
                                        bán ở các cửa hàng của Payoo &amp; bán online tại Website Napthegame.net )</div>
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
                                        <div className="divserverList"><input type="hidden" name="agent" id="agent"
                                                defaultValue="m002" /><label htmlFor="server_group" className="col-sm-12 controll-label">
                                                Chọn cụm máy chủ:</label><select name="server_group" className="form-control "
                                                id="server_group">
                                                <option value>Chọn group server</option>
                                                <option value={1}>Cụm máy chủ 1 - 10</option>
                                                <option value={2}>Cụm máy chủ 11 - 20</option>
                                                <option value={3}>Cụm máy chủ 21 - 30</option>
                                                <option value={4}>Cụm máy chủ 31 - 40</option>
                                                <option value={5}>Cụm máy chủ 41 - 50</option>
                                                <option value={6}>Cụm máy chủ 51 - 60</option>
                                                <option value={7}>Cụm máy chủ 61 - 70</option>
                                                <option value={8}>Cụm máy chủ 71 - 80</option>
                                            </select><label htmlFor="server_list" className="col-sm-12 controll-label"> Chọn
                                                server:</label><select name="server_list" className="form-control " id="server_list"
                                                disabled>
                                                <option value>Chọn server</option>
                                            </select></div>
                                        <div id="appentHtml" />
                                        <div className="clearfix" />
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
                                            <div id="showcoingold" />
                                            <div id="showcoingift" />
                                        </div>
                                        <div className="clearfix" />
                                    </div>
                                </div>
                            </div>
                            <div id="myModal" className="modal">
                                <div className="modal-content clearfix">
                                    <h1>Xác nhận giao dịch</h1>
                                    <input type="submit" name="submit" id="submitbutton" className="col-sm-3 btn btn-primary"
                                        defaultValue="Thanh toán" />
                                    <div className="clearfix" />
                                    <span className="close btn-danger">Chấp nhận</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
