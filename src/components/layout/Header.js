import React, { Component } from 'react'

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import loginAction from "../../actions/login.actions.js";
import postAction from "../../actions/post.actions";

class Header extends Component {
    
    // constructor(props){
    //     super(props);
    // }

    componentDidMount(){
        this.props.getAllPost();
    }

    logout = () => {
        let { login } = this.props;
        if(login.isLogged === true){
            this.props.userLogout();
        }
    }

    render() {
        let {login, postsReducer} = this.props;
        let rightTopBar = '';
        if(login.isLogged !== true){
            rightTopBar = <li><Link to="/login">Đăng nhập </Link></li>
        }
        else{
            rightTopBar = <li className=" dropdown"><a href="/" className="dropdown-toggle active" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{login.data.data.username} <span className="caret" /></a>
                            <ul className="dropdown-menu dropdown-menu-right">
                                <li><a href="https://id.100d.mobi/changepass">Đổi mật khẩu</a></li>
                                <li><a href="https://id.100d.mobi/edit">Thông tin tài khoản</a></li>
                                <li><a href="/" >Đăng xuất</a></li>
                            </ul>
                        </li>
        }
        let postsElement = '';
        if(postsReducer.listPost.length > 0)
        {
            postsElement = postsReducer.listPost.map((val, index) => {
                return <li key={index}><Link to={"/post-detail/" + val.slug}>{val.title}</Link></li>
            })
        }
        return (
            <div className="container-fuild menu">
                <nav className="navbar navbar-default" role="navigation">
                    <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                        <span className="icon-bar" />
                    </button>
                    <Link className="navbar-brand" to="/">
                        100d pay
                    </Link>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <li><Link to="/">Trang chủ </Link></li>
                        <li className="dropdown">
                        <a href="/" className="dropdown-toggle" data-toggle="dropdown">Hướng dẫn <span className="caret" /></a>
                        <ul className="dropdown-menu" role="menu">
                            {postsElement}
                        </ul>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav pull-right">
                        {rightTopBar}
                    </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      login: state.loginReducer,
      postsReducer: state.postReducer
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        userLogout: () =>{
            dispatch(loginAction.logout())
        },
        getAllPost: () => {
            dispatch(postAction.getAllPostRequest())
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);