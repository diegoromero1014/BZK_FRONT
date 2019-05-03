import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';

import ContactDetailsModalComponent from '../contact/contactDetail/contactDetailsModalComponent';
import ComponentShareHolderDetail from '../clients/partners/shareholder/shareholderDetail/componentShareHolderDetail';
import ModalTask from '../visit/tasks/modalTask';
import ModalCreateTask from '../pendingTask/modalCreateTask';
import ModalTrackingCovenant from '../risksManagement/covenants/createTracking/modalTrackingCovenant';
import ModalObservation from '../alertPortfolioExpirtation/modalObservation';
import ModalDetailAEC from '../risksManagement/AEC/modalDetailAEC';
import ModalPendingAEC from '../myPendings/AEC/modalPendingAEC';
import ModalViewEmailsGroup from '../contact/favoritesGroup/modalViewEmailsGroup';
import ModalBoardMembers from '../clients/partners/boardMembers/createEditBoardMembers/modalBoardMembers';
import ModalObsersationLinkingRequests from '../myPendings/linkingRequests/observations/modalObservation';
import ModalObservationsRiskGroup from '../clientRiskGroup/observationsRiskGoup/modalObservationRiskGroup';
import SecurityMessageComponent from './../globalComponents/securityMessageComponent';

import { toggleModal } from './action';
import { clearClienEdit } from '../contact/contactDetail/actions';
import { clearSearchShareholder } from '../clients/partners/shareholder/shareholderDetail/actions';
import { clearValuesAdressessKeys } from '../selectsComponent/actions';

import * as views from './constants';

import { get } from 'lodash';
import ConfidentialBrandComponent from '../commercialReport/ConfidentialBrandComponent';

class ModalComponentDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        
        this.state = {
            modalIsOpen: false
        };
        this._contectViewModal = this._contectViewModal.bind(this);
    }

    openModal() {
        const { actions, clearValuesAdressessKeys, clearSearchShareholder } = this.props;
        switch (actions.component) {
            case views.VIEW_SHAREHOLDER:
                clearValuesAdressessKeys();
                clearSearchShareholder();
                break;
        }

        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        const { clearClienEdit } = this.props;
        const actions = this.props.actions;
        this.setState({ modalIsOpen: false });

        if (actions.component === views.VIEW_CONTACT) {
            clearClienEdit();
        }
    }

    _contectViewModal(actions, idx) {
        var cell;
        const { closeModal } = this.props;
        switch (actions.component) {
            case views.VIEW_CONTACT:
                cell = <ContactDetailsModalComponent contactId={actions.id} isOpen={this.closeModal} />;
                break;
            case views.VIEW_SHAREHOLDER:
                cell = <ComponentShareHolderDetail shareHolderId={actions.id} isOpen={this.closeModal} />;
                break;
            case views.VIEW_TASK:
                cell = <ModalTask taskEdit={actions.task} isOpen={this.closeModal} />;
                break;
            case views.VIEW_TASK_ADMIN:
                cell = <ModalCreateTask taskEdit={actions.id} isOpen={this.closeModal} idClient={actions.idClient} functCloseModal={actions.functCloseModal} actionEdit={actions.actionEdit} />;
                break;
            case views.VIEW_TRACKING_COVENANT:
                cell = <ModalTrackingCovenant covenantId={actions.id} isOpen={this.closeModal} />;
                break;
            case views.VIEW_OBSERVATION:
                cell = <ModalObservation alertPortfolioExpId={actions.id} isOpen={this.closeModal} />;
                break;
            case views.VIEW_AEC:
                cell = <ModalDetailAEC idAEC={actions.id} isOpen={this.closeModal} />
                break;
            case views.VIEW_EMAILS_GROUP:
                cell = <ModalViewEmailsGroup idGroup={actions.id} isOpen={this.closeModal} />
                break;
            case views.VIEW_AEC_PENDING:
                cell = <ModalPendingAEC aec={actions.aec} isOpen={this.closeModal} />
                break;
            case views.VIEW_BOARD_MEMBERS:
                cell = <ModalBoardMembers boardMember={actions.boardMember} isOpen={this.closeModal} />
                break;
            case views.VIEW_OBSERVATIONS_LINKING_REQUESTS:
                cell = <ModalObsersationLinkingRequests idLinkingRequests={actions.idLinkingRequests}
                    client={actions.client} isOpen={this.closeModal} />
                break;
            case views.VIEW_OBSERVATIONS_BY_RISK_GROUP:
                cell = <ModalObservationsRiskGroup idRiskGroup={actions.idRiskGroup} infoRiskGroup={actions.infoRiskGroup}
                    isOpen={this.closeModal} />
        }

        return (cell);
    }

    renderTitle() {
        const actions = this.props.actions;
        const modalTitle = this.props.modalTitle;

        switch (actions.component) {
            case views.VIEW_TASK_ADMIN:
                return (
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">
                            {modalTitle}

                            { actions.id.commercialReport && actions.id.commercialReport.isConfidential && 
                                <ConfidentialBrandComponent />
                            }
                        </h4>
                )
            default:
                    return (
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{modalTitle}</h4>
                    )
        }
    }


    render() {
        const actions = this.props.actions;
        const modalSize = get(actions, 'modalSize', 'lg');

        return (
            <td style={{ padding: '10px', textAlign: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={this.openModal}>
                    <i className="zoom icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                </button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className={`modalBt4-dialog modalBt4-${modalSize}`}>
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                {this.renderTitle()}
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal"
                                    role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <SecurityMessageComponent />
                            {this._contectViewModal(actions)}
                        </div>
                    </div>
                </Modal>
            </td>
        );
    }
}

function mapStateToProps({ modal }, { idModal }) {
    return {
        modalStatus: modal.get('modalState')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearValuesAdressessKeys,
        clearSearchShareholder,
        toggleModal,
        clearClienEdit
    }, dispatch);
}

ModalComponentDialog.propTypes = {
    modalTitle: PropTypes.string,
    actions: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentDialog);