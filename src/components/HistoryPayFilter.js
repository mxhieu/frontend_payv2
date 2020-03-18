import React, { Component } from 'react'

export default class HistoryPayFilter extends Component {
    render() {
        return (
            <form method="POST" name="cardhistory" id="cardhistory">
                <div className="box-row"><label htmlFor="config-form" className="col-sm-2 controll-label">Product:</label><select name="in_product_id" className="form-control" id="config-form">
                    <option value>All</option>
                    <option value="m001">Legacy of Discord</option>
                    <option value="h001">Phong Vân H5</option>
                    <option value="m002">Hành Tẩu Giang Hồ</option>
                    <option value="m003">Tiên Ma Truyền Kỳ</option>
                    <option value="HK004">Tân Tam Quốc Chí</option>
                    <option value="m005">Thế Giới Cá</option>
                </select></div>
                <div className="box-row"><label htmlFor="config-demo" className="controll-label col-sm-2">Time:</label><input type="text" name="in_time" className="form-control col-sm-2" id="config-demo" autoComplete="off" defaultValue /></div>
                <button id="submitbutton" className="col-sm-2 btn btn-primary">Search</button>
            </form>
        )
    }
}
