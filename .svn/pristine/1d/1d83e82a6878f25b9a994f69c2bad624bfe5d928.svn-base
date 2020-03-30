import React, { Component } from 'react'
import ReactAppleLogin from 'react-apple-login'
import SocialConfig from "../config/SocialConfig"

class AppleLogin extends Component {

    componentDidMount() {
        
    }

    onHandleClick = (e) => {

    }

    render() {
        return (
            <ReactAppleLogin clientId={SocialConfig.apple.client_id} redirectURI={SocialConfig.apple.redirect_url}
            responseType={"code"} 
            responseMode={"query"}
            designProp={
                {
                   height: 50,
                   width: 255,
                   color: "black",
                   border: false,
                   type: "sign-in",
                   border_radius: 10,
                   scale: 1,
                   locale: "vi_VI", 
                }
            }
         
            />
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