import React, { Component } from 'react'
import HistoryPayFilter from './HistoryPayFilter'
import PayBreadcrumb from './PayBreadcrumb'

export default class PayToWalletHistory extends Component {
    render() {
        return (
            <div className="container paytogamehistory">
                <div className="row box">
                    <PayBreadcrumb></PayBreadcrumb>
                    <h3>Lịch sử ví</h3>
                    <HistoryPayFilter></HistoryPayFilter>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Transaction ID</td>
                                <td>Game</td>
                                <td>Loại thẻ</td>
                                <td>Mệnh giá</td>
                                <td>Giá trị duy đổi</td>
                                <td>Mã lỗi</td>
                                <td>Thông báo</td>
                                <td>Ngày thực hiện</td>
                            </tr>
                            <tr>
                                <td>Không có dữ liệu</td>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
