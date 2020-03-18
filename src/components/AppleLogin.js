import React, { Component } from 'react'
import ReactAppleLogin from 'react-apple-login'

class AppleLogin extends Component {

    componentDidMount() {
        
    }

    onHandleClick = (e) => {

    }

    render() {
        return (
            <ReactAppleLogin clientId="v2signin.100d.mobi" redirectURI="https://localhost:3000/login" />
        )
            // <a href="/#" onClick={this.onHandleClick}>
            //     <div className="row-login" id="btnApple">
            //         <i className="fa fa-apple" aria-hidden="true" />
            //         <p>Đăng nhập bằng AppleID</p>
            //     </div>
            // </a>
    }
}

export default AppleLogin;