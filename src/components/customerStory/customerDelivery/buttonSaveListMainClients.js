import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { reduxForm } from 'redux-form';

import ComponentListMainClients from '../../contextClient/listMainClients/componentListMainClients';
import SecurityMessageComponent from './../../globalComponents/securityMessageComponent';

import { clientsByEconomicGroup, saveContextClientDeliveryClients } from '../actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { showLoading } from '../../loading/actions';
import { getContextClient } from '../../clients/creditStudy/actions';

import { validateResponse, replaceCommaInNumber } from '../../../actionsGlobal';
import { MESSAGE_SAVE_DATA } from '../../../constantsGlobal';
import { UPDATE_CONTEXT_CLIENT } from '../constants';

const fields = [];

class ButtonSaveListMainClients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            showFormAddMainClient: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showFormMainClients = this.showFormMainClients.bind(this);
        this._submitListMainClients = this._submitListMainClients.bind(this);
        this._createJsonSaveContextClient = this._createJsonSaveContextClient.bind(this);
    }

    openModal() {
        const { idClient, getContextClient, changeStateSaveData, swtShowMessage } = this.props;
        getContextClient(idClient, UPDATE_CONTEXT_CLIENT);
        this.setState({ modalIsOpen: true });
    }

    showFormMainClients(type, value) {
        this.setState({ showFormAddMainClient: value });
    }

    closeModal() {
        const { clientsByEconomicGroup, customerStory, clientInformacion } = this.props;
        const checkEconomicGroup = customerStory.get('checkEconomicGroup');
        const economicGroup = clientInformacion.get('responseClientInfo').economicGroup;
        const idClient = window.sessionStorage.getItem('idClientSelected');
        this.setState({ modalIsOpen: false });
        clientsByEconomicGroup(checkEconomicGroup ? null : idClient, checkEconomicGroup ? economicGroup : null).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', 'Error validando clientes', 'Señor usuario, ocurrió un error validando los clientes.');
            }
        });
    }

    _submitListMainClients() {
        const { swtShowMessage, saveContextClientDeliveryClients, showLoading, customerStory, clientsByEconomicGroup, clientInformacion } = this.props;
        if (!this.state.showFormAddMainClient) {
            showLoading(true, MESSAGE_SAVE_DATA);
            saveContextClientDeliveryClients(this._createJsonSaveContextClient()).then((data) => {
                showLoading(false, '');
                if (!validateResponse(data)) {
                    swtShowMessage('error', 'Error actualización clientes', 'Señor usuario, ocurrió un error validando los clientes.');
                } else {
                    swtShowMessage('success', 'Principales clientes', 'Señor usuario, la informaicón de principales clientes se actualizo de forma exitosa.');
                    this.closeModal();
                }
                const checkEconomicGroup = customerStory.get('checkEconomicGroup');
                const economicGroup = clientInformacion.get('responseClientInfo').economicGroup;
                const idClient = window.sessionStorage.getItem('idClientSelected');
                clientsByEconomicGroup(checkEconomicGroup ? null : idClient, checkEconomicGroup ? economicGroup : null).then((data) => {
                    if (!validateResponse(data)) {
                        swtShowMessage('error', 'Error validando clientes', 'Señor usuario, ocurrió un error validando los clientes.');
                    }
                });
            });
        } else {
            swtShowMessage('error', 'Error actualización cliente', 'Señor usuario, actualmente se encuentra realizando una creación o una edición, para poder guardar la información del cliente, primero debe terminarla o cancelarla.');
        }
    }

    _createJsonSaveContextClient() {
        const { clientInformacion, idClient } = this.props;

        const listMainCustomer = clientInformacion.get('otherListMainCustomer');
        _.map(listMainCustomer, (item) => {
            item.id = item.id.toString().includes('mainC_') ? null : item.id;
            item.term = replaceCommaInNumber(item.term);
            return item;
        });
        const listMainSupplier = clientInformacion.get('otherListMainSupplier');
        _.map(listMainSupplier, (item) => {
            item.id = item.id.toString().includes('mainS_') ? null : item.id;
            item.term = replaceCommaInNumber(item.term);
            return item;
        });

        const noAppliedMainClients = clientInformacion.get('otherNoAppliedMainClients');
        const noAppliedMainSuppliers = clientInformacion.get('otherNoAppliedMainSuppliers');
        return {
            'idClient': idClient,
            'listMainCustomer': listMainCustomer,
            'listMainSupplier': listMainSupplier,
            noAppliedMainClients,
            noAppliedMainSuppliers
        };
    }

    renderIcon = delivery => {
        const { mainNit, decisionCenter, mainClientsComplete } = delivery;

        if (mainClientsComplete) {
            return (
                <i
                    className="green checkmark icon"
                    title="Los principales clientes están completos"
                    style={{ cursor: "pointer" }}
                    onClick={this.openModal} />
            );
        } else {
            if (!mainNit && !decisionCenter) {
                return (
                    <i
                        className="yellow warning icon"
                        title="Los principales clientes están incompletos"
                        style={{ cursor: "pointer" }}
                        onClick={this.openModal} />
                );
            } else {
                return (
                    <i
                        className="red remove icon"
                        title="Los principales clientes están incompletos"
                        style={{ cursor: "pointer" }}
                        onClick={this.openModal} />
                );
            }
        }
    }

    render() {
        return (
            <form>
                {this.renderIcon(this.props.delivery)}
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Información del cliente</h4>
                                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <SecurityMessageComponent />
                            <ComponentListMainClients
                                showFormMainClients={this.state.showFormAddMainClient} fnShowForm={this.showFormMainClients}
                                nameList="otherListMainCustomer" nameNoApplied="otherNoAppliedMainClients" />
                            <div className="modalBt4-footer modal-footer">
                                <button className="btn btn-primary modal-button-edit" onClick={this._submitListMainClients}>
                                    <span style={{ color: '#FFFFFF', padding: '10px' }}>Guardar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientsByEconomicGroup,
        swtShowMessage,
        saveContextClientDeliveryClients,
        showLoading,
        getContextClient
    }, dispatch);
}

function mapStateToProps({ clientInformacion, customerStory }, ownerProps) {
    return {
        clientInformacion,
        customerStory
    };
}

export default reduxForm({
    form: 'mainClientsList',
    fields,
}, mapStateToProps, mapDispatchToProps)(ButtonSaveListMainClients);