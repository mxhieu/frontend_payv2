import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="clearfix"></div>
                <hr></hr>
                <div className="container-fuild footer text-center">
                    <p className="text-muted credit" style={{padding: '1em'}}>Đơn vị chủ quản: Công Ty TNHH Dịch Vụ Giải Trí Phượng Hoàng</p>
                </div>
            </React.Fragment>
        )
    }
}
