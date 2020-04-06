import React from 'react';
import Modal from 'react-modal';

export default function BiztrackModal({ onCancel, title, body, head }) {
    return (
        <Modal isOpen={true} className="modalBt3-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
                <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{title}</h4>
                        <button type="button" onClick={onCancel} className="close" data-dismiss="modal" role="close">
                            <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    {head}
                    <div style={{ padding: "15px" }}>
                    {body}
                    </div>
                </div>
            </div>
        </Modal>
    )
}