import React, { Component } from 'react'

let styles = {
    margin: '0px 0px 0px 15px'
};

export default class ModalClientName extends Component {
    
    constructor(props){
        super(props);
    }
    
    render() {
        const {clientName} = this.props;
        return (
            <div style={styles}>
                <b>Cliente:</b> <span>{clientName}</span>
            </div>
        )
    }
}
