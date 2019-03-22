import React, { Component, PropTypes } from 'react';
import Modal from "react-modal";

class ModalComponent extends Component {
    render() {
        const { closeModal, url, title } = this.props;

        return (
            <Modal name="modal" isOpen={true} onRequestClose={closeModal} contentLabel={title} className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-lg" style={{ margin: "0", width: "100vw", height: "100vh" }}>
                    <div className="modalBt4-content modal-content" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <div className="modalBt4-header modal-header" style={{ flexShrink: "0" }}>
                            <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }}>{title}</h4>

                            <button type="button" onClick={closeModal} className="close" data-dismiss="modal" role="close">
                                <span className="modal-title" aria-hidden="true" role="close">
                                    <i className="remove icon modal-icon-close" role="close" />
                                </span>
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        <iframe name="Modalframe" className="Modalframe" style={{ width: "100%", border: "0", flexGrow: "1" }} src={url}></iframe>
                    </div>
                </div>
            </Modal>
        );
    }
}

ModalComponent.propTypes = {
    closeModal: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default ModalComponent;