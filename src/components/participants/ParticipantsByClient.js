import React, { Component } from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { findContactsByClient } from '../contact/actions';
import { addParticipant, clearParticipants, deleteParticipant } from './actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { NUMBER_CONTACTS, KEY_PARTICIPANT_CLIENT } from './constants';
import { CREAR, MODULE_CONTACTS } from '../../constantsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import BotonCreateContactComponent from '../contact/createContact/botonCreateContactComponent';
import ListParticipantsByClient from './ListParticipantsByClient';
import ParticipantInformation from './ParticipantInformation';

import '../../../styles/participants/participantsByClient.scss';

export class ParticipantsByClient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedContact: null,
            selectedContactInformation: null,
            open: false
        }
        this.editing = false;
    }

    componentWillMount() {
        const { dispatchContactsByClient, dispatchValidatePermissionsByModule } = this.props;

        dispatchContactsByClient(window.sessionStorage.getItem('idClientSelected'), NUMBER_CONTACTS);
        dispatchValidatePermissionsByModule(MODULE_CONTACTS);
    }

    handleSetInformation = selectedContact => {
        const { contacts, participants, dispatchShowAlert } = this.props;
        
        let existingContact;

        if (!isNaN(selectedContact)) {
            existingContact = contacts.find(element => element.id === Number(selectedContact));            
            existingContact = {
                tipoParticipante: KEY_PARTICIPANT_CLIENT,
                idParticipante: existingContact.id,
                nombreParticipante: existingContact.nameComplet,
                cargo: !existingContact.contactPosition ? '' : existingContact.contactPosition,
                empresa: '',
                estiloSocial: !existingContact.contactSocialStyle ? '' : existingContact.contactSocialStyle,
                actitudBanco: !existingContact.contactActitudeCompany ? '' : existingContact.contactActitudeCompany,
                fecha: Date.now(),
                uuid: _.uniqueId('participanClient_'),
                nameComplet: existingContact.nameComplet,
                contactPosition: existingContact.contactPosition,
                contactSocialStyle: existingContact.contactSocialStyle,
                contactActitudeCompany: existingContact.contactActitudeCompany
            }
        } else {
            existingContact = selectedContact;
        }        
        if(participants.find(element => element.idParticipante === Number(existingContact.idParticipante)) && !this.editing) {                        
            dispatchShowAlert('error', "Participante existente", "Señor usuario, el participante que desea agregar ya se encuentra en la lista");
            this.setState({open: false, selectedContact: '' });
        }
        this.setState({ selectedContactInformation: existingContact });        
    }

    lengthParticipants = () => {
        const { participants } = this.props;
        return participants.toArray().filter(participant => participant.tipoParticipante === KEY_PARTICIPANT_CLIENT).length;
    }

    addContact = selectedContact => {
        const { dispatchAddParticipant, participants, dispatchShowAlert, limitParticipantsByClient, dispatchDeleteParticipant } = this.props;
        
        if (selectedContact) {

            if (limitParticipantsByClient && this.lengthParticipants() >= limitParticipantsByClient && !this.editing) {                
                dispatchShowAlert('error', "Límite de participantes", "Señor usuario, sólo se pueden agregar máximo 10 participantes por parte del cliente");
                return;
            }

            let existingContact = participants.find(element => element.idParticipante === Number(selectedContact.idParticipante));

            if (!existingContact || this.editing) {

                if(this.editing) {
                    dispatchDeleteParticipant(participants.findIndex(item => item.idParticipante === existingContact.idParticipante), KEY_PARTICIPANT_CLIENT);
                }

                dispatchAddParticipant(selectedContact);
                this.setState({ selectedContact: '' });
                this.handleCloseModal();
            } else {
                dispatchShowAlert('error', "Participante existente", "Señor usuario, el participante que desea agregar ya se encuentra en la lista");
                this.setState({ selectedContact: '' });
                this.handleCloseModal();
            }
        }
    }

    handleCloseModal = () => {
        this.setState({ open: false, selectedContactInformation: null, selectedContact: '' });
        this.editing = false;
    }

    handleOnChange = value => {
        const { limitParticipantsByClient, dispatchShowAlert } = this.props;

        if (value && value !== "") {
            
            if (limitParticipantsByClient && this.lengthParticipants() >= limitParticipantsByClient && !this.editing) {                
                dispatchShowAlert('error', "Límite de participantes", "Señor usuario, sólo se pueden agregar máximo 10 participantes por parte del cliente");
                return;
            }                        
            this.setState({ selectedContact: value, open: true });
            this.editing = false;
            this.handleSetInformation(value);            
        }
    }

    render() {
        const { contacts, participants, disabled, reducerGlobal } = this.props;
        const { open, selectedContact, selectedContactInformation } = this.state;

        let data = _.chain(participants.toArray()).map(participant => participant).filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_CLIENT)).value();

        return (
            <div className='participants-client'>
                <Row style={{ marginTop: 20, marginLeft: 7 }}>
                    <Col xs={11} md={11} lg={11} style={{ maxWidth: '96%', flexBasis: '96.7%' }}>
                        <ComboBox
                            name="txtContactoCliente"
                            labelInput="Seleccione..."
                            onChange={this.handleOnChange}
                            value={selectedContact}
                            valueProp={'id'}
                            textProp={'additional'}
                            data={contacts}
                            disabled={disabled ? 'disabled' : ''}
                        />
                    </Col>

                    <Col xs={1} md={1} lg={1} style={{ maxWidth: '3%', paddingRight: 20 }}>
                        {_.get(reducerGlobal.get('permissionsContacts'), _.indexOf(reducerGlobal.get('permissionsContacts'), CREAR), false) &&
                            <BotonCreateContactComponent typeButton={3} icon='plus circle' message='Crear contacto' disabled={disabled} />
                        }
                    </Col>
                </Row>


                <div className='participants-client-list'>
                    <Row>
                        {data.length > 0 ?
                            <Col xs={12} md={12} lg={12}>
                                <ListParticipantsByClient data={data} disabled={disabled} handleOpenModal={selectedRecord => {
                                    this.setState({ open: true, selectedContact: null });
                                    this.editing = true;
                                    this.handleSetInformation(selectedRecord);
                                }} />
                            </Col>
                            :
                            <Col xs={12} md={12} lg={12}>
                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                    <span className="form-item">Aún no se han adicionado participantes</span>
                                </div>
                            </Col>
                        }
                    </Row>
                </div>

                <Modal isOpen={open} onRequestClose={this.handleCloseModal} className="modalBt4-fade modal fade contact-detail-modal in" style={{ zIndex: 100 }}>
                    <div className="modalBt4-dialog modalBt4-lg" style={{ zIndex: 100 }}>
                        <div className="modalBt4-content modal-content" style={{ zIndex: 100 }}>
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Participante</h4>

                                <button type="button" onClick={this.handleCloseModal} className="close" data-dismiss="modal" role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            {selectedContactInformation &&
                                <ParticipantInformation selectedRecord={selectedContactInformation} handleCloseModal={this.handleCloseModal} addContact={this.addContact} />
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({ contactsByClient, participants, reducerGlobal }) => ({
    contacts: contactsByClient.get('contacts'),
    participants,
    reducerGlobal
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchContactsByClient: findContactsByClient,
        dispatchAddParticipant: addParticipant,
        dispatchClearParticipants: clearParticipants,
        dispatchShowAlert: swtShowMessage,
        dispatchValidatePermissionsByModule: validatePermissionsByModule,
        dispatchDeleteParticipant: deleteParticipant
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsByClient)