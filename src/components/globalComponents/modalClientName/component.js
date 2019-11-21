import React, { Component } from 'react'

let styles = {
    margin: '0px 0px 0px 18px'
};

export default class ModalClientName extends Component {
    
    constructor(props){
        super(props);
    }
    
    render() {
        const {clientName, typeDocument, clientDocument} = this.props;        
        return (
            <div style={styles}>
                <span name="clientDocument"><b>{typeDocument}: </b> {clientDocument}</span>
                <br></br>
                <span name="clientName"><b>Cliente:</b> {clientName}</span>                
            </div>
        )
    }
}
