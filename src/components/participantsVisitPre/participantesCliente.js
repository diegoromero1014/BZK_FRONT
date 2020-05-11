import React, { Component } from 'react';
import ListParticipantesCliente from './listParticipantesCliente';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import _ from 'lodash';

import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import BotonCreateContactComponent from '../contact/createContact/botonCreateContactComponent';
import Tooltip from "../toolTip/toolTipComponent";

import { addParticipant } from './actions';
import { contactsByClientFindServer } from '../contact/actions';
import { downloadFilePdf } from '../clientInformation/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';

import { FILE_OPTION_SOCIAL_STYLE_CONTACT, NAME_FILE_SOCIAL_STYLE_CONTACT } from '../../constantsGlobal';
import { MODULE_CONTACTS, CREAR } from '../../constantsGlobal';
import { NUMBER_CONTACTS, KEY_PARTICIPANT_CLIENT } from './constants';
import { changeStateSaveData } from '../main/actions';

const validate = values => {
    const errors = {}
    return errors
};

var titleMessageSocialStyle = "Si la reunión será atendida por varias personas por parte del cliente ¿tiene "
    + "adaptada la conversación a los intereses y preocupaciones principales de cada uno? ¿Conoce cuáles son "
    + "esos intereses y preocupaciones?";

var disabledButtonCreate = '';
export class ParticipantesCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEmptyParticipant: false,
            showParticipantExist: false
        }
        this.addParticipantClient = this.addParticipantClient.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.downloadFileSocialStyle = this.downloadFileSocialStyle.bind(this);
    }

    addParticipantClient = () => {
        const { fields: { idContacto, nameContacto, contactoCliente, cargoContacto, estiloSocial, actitudGrupo }, participants, dispatchAddParticipant, dispatchSwtShowMessage } = this.props;
        if (contactoCliente.value !== "" && contactoCliente.value !== null && contactoCliente.value !== undefined) {
            var particip = participants.find(function (item) {
                return item.idParticipante === idContacto.value;
            });
            if (particip === undefined) {
                const uuid = _.uniqueId('participanClient_');
                var clientParticipant = {
                    tipoParticipante: KEY_PARTICIPANT_CLIENT,
                    idParticipante: idContacto.value,
                    nombreParticipante: nameContacto.value,
                    cargo: cargoContacto.value === null || cargoContacto.value === undefined || cargoContacto.value === '' ?
                        '' : ' - ' + cargoContacto.value,
                    empresa: '',
                    estiloSocial: estiloSocial.value === null || estiloSocial.value === undefined || estiloSocial.value === '' ?
                        '' : ' - ' + estiloSocial.value,
                    actitudBanco: actitudGrupo.value === null || actitudGrupo.value === undefined || actitudGrupo.value === '' ?
                        '' : ' - ' + actitudGrupo.value,
                    fecha: Date.now(),
                    uuid
                }
                dispatchAddParticipant(clientParticipant);
                idContacto.onChange('');
                nameContacto.onChange('');
                contactoCliente.onChange('');
                cargoContacto.onChange('');
                estiloSocial.onChange('');
                actitudGrupo.onChange('');
            } else {
                dispatchSwtShowMessage('error', "Participante existente", "Señor usuario, el participante que desea agregar ya se encuentra en la lista");
            }
        } else {
            dispatchSwtShowMessage('error', "Error participante", "Señor usuario, para agregar un participante debe seleccionar un contacto");
        }
    }

    downloadFileSocialStyle = () => {
        const { dispatchDownloadFilePdf, dispatchChangeStateSaveData, dispatchSwtShowMessage } = this.props;
        dispatchDownloadFilePdf(FILE_OPTION_SOCIAL_STYLE_CONTACT, NAME_FILE_SOCIAL_STYLE_CONTACT, dispatchChangeStateSaveData, dispatchSwtShowMessage);
    }

    componentWillMount() {
        const { dispatchContactsByClientFindServer, dispatchValidatePermissionsByModule } = this.props;

        this.props.resetForm();
        dispatchContactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_CONTACTS, "", 0, "", "", "", "", "");
        dispatchValidatePermissionsByModule(MODULE_CONTACTS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            } else {
                if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                    this.setState({ openMessagePermissions: true });
                }
            }
        });
    }

    updateValue = value => {
        const {
            fields: { idContacto, nameContacto, cargoContacto, estiloSocial, actitudGrupo }, contactsByClient
        } = this.props;

        var contactClient = contactsByClient.get('contacts');
        var contactSelected;
        _.map(contactClient, contact => {
            if (contact.id.toString() === value) {
                contactSelected = contact;
                return contact;
            }
        });

        if (contactSelected !== null && contactSelected !== undefined) {
            idContacto.onChange(contactSelected.id);
            nameContacto.onChange(contactSelected.nameComplet);
            cargoContacto.onChange(contactSelected.contactPosition);
            estiloSocial.onChange(contactSelected.contactSocialStyle);
            actitudGrupo.onChange(contactSelected.contactActitudeCompany);
        }
    }

    render() {
        const {
            fields: { contactoCliente, cargoContacto, estiloSocial, actitudGrupo }, reducerGlobal, participants,
            contactsByClient, disabled
        } = this.props;

        var numColumnList = 6;
        var data = _.chain(participants.toArray()).map(participant => {
            return participant;
        })
            .filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_CLIENT))
            .value();
        if (data.length === 10) {
            disabledButtonCreate = 'disabled';
        } else {
            disabledButtonCreate = '';
        }
        if (disabled === "disabled") {
            numColumnList = 12;
        }

        return (
            <div>
                <Row style={{ padding: "0px 10px 0px 10px" }}>
                    {disabled === '' || disabled === undefined ?
                        <Col xs={12} md={6} lg={6} style={{ paddingRight: "0px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Nombre (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt>
                                    <ComboBox
                                        name="txtContactoCliente"
                                        labelInput="Seleccione..."
                                        {...contactoCliente}
                                        onChange={val => this.updateValue(val)}
                                        valueProp={'id'}
                                        textProp={'nameComplet'}
                                        data={contactsByClient.get('contacts')}
                                        onComboChange={(val) => null}

                                    />
                                </dt>
                            </Col>
                            <Col xs={12} md={12} lg={12} style={{ paddingTop: "5px" }}>
                                <dt><span>Cargo</span></dt>
                                <dt>
                                    <Input
                                        name="txtCargo"
                                        {...cargoContacto}
                                        type="text"
                                        disabled="disabled"
                                    />
                                </dt>
                            </Col>
                            <Row style={{ padding: "5px 10px 0px 10px" }}>
                                <Col xs={12} md={6} lg={6}>
                                    <dt>
                                        <span>Estilo social </span>
                                        <Tooltip text={titleMessageSocialStyle}>
                                            <i className="help circle icon blue"
                                                style={{ fontSize: "14px", cursor: "pointer", marginLeft: "2px" }} />
                                        </Tooltip>
                                        <Tooltip text='Descargar archivo de estilo social'>
                                            <i onClick={this.downloadFileSocialStyle}
                                                style={{ marginLeft: "0px", cursor: "pointer", fontSize: "13px" }}
                                                className="red file pdf outline icon" />
                                        </Tooltip>
                                    </dt>
                                    <dt>
                                        <Input
                                            name="estiloSocial"
                                            {...estiloSocial}
                                            disabled="disabled"
                                            parentId="dashboardComponentScroll"
                                        />
                                    </dt>
                                </Col>
                                <Col xs={12} md={6} lg={6}>
                                    <dt><span>Actitud frente al grupo</span></dt>
                                    <dt>
                                        <Input
                                            name="actitudGrupo"
                                            {...actitudGrupo}
                                            disabled="disabled"
                                            parentId="dashboardComponentScroll"
                                        />
                                    </dt>
                                </Col>
                            </Row>
                            <Row style={{ paddingRight: "0px !important", paddingLeft: "0px", marginLeft: "10px" }}>
                                <Col xs={12} md={5} lg={5} style={{ paddingRight: "0px !important" }}>
                                    <button className="btn btn-primary" onClick={this.addParticipantClient}
                                        disabled={disabledButtonCreate}
                                        type="button" title="Adicionar participante, máximo 10"
                                        style={{ marginTop: "20px" }}>
                                        <i className="white plus icon" /> Agregar participante
                                    </button>
                                </Col>
                                {_.get(reducerGlobal.get('permissionsContacts'), _.indexOf(reducerGlobal.get('permissionsContacts'), CREAR), false) &&
                                    <BotonCreateContactComponent typeButton={1} />
                                }
                            </Row>
                        </Col>
                        : ''}
                    {data.length > 0 ?
                        <Col xs={12} md={numColumnList} lg={numColumnList}
                            style={{ paddingLeft: "5px", paddingTop: "10px" }}>
                            <ListParticipantesCliente disabled={disabled} />
                        </Col> :
                        <Col xs={12} md={numColumnList} lg={numColumnList}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">Aún no se han adicionado participantes</span>
                            </div>
                        </Col>
                    }
                </Row>


            </div>
        );
    }
}


const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchAddParticipant: addParticipant,
    dispatchContactsByClientFindServer: contactsByClientFindServer,
    dispatchValidatePermissionsByModule: validatePermissionsByModule,
    dispatchSwtShowMessage: swtShowMessage,
    dispatchDownloadFilePdf: downloadFilePdf,
    dispatchChangeStateSaveData: changeStateSaveData
}, dispatch);


const mapStateToProps = ({ selectsReducer, participants, contactsByClient, reducerGlobal }) => ({
    participants,
    selectsReducer,
    contactsByClient,
    reducerGlobal
})

export default reduxForm({
    form: 'submitValidation',
    fields: ["idContacto", "nameContacto", "contactoCliente", "cargoContacto", "estiloSocial", "actitudGrupo"],
    validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesCliente);