import React, { Component } from 'react'

export default class Test extends Component {

    constructor(props){
        super(props)
        console.log('constructor')
    }

    componentDidMount(){
        console.log('componentDidMount')
    }

    componentDidUpdate(){
        console.log('componentDidUpdate')
    }

    render() {
        console.log('render')
        return (
            <div>
                
            </div>
        )
    }
}
