import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';

class ButtonOpenHistoricalClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    render() {
        const { deliveryComplete } = this.props;
        return (
            <div>
                {deliveryComplete ?
                    <i className="green checkmark icon" title="Historial del cliente completo"
                        style={{ cursor: "pointer" }} onClick={this.openModal} />
                    :
                    <i className="red remove icon" title="El historial del cliente está incompleto"
                        style={{ cursor: "pointer" }} onClick={this.openModal} />
                }
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Historial del cliente</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <span>Holaaaaaaaa</span>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps({ clientInformacion, customerStory }, ownerProps) {
    return {
        clientInformacion,
        customerStory
    };
}

export default connect(mapStateToProps, null)(ButtonOpenHistoricalClient);