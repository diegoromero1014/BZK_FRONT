/**
 * Created by ahurtado on 12/6/2016.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {redirectUrl} from '../globalComponents/actions';

class LinkModalComponent extends Component {

    constructor(props) {
        super(props);
        this._redirect = this._redirect.bind(this);
    }

    _openModalContact() {
        const {idClient, idContact} = this.props;


    }

    render() {
        const {text, isShowModal} = this.props;
        if (isShowModal) {
            return (
                <td>
                    <a style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={this._openModalContact}>{text}</a>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        className="modalBt4-fade modal fade contact-detail-modal in">

                        <div className="modalBt4-dialog modalBt4-lg">
                            <div className="modalBt4-content modal-content">
                                <div className="modalBt4-header modal-header">
                                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">{modalTitle}</h4>
                                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                </div>
                                {this._contectViewModal(actions)}
                            </div>
                        </div>
                    </Modal>
                </td>
            );
        } else {
            return (<td><p>{text}</p></td>);
        }
    }
}

LinkModalComponent.propTypes = {
    text: PropTypes.string.isRequired,
    idClient: PropTypes.number.isRequired,
    idContact: PropTypes.number.isRequired,
    isShowModal: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({}, ownerProps) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkModalComponent);
