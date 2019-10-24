import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react';

const styleTooltip = {
    borderRadius: 5,
    opacity: 0.9
}

export class AlertPortfolioExpirationObservationsActionModal extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const alertPortfolioExp = this.props.alertPortfolioExp ? this.props.alertPortfolioExp : {};
        const isAlertWithObservationsAndExpectations = alertPortfolioExp.observations && alertPortfolioExp.expectations;
        return (
            <div>
                <Popup style={styleTooltip} trigger={ 
                        <button className={"btn btn-sm " + (isAlertWithObservationsAndExpectations ? "btn-success" : "btn-danger")} onClick={this.props.openModal}>
                            <i className="pencil icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                        </button>} 
                    inverted position='left center' wide='very'>{isAlertWithObservationsAndExpectations ? this.props.alertPortfolioExp.observations : "Cliente sin diligenciamiento de observación"}</Popup>
            </div>
        )
    }
}

export default AlertPortfolioExpirationObservationsActionModal
