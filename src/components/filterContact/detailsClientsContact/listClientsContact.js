import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';
import { setArrayDeleteClientContact, deleteRelationshipServer, getContactDetails } from '../../contact/contactDetail/actions';
import { changeValueOpenModal, setEditRelationship } from '../actions';
import { MESSAGE_SAVE_DATA } from '../../../constantsGlobal';
import { shorterStringValue } from '../../../actionsGlobal';
import { changeStateSaveData } from '../../dashboard/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SweetAlert from 'sweetalert-react';
import ModalEditRelationship from './modalEditRelationship';
import Modal from 'react-modal';
import _ from 'lodash';

class ListClientsContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRelationshipClients: [],
            errorDeleteRelationship: false,
            successDeleteRelationship: false,
            showConfirmDelete: false
        };
        this._mapValuesClientsContact = this._mapValuesClientsContact.bind(this);
        this._deleteRelastionship = this._deleteRelastionship.bind(this);
        this._seletedAllItems = this._seletedAllItems.bind(this);
        this._closeDeleteRelationship = this._closeDeleteRelationship.bind(this);
        this._viewRelationchipClientContact = this._viewRelationchipClientContact.bind(this);
        this._selectCheckbox = this._selectCheckbox.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    _viewRelationchipClientContact(entityClientContat) {
        const { changeValueOpenModal, setEditRelationship } = this.props;
        changeValueOpenModal(true);
        setEditRelationship(entityClientContat);
    }

    _mapValuesClientsContact(clientContact, idx) {
        const { contactDetail } = this.props;
        const lineOfBusiness = _.join(_.map(clientContact.listLineOfBusiness, 'value'), ', ')
        const functions = _.join(_.map(clientContact.listFunction, 'value'), ', ')
        const { listRelationshipClients } = this.state;
        const valueCheck = _.indexOf(listRelationshipClients, clientContact.idClientContact) < 0 ? false : true;
        return <tr key={idx}>
            <td className="collapsing">
                <input type="checkbox" title="Seleccionar" style={{ cursor: "pointer" }}
                    onClick={() => this._selectCheckbox(clientContact.idClientContact)}
                    checked={valueCheck} />
            </td>
            <td>{clientContact.numberDocument}</td>
            <td>{clientContact.clientName}</td>
            <td>{clientContact.typeContact}</td>
            <td>{shorterStringValue(lineOfBusiness, 60)}</td>
            <td>{shorterStringValue(functions, 60)}</td>
            <td className="collapsing">
                <i className="zoom icon" title="Ver detalle" style={{ cursor: "pointer" }}
                    onClick={() => this._viewRelationchipClientContact(clientContact)} />
            </td>
        </tr>
    }

    _selectCheckbox(idClientContact) {
        const { contactDetail, setArrayDeleteClientContact } = this.props;
        var { listRelationshipClients } = this.state;
        const indexDelete = _.indexOf(listRelationshipClients, idClientContact);
        if (indexDelete < 0) {
            listRelationshipClients.push(idClientContact);
        } else {
            _.remove(listRelationshipClients, (val) => val == idClientContact)
        }
        setArrayDeleteClientContact(listRelationshipClients);
        this.setState({
            listRelationshipClients
        });
    }

    _closeDeleteRelationship() {
        const { changeStateSaveData, getContactDetails, contactId } = this.props;
        this.setState({ successDeleteRelationship: false });
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        getContactDetails(contactId).then((data) => {
            changeStateSaveData(false, "");
        });
    }

    _deleteRelastionship() {
        this.setState({ showConfirmDelete: false});
        const { contactDetail, deleteRelationshipServer, changeStateSaveData } = this.props;
        const listRelationshipClients = contactDetail.get('listDeleteClientContact');
        if (listRelationshipClients.length > 0) {
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            console.log('listDeleteClientContact', contactDetail.get('listDeleteClientContact'));
            deleteRelationshipServer(contactDetail.get('listDeleteClientContact')).then((data) => {
                changeStateSaveData(false, "");
                this.setState({ successDeleteRelationship: true });
            });
        } else {
            this.setState({ errorDeleteRelationship: true });
        }
    }

    closeModal() {
        const { changeValueOpenModal } = this.props;
        changeValueOpenModal(false);
    }

    _seletedAllItems() {
        const { contactDetail, setArrayDeleteClientContact } = this.props;
        const { listRelationshipClients } = this.state;
        if (listRelationshipClients.length !== contactDetail.get('listClientcontacts').length) {
            setArrayDeleteClientContact(_.map(contactDetail.get('listClientcontacts'), 'idClientContact', []));
            this.setState({
                listRelationshipClients: _.map(contactDetail.get('listClientcontacts'), 'idClientContact', [])
            });
        } else {
            setArrayDeleteClientContact([]);
            this.setState({ listRelationshipClients: [] });
        }
    }

    render() {
        const { contactDetail, filterContactsReducer } = this.props;
        const valueCheckAll = contactDetail.get('listDeleteClientContact').length === contactDetail.get('listClientcontacts').length ? true : false;
        return (
            <div className="tab-content break-word" style={{ border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial', position: 'initial' }}>
                <Row style={{ marginTop: '20px' }}>
                    <Col xs={12} md={12} lg={12}>
                        <table className="ui striped table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox"
                                        onClick={this._seletedAllItems} title="Seleccionar todos"
                                        checked={valueCheckAll} />
                                    </th>
                                    <th>Documento</th>
                                    <th>Razón social</th>
                                    <th style={{ width: '110px' }}>Tipo de contacto</th>
                                    <th>Entidad/Línea de negocio</th>
                                    <th>Función</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactDetail.get('listClientcontacts').map(this._mapValuesClientsContact)}
                            </tbody>
                        </table>
                    </Col>
                    <Col xsOffset={1} mdOffset={9} lgOffset={9} xs={12} md={3} lg={3}>
                        <button className="btn btn-danger" onClick={() => this.setState({showConfirmDelete: true})} style={{ float: 'right', cursor: 'pointer', marginTop: '15px' }}>
                            <i className="trash outline icon"></i> Eliminar relación(es)
                        </button>
                    </Col>
                </Row>
                <Modal
                    isOpen={filterContactsReducer.get('modalIsOpen')}
                    onRequestClose={this.closeModal}
                    contentLabel=""
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <ModalEditRelationship functionClose={this.closeModal}/>
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
                    title="Eliminación relaciones"
                    text="Señor usuario, la eliminación se realizó de forma exitosa."
                    onConfirm={this._closeDeleteRelationship}
                />
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDelete}
                    title="Confirmación eliminación"
                    text="Señor usuario, ¿Está seguro que desea eliminar las relaciones?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDelete: false })}
                    onConfirm={this._deleteRelastionship} />
            </div>
        )
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setArrayDeleteClientContact,
        deleteRelationshipServer,
        changeStateSaveData,
        getContactDetails,
        changeValueOpenModal,
        setEditRelationship
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, contactDetail }, ownerProps) {
    return {
        filterContactsReducer,
        contactDetail
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsContact);