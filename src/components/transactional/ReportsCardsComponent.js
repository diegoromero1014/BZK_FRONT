import React, { Component, PropTypes } from 'react';
import { Icon, Button } from 'semantic-ui-react'
import ModalComponent from './ModalComponent';

import { dispatchShowMessageToStore } from '../sweetAlertMessages/actions';
import { executeFunctionIfInternetExplorer, showSweetAlertErrorMessage } from '../../utils/browserValidation';

class ReportsCardsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            OPENED: false
        }
    }

    handleAction(type) {
        switch (type.toUpperCase()) {
            case 'VIEW':
                this.handleVisualize();
                break;
            case 'DOWNLOAD':
                this.handleDownload();
                break;
            case 'FRAME':
                executeFunctionIfInternetExplorer(this.handleOpenModal, showSweetAlertErrorMessage(dispatchShowMessageToStore))
                break;
        }
    }

    handleVisualize() {
        const { url } = this.props;

        if (url) {
            this.redurectUrl(url);
        }
    }

    handleDownload() {
        const { url } = this.props;
        if (url) {
            this.redurectUrl(url);
        }
    }

    handleOpenModal() {
        this.setState({
            OPENED: true
        })
    }

    handleCloseModal = () => {
        this.setState({
            OPENED: false
        })
    }

    redurectUrl(url) {
        window.open(url, "_blank");
    }

    render() {
        const { title, description, type, url } = this.props

        return (
            <div className="container-report-card">
                <div className="container-title">
                    <h3>{title}</h3>
                </div>
                <div className="container-main">
                    <p> {description} </p>
                </div>
                <div className="container-footer">
                    <Button name="btn" className="btn-report-card" onClick={() => { this.handleAction(type) }}>
                        <Icon name='file archive outline' size="big" /> Abrir
                    </Button>
                </div>

                {this.state.OPENED &&
                    <ModalComponent
                        closeModal={this.handleCloseModal} 
                        url={url}
                        title={title}
                    />
                }
            </div>
        )
    }
}

ReportsCardsComponent.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export default ReportsCardsComponent
