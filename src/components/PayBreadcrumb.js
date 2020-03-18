import React, { Component } from 'react'
import { NavLink } from "react-router-dom";

export default class PayBreadcrumb extends Component {
    render() {
        return (
            <div className="tab-Switch">
                <NavLink to="/payment/hanh-tau-giang-ho.html">Nạp thẻ</NavLink>
                <NavLink to="/lich-su/lich-su-vi.html">Lịch sử ví</NavLink>
                <NavLink to="/lich-su/lich-su-game.html">Lịch sử game</NavLink>
            </div>
        )
    }
}
