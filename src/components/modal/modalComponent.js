import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';

import ContactDetailsModalComponent from '../contact/contactDetail/contactDetailsModalComponent';
import ComponentShareHolderDetail from '../clients/partners/shareholder/shareholderDetail/componentShareHolderDetail';
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

import _ from 'lodash';
import ConfidentialBrandComponent from '../commercialReport/ConfidentialBrandComponent';
import AlertPortfolioExpirationObservationsActionModal from '../alertPortfolioExpirtation/alertPortfolioExpirationObservationsActionModal';
import TaskPage from "../pendingTask/taskPage";
import ModalTask from "../visit/tasks/modalTask";

export class ModalComponentDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderConfidentialBrand = this.renderConfidentialBrand.bind(this);
        this.renderOpenModalButton = this.renderOpenModalButton.bind(this);
        
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
            default:
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

    _contectViewModal(actions) {
        var cell;
        const { origin } = this.props;
        switch (actions.component) {
            case views.VIEW_CONTACT:
                cell = <ContactDetailsModalComponent contactId={actions.id} isOpen={this.closeModal} origin={origin}/>;
                break;
            case views.VIEW_SHAREHOLDER:
                cell = <ComponentShareHolderDetail shareHolderId={actions.id} isOpen={this.closeModal} />;
                break;
            case views.VIEW_TASK:
                cell = <ModalTask taskEdit={actions.task} isOpen={this.closeModal} />;
                break;
            case views.VIEW_TASK_ADMIN:
                cell = <TaskPage params={{ id: actions.id.id ? actions.id.id : actions.id }} idClient={actions.idClient} fromModal={true} closeModal={this.closeModal} updateTasksTables={actions.updateTasksTables}/>;
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
                break;
            default:
                break;
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
                            {this.renderConfidentialBrand()}
                        </h4>
                )
            default:
                    return (
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{modalTitle}</h4>
                    )
        }
    }

    renderConfidentialBrand() {
        const actions = this.props.actions;
        if (typeof actions.id == 'number') {
            if (actions.object.commercialReport && actions.object.commercialReport.isConfidential) {
                return <ConfidentialBrandComponent /> 
            }
        } else {
            if (actions.id.commercialReport && actions.id.commercialReport.isConfidential) {
                return <ConfidentialBrandComponent />
            }
        }
    }

    renderOpenModalButton(){
        const {origin, alertPortfolioExpiration, actions} = this.props;
        const alertPortfolioExp = _.find(alertPortfolioExpiration.get('responseClients'), (item) => {
            return _.isEqual(item.id, actions.id); 
        });
        
        if (origin == views.ALERT_PORTFOLIO_EXPIRATION_LIST) {
            return (                    
                <AlertPortfolioExpirationObservationsActionModal alertPortfolioExp={alertPortfolioExp} openModal={this.openModal}/>
            )
        } else {
            return (
                <button className="btn btn-primary btn-sm" onClick={this.openModal}>
                    <i className="zoom icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                </button>
                )
        }
    }


    render() {
        const {actions} = this.props;
        const modalSize = _.get(actions, 'modalSize', 'lg');   
                       
        return (
            <td style={{ padding: '10px', textAlign: 'center' }}>
                {this.renderOpenModalButton()}                
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

function mapStateToProps({ modal, alertPortfolioExpiration }, { idModal }) {
    return {
        modalStatus: modal.get('modalState'),
        alertPortfolioExpiration
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