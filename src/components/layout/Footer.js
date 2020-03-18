import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="clearfix"></div>
                <hr></hr>
                <div className="container-fuild footer text-center">
                    <p className="text-muted credit" style={{padding: '1em'}}>Copyright © 2018 by 100 DEGREES ENTERTAINMENT JSC</p>
                </div>
            </React.Fragment>
        )
    }
}
