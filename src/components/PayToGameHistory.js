import React, { Component } from 'react'
import HistoryPayFilter from './HistoryPayFilter'
import PayBreadcrumb from './PayBreadcrumb'

export default class PayToGameHistory extends Component {
    render() {
        return (
            <div className="container paytogamehistory">
                <div className="row box">
                    <PayBreadcrumb></PayBreadcrumb>
                    <h3>Lịch sử nạp vào game</h3>
                    <HistoryPayFilter></HistoryPayFilter>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <td>Transaction ID</td>
                                <td>Mệnh giá</td>
                                <td>Giá trị duy đổi</td>
                                <td>Game</td>
                                <td>Server</td>
                                <td>Trạng thái nạp vào game</td>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
