import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import gameActions from "../../actions/games.actions";
import CommonConfig from "../../config/CommonConfig";

export class Games extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount(){
        this.props.getGameList();
    }

    render() {
        if(this.props.gamesReducer.data.length > 0 )
        {
            var { gamesReducer } = this.props;
            var gameElemnt = gamesReducer.data.map((val, index) => {
                let gameItem = '';
                if(val.status === 1)
                {
                    if(val.payment_type === 'wallet')
                    {
                        gameItem =   <React.Fragment>
                                        <Link to={`/nap-vi/${val.slug}-g${val.id}`}>
                                            <div className="item-image">
                                                <img src={CommonConfig.assetDomain + val.avatar} alt={val.name} />
                                            </div>
                                        </Link>
                                        <Link to={`/nap-vi/${val.slug}-g${val.id}`}>
                                            <div className="title-item">{val.name}</div>
                                        </Link>       
                                    </React.Fragment>
                    }
                    else if(val.payment_type === 'none_wallet')
                    {
                        gameItem =   <React.Fragment>
                                        <Link to={`/nap-game/${val.slug}-g${val.id}`}>
                                            <div className="item-image">
                                                <img src={CommonConfig.assetDomain + val.avatar} alt={val.name} />
                                            </div>
                                        </Link>
                                        <Link to={`/nap-game/${val.slug}-g${val.id}`}>
                                            <div className="title-item">{val.name}</div>
                                        </Link>       
                                    </React.Fragment>
                    }
                    else
                    {
                        gameItem =   <React.Fragment>
                                        <a target="blank" rel="noopener noreferrer" href={val.url_redirect}>
                                            <div className="item-image">
                                                <img src={CommonConfig.assetDomain + val.avatar} alt={val.name} />
                                            </div>
                                        </a>
                                        <a target="blank" rel="noopener noreferrer" href={val.url_redirect}>
                                            <div className="title-item">{val.name}</div>
                                        </a>       
                                    </React.Fragment>
                    }
                    return <div className="item" key={index}>
                                {gameItem}
                            </div>
                }
            })
        }
        
        
        return (
            <div className="container-fuild product">
                <h3>Sản phẩm nổi bật</h3>
                {gameElemnt}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    gamesReducer: state.gamesReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getGameList: () => {
            dispatch(gameActions.getAllRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Games)