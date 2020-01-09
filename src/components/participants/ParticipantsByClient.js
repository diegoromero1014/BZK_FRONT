import React, { Component } from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { findContactsByClient } from '../contact/actions';
import { addParticipant, clearParticipants } from './actions';
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
    }

    componentWillMount() {
        const { dispatchContactsByClient, dispatchValidatePermissionsByModule } = this.props;

        dispatchContactsByClient(window.sessionStorage.getItem('idClientSelected'), NUMBER_CONTACTS);
        dispatchValidatePermissionsByModule(MODULE_CONTACTS);
    }

    handleSetInformation = selectedContact => {
        const { contacts } = this.props;

        const existingContact = contacts.filter(element => element.id === Number(selectedContact))[0];            

        if(existingContact) {
            this.setState({ selectedContactInformation: existingContact });
        }
    }

    addContact = () => {        
        const { dispatchAddParticipant, participants, contacts, dispatchShowAlert, limitParticipantsByClient } = this.props;
        const { selectedContact } = this.state;        
        if (selectedContact) {       
                 
            if (limitParticipantsByClient && participants.toArray().filter(participant => participant.tipoParticipante === KEY_PARTICIPANT_CLIENT).length >= limitParticipantsByClient) {
                dispatchShowAlert('error', "Límite de participantes", "Señor usuario, sólo se pueden agregar máximo 10 participantes por parte del cliente");
                return;
            }
            let existingContact = participants.find(element => element.idParticipante === Number(selectedContact));            

            if (!existingContact) {
                let contact = contacts.filter(element => element.id === Number(selectedContact))[0];                
                let participant = {
                    tipoParticipante: KEY_PARTICIPANT_CLIENT,
                    idParticipante: contact.id,
                    nombreParticipante: contact.nameComplet,
                    cargo: !contact.contactPosition ? '' : contact.contactPosition,
                    empresa: '',
                    estiloSocial: !contact.contactSocialStyle ? '' : contact.contactSocialStyle,
                    actitudBanco: !contact.contactActitudeCompany ? '' : contact.contactActitudeCompany,
                    fecha: Date.now(),
                    uuid: _.uniqueId('participanClient_')
                }

                dispatchAddParticipant(participant);
                this.setState({ selectedContact: '' });
            } else {                
                dispatchShowAlert('error', "Participante existente", "Señor usuario, el participante que desea agregar ya se encuentra en la lista");
            }
        }

    }

    handleCloseModal = () => this.setState({ open: false, selectedContactInformation: null, selectedContact: null });

    render() {
        const { contacts, participants, disabled, reducerGlobal } = this.props;
        const { open, selectedContact, selectedContactInformation } = this.state;

        let data = _.chain(participants.toArray()).map(participant => participant).filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_CLIENT)).value();

        return (
            <div className='participants-client'>
                <Row style={{ marginTop: 20, marginLeft: 7 }}>
                    <Col xs={11} md={11} lg={11} style={{ maxWidth: '97%', flexBasis: '99.666667%' }}>
                        <ComboBox
                            name="txtContactoCliente"
                            labelInput="Seleccione..."
                            onChange={value => {
                                this.setState({ selectedContact: value });

                                //Habilita el modal

                                //this.setState({ selectedContact: value, open: true });
                                //this.handleSetInformation(value);
                                this.addContact();
                            }}
                            value={selectedContact}
                            valueProp={'id'}
                            textProp={'additional'}
                            data={contacts}
                            disabled={disabled ? 'disabled' : ''}
                        />
                    </Col>

                    <Col xs={1} md={1} lg={1} style={{ maxWidth: '2%' }}>
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
                                    //Habilita el modal
                                    //this.setState({ open: true, selectedContact: null });
                                    //this.handleSetInformation(selectedRecord);
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
                                <ParticipantInformation selectedRecord={selectedContactInformation} />
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
        dispatchValidatePermissionsByModule: validatePermissionsByModule
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsByClient)