import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { setArrayDeleteClientContact, deleteRelationshipServer, getContactDetails } from '../../contact/contactDetail/actions';
import { changeValueOpenModal, setEditRelationship, modifyClientRelationship } from '../actions';
import { OPEN_CREATE_MODAL, OPEN_EDIT_MODAL } from '../constants';
import { MESSAGE_SAVE_DATA } from '../../../constantsGlobal';
import { shorterStringValue } from '../../../actionsGlobal';
import { changeStateSaveData } from '../../main/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SweetAlert from '../../sweetalertFocus';
import ModalEditRelationship from './modalEditRelationship';
import ModalCreateRelationship from './cretaeRelationship/modalCreateRelationship';
import Modal from 'react-modal';
import _ from 'lodash';

export class ListClientsContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRelationshipClients: [],
            errorDeleteRelationship: false,
            successDeleteRelationship: false,
            showConfirmDelete: false
        };
        this.mapValuesClientsContact = this.mapValuesClientsContact.bind(this);
        this.deleteRelastionship = this.deleteRelastionship.bind(this);
        this.selectedAllItems = this.selectedAllItems.bind(this);
        this.closeDeleteRelationship = this.closeDeleteRelationship.bind(this);
        this.openModalCreateRelationship = this.openModalCreateRelationship.bind(this);
        this.viewRelationshipClientContact = this.viewRelationshipClientContact.bind(this);
        this.validateDelete = this.validateDelete.bind(this);
        this.selectCheckbox = this.selectCheckbox.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModalCreateRelationship = () => {
        const { dispatchChangeValueOpenModal } = this.props;
        dispatchChangeValueOpenModal(true, OPEN_CREATE_MODAL);
    }

    viewRelationshipClientContact = (entityClientContat) => {
        const { dispatchChangeValueOpenModal, dispatchSetEditRelationship } = this.props;
        dispatchChangeValueOpenModal(true, OPEN_EDIT_MODAL);
        dispatchSetEditRelationship(entityClientContat);
    }


    mapValuesClientsContact = (clientContact, idx) => {
        const lineOfBusiness = _.join(_.map(clientContact.listLineOfBusiness, 'value'), ', ')
        const functions = _.join(_.map(clientContact.listFunction, 'value'), ', ')
        const { listRelationshipClients } = this.state;
        const valueCheck = _.indexOf(listRelationshipClients, clientContact.idClientContact) < 0 ? false : true;
        return <tr key={idx}>
            <td className="collapsing">
                <input type="checkbox" title="Seleccionar" style={{ cursor: "pointer" }}
                    onClick={() => this.selectCheckbox(clientContact.idClientContact)}
                    checked={valueCheck} />
            </td>
            <td>{clientContact.numberDocument}</td>
            <td>{clientContact.clientName}</td>
            <td>{clientContact.typeContact}</td>
            <td>{shorterStringValue(lineOfBusiness, 60)}</td>
            <td>{shorterStringValue(functions, 60)}</td>
            <td className="collapsing">
                <i className="zoom icon" title="Ver detalle" style={{ cursor: "pointer" }}
                    onClick={() => this.viewRelationshipClientContact(clientContact)} />
            </td>
        </tr>
    }

    selectCheckbox = (idClientContact) => {
        const { dispatchSetArrayDeleteClientContact } = this.props;
        var { listRelationshipClients } = this.state;
        const indexDelete = _.indexOf(listRelationshipClients, idClientContact);
        if (indexDelete < 0) {
            listRelationshipClients.push(idClientContact);
        } else {
            _.remove(listRelationshipClients, (val) => val === idClientContact)
        }
        dispatchSetArrayDeleteClientContact(listRelationshipClients);
        this.setState({
            listRelationshipClients
        });
    }

    closeDeleteRelationship = () => {
        const { dispatchChangeStateSaveData, dispatchGetContactDetails, contactId } = this.props;
        this.setState({ successDeleteRelationship: false });
        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);
        dispatchGetContactDetails(contactId).then(() => {
            dispatchChangeStateSaveData(false, "");
        });
    }

    deleteRelastionship = async () => {
        this.setState({ showConfirmDelete: false });

        const { contactDetail, dispatchDeleteRelationshipServer, dispatchChangeStateSaveData, dispatchGetContactDetails, contactId } = this.props;

        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);
        const response = await dispatchDeleteRelationshipServer(contactDetail.get('listDeleteClientContact'));
        dispatchChangeStateSaveData(false, "");
        
        if (_.get(response, 'payload.status') === 200) {
            dispatchGetContactDetails(contactId);
            this.setState({ successDeleteRelationship: true, listRelationshipClients: [] });
        }
    }

    validateDelete = () => {
        const { contactDetail } = this.props;
        const listRelationshipClients = contactDetail.get('listDeleteClientContact');
        if (listRelationshipClients.length <= 0) {
            this.setState({ errorDeleteRelationship: true });
        } else {
            this.setState({ showConfirmDelete: true })
        }
    }

    closeModal = (type) => {
        const { dispatchChangeValueOpenModal, dispatchModifyClientRelationship } = this.props;
        dispatchModifyClientRelationship([]);
        dispatchChangeValueOpenModal(false, type);
    }

    selectedAllItems = () => {
        const { contactDetail, dispatchSetArrayDeleteClientContact } = this.props;
        const { listRelationshipClients } = this.state;
        if (listRelationshipClients.length !== contactDetail.get('listClientcontacts').length) {
            const valuesRelationship = _.map(contactDetail.get('listClientcontacts'), 'idClientContact', []);
            dispatchSetArrayDeleteClientContact(valuesRelationship);
            this.setState({
                listRelationshipClients: valuesRelationship
            });
        } else {
            dispatchSetArrayDeleteClientContact([]);
            this.setState({ listRelationshipClients: [] });
        }
    }

    render() {
        const { contactDetail, filterContactsReducer } = this.props;
        const valueCheckAll = contactDetail.get('listDeleteClientContact').length === contactDetail.get('listClientcontacts').length ? true : false;
        return (
            <div className="tab-content break-word" style={{ padding: '16px', borderRadius: '3px', overflow: 'initial', position: 'static' }}>
                {contactDetail.get('listClientcontacts').length > 0 ?
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs={12} md={12} lg={12}>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox"
                                            onClick={this.selectedAllItems} title="Seleccionar todos"
                                            checked={valueCheckAll} />
                                        </th>
                                        <th>Documento</th>
                                        <th>Razón social</th>
                                        <th style={{ width: '120px' }}>Tipo de contacto</th>
                                        <th>Entidad/Línea de negocio</th>
                                        <th>Función</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contactDetail.get('listClientcontacts').map(this.mapValuesClientsContact)}
                                </tbody>
                            </table>
                        </Col>
                        <Col xsOffset={1} mdOffset={3} lgOffset={3} xs={12} md={9} lg={9} >
                            <button className="btn btn-danger" onClick={this.validateDelete} style={{ float: 'right', cursor: 'pointer', marginTop: '15px', marginLeft: '15px' }}>
                                <i className="trash icon"></i> Eliminar relación(es)
                            </button>
                            <button className="btn btn-primary" onClick={this.openModalCreateRelationship} style={{ float: 'right', cursor: 'pointer', marginTop: '15px' }}>
                                <i className="plus icon"></i> Adicionar relación(es)
                            </button>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">El contacto no ha sido asociado a ningún cliente</span>
                            </div>
                        </Col>
                        <Col xsOffset={1} mdOffset={3} lgOffset={3} xs={12} md={9} lg={9} >
                            <button className="btn btn-primary" onClick={this.openModalCreateRelationship} style={{ float: 'right', cursor: 'pointer', marginTop: '15px', marginRight: '32px' }}>
                                <i className="plus icon"></i> Adicionar relación(es)
                                </button>
                        </Col>
                    </Row>
                }
                <Modal
                    isOpen={filterContactsReducer.get('modalIsOpen')}
                    onRequestClose={this.closeModal}
                    contentLabel="ListClientsContact"
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <ModalEditRelationship functionClose={this.closeModal} />
                </Modal>
                <Modal
                    isOpen={filterContactsReducer.get('modalCreateIsOpen')}
                    onRequestClose={this.closeModal}
                    contentLabel="ModalCreateRelationship"
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <ModalCreateRelationship functionClose={this.closeModal} />
                </Modal>
                <SweetAlert
                    type="error"
                    show={this.state.errorDeleteRelationship}
                    title="Error eliminando relaciones"
                    text="Señor usuario, para eliminar la relación de un contacto debe seleccionar por lo menos un cliente."
                    onConfirm={() => this.setState({ errorDeleteRelationship: false })}
                />
                <SweetAlert
                    type="success"
                    show={this.state.successDeleteRelationship}
                    title="Eliminar relaciones"
                    text="Señor usuario, la eliminación se realizó de forma exitosa."
                    onConfirm={this.closeDeleteRelationship}
                />
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDelete}
                    title="Confirmar eliminación"
                    text="Señor usuario, ¿Está seguro que desea eliminar la(s) relación(es)?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDelete: false })}
                    onConfirm={this.deleteRelastionship} />
            </div>
        )
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchSetArrayDeleteClientContact: setArrayDeleteClientContact,
        dispatchDeleteRelationshipServer: deleteRelationshipServer,
        dispatchChangeStateSaveData: changeStateSaveData,
        dispatchGetContactDetails: getContactDetails,
        dispatchChangeValueOpenModal: changeValueOpenModal,
        dispatchSetEditRelationship: setEditRelationship,
        dispatchModifyClientRelationship: modifyClientRelationship
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, contactDetail, clientInformacion }) {
    return {
        filterContactsReducer,
        contactDetail,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsContact);