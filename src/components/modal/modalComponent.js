import React, {Component} from 'react';
import {connect} from 'react-redux';
import ButtonComponent from './component';
import Modal from 'react-modal';
import {toggleModal} from './action';
import {bindActionCreators} from 'redux';

class ModalComponentDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        const {modalStatus} = this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
        return (
            <div>
                <ButtonComponent/>
                <Modal
                    isOpen={modalStatus}
                    onRequestClose={this.closeModal}
                    className="modalBt4-fade"
                >
                    <div className="modalBt4-dialog">
                        <div className="modalBt4-content">
                            <div className="modalBt4-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modalBt4-title">Modal title</h4>
                            </div>
                            <div className="modalBt4-body">
                                <p>One fine body&hellip;</p>
                            </div>
                            <div className="modalBt4-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this.closeModal}>Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={this.closeModal}>Save
                                    changes
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps({modal}) {
    return {
        modalStatus: modal.get('modalState')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentDialog);