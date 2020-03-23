import React, { Component } from 'react'
import { Link, Redirect} from "react-router-dom";
import "../assets/css/login.css";
import Validate from './../utils/Validate';
import { connect } from "react-redux";  
import loginAction from '../actions/login.actions';
import FacebookLogin from "./FacebookLogin";
import GoogleLogin from "./GoogleLogin";
// import AppleLogin from "./AppleLogin";

class Login extends Component {

    constructor(props){
        super(props)
        this.state = {
            username: '', 
            password: '',
            errors: []
        }
    }

    componentDidMount(){
        
    }

    handleChange = (event) =>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (e) =>{
        e.preventDefault();
        if(this.handleValidate())
        {
            this.props.userlogin(this.state.username, this.state.password);
        }
    }

    handleValidate = () => {
        const { username, password } = this.state;
        let errors = {
            username: [],
            password: []
        };
        let isValid = true;
        if (Validate.isRequired( username )) {
            errors.username.push('Tài khoản bắt buộc nhập');
            isValid = false;
        }
        if (Validate.maxLength( username, 255 )) {
            errors.username.push('Tài khoản tối đa 255 ký tự');
            isValid = false;
        }
        if (Validate.minLength( username, 5)) {
            errors.username.push('Tài khoản tối thiểu 5 ký tự');
            isValid = false;
        }
        if (Validate.isRequired( password )) {
            errors.password.push('Mật khẩu bắt buộc nhập');
            isValid = false;
        }
        if (Validate.maxLength( password, 255 )) {
            errors.username.push('Mật khẩu tối đa 255 ký tự');
            isValid = false;
        }
        if (Validate.minLength( password, 5)) {
            errors.username.push('Mật khẩu tối thiểu 5 ký tự');
            isValid = false;
        }
        this.setState({
            errors: errors
        })
        return isValid;
    }

    render() {
        let { errors } = this.state;
        let { login } = this.props;
        if (login.isLogged) {
            return <Redirect to="/" />;
        }
        return (
            <div className="container login_container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Đăng nhập</li>
                    </ol>
                </nav>
                <div className="col-md-4 box-left">
                    <h4>Đăng nhập bằng tài khoản khác</h4>
                    <FacebookLogin></FacebookLogin>
                    <GoogleLogin></GoogleLogin>
                    {/* <AppleLogin></AppleLogin> */}
                </div>
                <div className="col-md-8 box-right">
                    <h4>Đăng nhập bằng 100D ID</h4>
                    <form method="POST" name="user" id="user" noValidate="novalidate" onSubmit={this.handleSubmit}>
                        <label htmlFor="username" className="col-sm-12 controll-label">Tên đăng nhập *</label>
                        <input type="text" name="username" className="form-control" id="username" onChange={this.handleChange} />
                        <small className="errorInput">{errors.username?errors.username[0]:''}</small>
                        <label htmlFor="password" className="col-sm-12 controll-label">Mật khẩu *</label>
                        <input type="password" name="password" className="form-control" id="password" onChange={this.handleChange} />
                        <small className="errorInput">{errors.password?errors.password[0]:''}</small>
                        <button disabled={this.props.isLoadingReducer.isLoading} id="submitbutton">{this.props.isLoadingReducer.isLoading?
                            <div className={'dot-loader'}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            :'Đăng nhập'}</button>
                    </form>
                    <div className="clearfix" />
                    <div className="exist-account">Bạn chưa có tài khoản. <a href="/">Đăng ký ngay</a></div>
                    <div className="clearfix" />
                    { login.error && (<div className="alert alert-danger" role="alert">
                                            {login.error.messages}
                                        </div>)
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      login: state.loginReducer,
      isLoadingReducer: state.isLoadingReducer
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        userlogin: (username, password) => {
            dispatch(loginAction.Login(username, password))
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
  