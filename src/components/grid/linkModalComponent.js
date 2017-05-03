/**
 * Created by ahurtado on 12/6/2016.
 */
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as views from '../../constantsGlobal';
import {VIEW_CONTACT} from './constants';
import ContactDetailsModalComponent from '../contact/contactDetail/contactDetailsModalComponent';
import {clearClienEdit} from '../contact/contactDetail/actions';
import Modal from 'react-modal';
import {get} from 'lodash';
import {contactsByFunctionOrTypeFindServer} from '../contactByFunctionOrType/actions';
import {
    NUMBER_RECORDS
} from './constants';
class LinkModalComponent extends Component {

    constructor(props) {
        super(props);
        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._viewModalContent = this._viewModalContent.bind(this);
        this.state = {
            modalIsOpen: false
        };
    }


    render() {
        const {showModal, properties} = this.props;
        const modalSize = get(properties, 'modalSize', 'lg');
        const modalTitle = get(properties, 'modalTitle', '');
        const text = get(properties, 'text', '');
        if (showModal) {
            return (
                <td>
                    <a style={{cursor: 'pointer', textDecoration: 'underline'}}
                       onClick={this._openModal}>{text}</a>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onRequestClose={this.closeModal}
                        className="modalBt4-fade modal fade contact-detail-modal in">

                        <div className={`modalBt4-dialog modalBt4-${modalSize}`}>
                            <div className="modalBt4-content modal-content">
                                <div className="modalBt4-header modal-header">
                                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}}
                                        id="myModalLabel">{modalTitle}</h4>
                                    <button type="button" onClick={this._closeModal} className="close"
                                            data-dismiss="modal"
                                            role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                </div>
                                {this._viewModalContent(properties)}
                            </div>
                        </div>
                    </Modal>
                </td>
            );
        } else {
            return (<td><p>{text}</p></td>);
        }
    }

    _openModal() {
        const {properties} = this.props;
        switch (properties.component) {
            case VIEW_CONTACT:
                const clientId = get(properties, 'id.clientId');
                window.localStorage.setItem('idClientSelected', clientId);
        }
        this.setState({modalIsOpen: true});
    }

    _viewModalContent(actions, idx) {
        let cell;
        switch (actions.component) {
            case VIEW_CONTACT:
                const contactId = get(actions, 'id.contactId');
                cell = <ContactDetailsModalComponent contactId={contactId} isOpen={this._closeModal}/>;
                break;
            default:
                cell = '';
        }

        return (cell);
    }

    _closeModal() {
        const {clearClienEdit, properties,  contactsByFunctionOrTypeFindServer, contactsByFunctionOrType} = this.props;
        this.setState({modalIsOpen: false});
        if (properties.component === VIEW_CONTACT) {
            clearClienEdit();
            contactsByFunctionOrTypeFindServer(contactsByFunctionOrType.get('idFunction'), contactsByFunctionOrType.get('idType'), 1, NUMBER_RECORDS, 0, '');
        }
    }

}

LinkModalComponent.propTypes = {
    showModal: PropTypes.bool.isRequired,
    properties: PropTypes.string.isRequired
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({clearClienEdit,contactsByFunctionOrTypeFindServer}, dispatch);
}

function mapStateToProps({contactsByFunctionOrType}, ownerProps) {
    return {contactsByFunctionOrType};
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkModalComponent);
