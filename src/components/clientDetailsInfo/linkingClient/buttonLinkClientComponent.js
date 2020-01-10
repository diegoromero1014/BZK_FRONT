import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import { isEmpty, isEqual, get, isNil } from 'lodash';
import LinkEntities from './LinkEntitiesComponent/linkEntities';
import Textarea from '../../../ui/textarea/textareaComponent';
import SecurityMessageComponent from '../../globalComponents/securityMessageComponent';
import { setEntities, clearEntities, saveLinkClient } from './LinkEntitiesComponent/actions';
import { updateErrorsLinkEntities } from '../../clientDetailsInfo/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { updateFieldInfoClient } from '../../clientInformation/actions';
import { consultStateBlackListClient, updateValuesBlackList } from './actions';
import { showLoading } from '../../loading/actions';
import { consultInfoClient } from '../../clientInformation/actions';
import { ENTITY_BANCOLOMBIA, ENTITY_VALORES_BANCOLOMBIA, HELP_LINK_MESSAGE } from './LinkEntitiesComponent/constants';
import { FILTER_TYPE_LBO_ID } from '../../selectsComponent/constants';
import { consultParameterServer } from "../../../actionsGlobal";
import { MAX_LENGTH_LINK_CLIENT_TRACER_CODE, NATURAL_PERSON } from "../../../constantsGlobal";
import {
    patternOfOnlyNumbersLinkClient, patternOfObservationLinkClient, patternOfForbiddenCharacter, regexHtmlInjection
} from './../../../validationsFields/patternsToValidateField';
import {
    MESSAGE_WARNING_ONLY_NUMBERS_LINK_CLIENT, MESSAGE_WARNING_MAX_LENGTH,
    MESSAGE_REQUIRED_VALUE, MESSAGE_ERROR_INJECTION_HTML
} from './../../../validationsFields/validationsMessages';
import { MAX_LENGTH_OBSERVATIONS } from '../constants';
import {
    checkRequired, checkMaxLength, checkObservationsLinkClient, checkFirstCharacter
} from './../../../validationsFields/rulesField';

const fields = [ 'observationTrader' ];

let helpLinksMessage = "";

export class ButtonLinkClientComponent extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this._handleSaveLinkingClient = this._handleSaveLinkingClient.bind(this);
        this._getListEntities = this._getListEntities.bind(this);
        this.state = {
            modalIsOpen: false,
            observationError: null
        };
    }

    openModal() {
        this.setState({ modalIsOpen: true });
        const {
            consultStateBlackListClient, infoClient,
            showLoading, swtShowMessage,
            updateValuesBlackList, consultInfoClient
        } = this.props;
        const jsonClientInfo = {
            customerId: get(infoClient, 'clientIdNumber'),
            customerFullName: get(infoClient, 'clientName'),
            customerTypeId: get(infoClient, 'clientNameType')
        };
        this._getListEntities();
        updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
        /** Se realiza el llamado de listas de control uno a uno para la vinculación **/
        showLoading(true, 'Cargando...');
        consultInfoClient();
        consultStateBlackListClient(jsonClientInfo).then((data) => {
            showLoading(false, '');
            if (!isEqual(get(data, 'payload.data.status'), 200)) {
                updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
                swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error consultando el cliente en listas de control.');
            }
        }, () => {
            updateValuesBlackList(get(infoClient, 'levelBlackList'), get(infoClient, 'messageBlackList'));
            showLoading(false, '');
            swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error consultando el cliente en listas de control.');
        });
    }

    closeModal() {
        const {
            fields: { observationTrader } } = this.props;
        this.setState({ modalIsOpen: false });
        this.props.updateValuesBlackList(null, null);
        this.props.updateErrorsLinkEntities(false);

        observationTrader.onChange('');
    }

    _handleSaveLinkingClient() {
        const {
            fields: { observationTrader }, infoClient, linkEntitiesClient, updateErrorsLinkEntities, swtShowMessage,
            saveLinkClient, showLoading, message, level, consultInfoClient
        } = this.props;

        let messageWhiteList = null;
        updateErrorsLinkEntities(false);
        let isValidLinkEntities = true;

        let listOfEntities = [];
        let inValidMessageLinkEntities = "Señor usuario, por favor ingrese todos los campos obligatorios.";

        let messageRequiredObservations;

        if ((!_.isNull(observationTrader.value) && isEmpty(observationTrader.value) && isEqual(infoClient.clientTypeKey, NATURAL_PERSON)) && infoClient.linkingRequestId == null) {
            messageRequiredObservations = checkRequired(observationTrader.value);
            isValidLinkEntities = false;
        } else if (!_.isNull(observationTrader.value) && !isEmpty(observationTrader.value) && observationTrader.value.length > MAX_LENGTH_OBSERVATIONS) {
            messageRequiredObservations = checkMaxLength(MAX_LENGTH_OBSERVATIONS);
            isValidLinkEntities = false;
        } else if (!_.isUndefined(observationTrader.value) && !_.isNull(observationTrader.value) && !_.isEmpty(observationTrader.value) && !patternOfObservationLinkClient.test(observationTrader.value)) {
            messageRequiredObservations = checkObservationsLinkClient(observationTrader.value);
            isValidLinkEntities = false;
        } else if (!_.isNil(observationTrader.value) && patternOfForbiddenCharacter.test(observationTrader.value)) {
            messageRequiredObservations = checkFirstCharacter(observationTrader.value);
            isValidLinkEntities = false;
        } else if (!_.isUndefined(observationTrader.value) && !_.isNull(observationTrader.value) && !_.isEmpty(observationTrader.value) && regexHtmlInjection.test(observationTrader.value)) {
            messageRequiredObservations = MESSAGE_ERROR_INJECTION_HTML;
            isValidLinkEntities = false;
        }

        if (!isValidLinkEntities) {
            this.setState({
                observationError: messageRequiredObservations
            });
        }

        const newListEntities = linkEntitiesClient.map(linkEntity => {

            if (listOfEntities.indexOf(linkEntity.entity) == -1) {
                listOfEntities.push(linkEntity.entity);
            } else {
                updateErrorsLinkEntities(true, "Error: Entidad/Linea de negocio duplicada");
                inValidMessageLinkEntities = "Señor usuario, por favor borre la(s) Entidad/Linea de negocio(s) duplicada(s)";
                isValidLinkEntities = false;
            }

            if (isEqual(linkEntity.entity, "") || isEqual(linkEntity.entity, null)) {
                updateErrorsLinkEntities(true, "Debe ingresar todos los campos");
                isValidLinkEntities = false;
            }

            if (isValidLinkEntities) {
                if (isEqual(ENTITY_BANCOLOMBIA.toLowerCase(), linkEntity.entityText.toLowerCase())
                    || isEqual(ENTITY_VALORES_BANCOLOMBIA.toLowerCase(), linkEntity.entityText.toLowerCase())) {
                    if (isEmpty(linkEntity.traderCode)) {
                        updateErrorsLinkEntities(true, "Debe ingresar todos los campos");
                        isValidLinkEntities = false;
                    } else if (!_.isUndefined(linkEntity.traderCode) && !_.isNull(linkEntity.traderCode) && !patternOfOnlyNumbersLinkClient.test(linkEntity.traderCode)) {
                        messageWhiteList = MESSAGE_WARNING_ONLY_NUMBERS_LINK_CLIENT;
                        updateErrorsLinkEntities(true, messageWhiteList);
                        isValidLinkEntities = false;
                    } else if (!_.isUndefined(linkEntity.traderCode) && !_.isNull(linkEntity.traderCode) && linkEntity.traderCode.length > MAX_LENGTH_LINK_CLIENT_TRACER_CODE) {
                        messageWhiteList = MESSAGE_WARNING_MAX_LENGTH(MAX_LENGTH_LINK_CLIENT_TRACER_CODE);
                        updateErrorsLinkEntities(true, messageWhiteList);
                        isValidLinkEntities = false;
                    } else if (!_.isNull(linkEntity.traderCode) && _.isEmpty(linkEntity.traderCode)) {
                        messageWhiteList = MESSAGE_REQUIRED_VALUE;
                        updateErrorsLinkEntities(true, messageWhiteList);
                        isValidLinkEntities = false;
                    }

                    return {
                        id: linkEntity.idEntity,
                        entity: linkEntity.entity,
                        traderCode: linkEntity.traderCode
                    }
                } else {
                    return {
                        id: linkEntity.idEntity,
                        entity: linkEntity.entity,
                        traderCode: null
                    }
                }
            } else {
                return {
                    entity: null,
                    traderCode: null
                }
            }
        });

        if (linkEntitiesClient.size == 0) {
            swtShowMessage('error', 'Vinculación', 'Señor usuario, debe ingresar por lo menos una entidad a vincular.');
        } else if (!isValidLinkEntities) {
            swtShowMessage('error', 'Vinculación', inValidMessageLinkEntities);
        } else {
            const jsonLinkEntityClient = {
                "idClient": infoClient.id,
                "idLinkRequest": infoClient.linkingRequestId,
                "observationTrader": infoClient.linkingRequestId == null ? observationTrader.value : '',
                "linkEntity": newListEntities.toArray(),
                "levelBlackList": level,
                "messageBlackList": message
            };
            showLoading(true, 'Guardando..');
            saveLinkClient(jsonLinkEntityClient)
                .then((data) => {
                    if ((_.get(data, 'payload.data.status') === 200)) {
                        consultInfoClient();
                        showLoading(false, '');
                        this.closeModal();
                        swtShowMessage('success', 'Vinculación', 'Señor usuario, la vinculación se guardó exitosamente.');
                    } else {
                        showLoading(false, '');
                        swtShowMessage('error', 'Vinculación', 'Señor usuario, ocurrió un error guardando la vinculación.');
                    }
                });

        }
    }

    _getListEntities() {
        const { infoClient, clearEntities, setEntities } = this.props;
        const listLinkEntitiesClient = get(infoClient, 'linkEntity', []);
        clearEntities();
        if (isNil(listLinkEntitiesClient)) {
            setEntities([]);
        } else {
            setEntities(listLinkEntitiesClient);
        }
    }

    componentWillMount() {
        const { getMasterDataFields, consultParameterServer } = this.props;
        getMasterDataFields([FILTER_TYPE_LBO_ID]);
        this._getListEntities();
        consultParameterServer(HELP_LINK_MESSAGE).then((data) => {
            if (data.payload.data.data !== null && data.payload.data.data !== "" && data.payload.data.data !== undefined) {
                helpLinksMessage = data.payload.data.data.value;
            }
        });
    }

    componentWillUnmount() {
        this.props.clearEntities();
    }

    render() {
        const { infoClient, fields: { observationTrader }, message, level } = this.props;
        const paddingButtons = { paddingRight: '7px', paddingLeft: '7px' };
        return (
            <Col style={paddingButtons}>
                <button className="btn" onClick={this.openModal}>
                    <span>Vincular</span></button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="modalBt4-fade modal fade contact-detail-modal in">
                    <div className="modalBt4-dialog modalBt4-lg">
                        <div className="modalBt4-content modal-content">
                            <div className="modalBt4-header modal-header">
                                <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }}
                                    id="myModalLabel">Vincular cliente</h4>
                                <button type="button" onClick={this.closeModal} className="close"
                                    data-dismiss="modal"
                                    role="close">
                                    <span className="modal-title" aria-hidden="true" role="close"><i
                                        className="remove icon modal-icon-close" role="close"></i></span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <SecurityMessageComponent />
                            <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                                style={{ padding: '20px 20px 20px 20px' }} id="containerModal">
                                <table style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th><span
                                                style={{ fontWeight: "bold", color: "#4C5360" }}>Tipo de documento</span>
                                            </th>
                                            <th><span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#4C5360"
                                                }}>Número de documento</span>
                                            </th>
                                            <th><span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#4C5360"
                                                }}>Nombre/Razón social</span>
                                            </th>
                                            <th><span style={{ fontWeight: "bold", color: "#4C5360" }}>Célula</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                <span style={{ marginLeft: "0px" }}>{infoClient.clientNameType}</span>
                                            </td>
                                            <td style={{ width: "25%", verticalAlign: "initial" }}>
                                                <span style={{ marginLeft: "0px" }}>{infoClient.clientIdNumber}</span>
                                            </td>
                                            <td style={{ width: "40%", verticalAlign: "initial" }}>
                                                <span style={{ marginLeft: "0px" }}>{infoClient.clientName}</span>
                                            </td>
                                            <td style={{ width: "10%", verticalAlign: "initial" }}>
                                                <span style={{ marginLeft: "0px" }}>{infoClient.celulaName}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    !isEmpty(infoClient.parameterKeepInMind) && !isEqual('n/a', infoClient.parameterKeepInMind.toLowerCase()) &&
                                    <Row style={{ padding: "20px 10px 10px 0px" }}>
                                        <Col xs={12} md={12} lg={12}>
                                            <h3>Tener en cuenta</h3>
                                            <p style={{ textAlign: 'justify' }}>{infoClient.parameterKeepInMind}</p>
                                        </Col>
                                    </Row>
                                }
                                <Row style={{ padding: "20px 10px 10px 0px" }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }} />
                                            <span
                                                className="title-middle">Entidades por las que se desea vincular</span>
                                        </div>
                                    </Col>
                                </Row>
                                <LinkEntities />
                                <Row style={{ padding: "20px 10px 10px 0px" }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }} />
                                            <span className="title-middle">Listas de control</span></div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={4} lg={4}>
                                        <h4>Nivel</h4>
                                        <span style={{ textAlign: 'justify' }}>{level}</span>
                                    </Col>
                                    <Col xs={12} md={8} lg={8}>
                                        <h4>Mensaje</h4>
                                        <p style={{ textAlign: 'justify' }}>
                                            {message}
                                        </p>
                                    </Col>
                                </Row>
                                <Row style={{ padding: "20px 10px 10px 0px" }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <div style={{
                                            fontSize: "25px",
                                            color: "#CEA70B",
                                            marginTop: "5px",
                                            marginBottom: "5px"
                                        }}>
                                            <div className="tab-content-row" style={{
                                                borderTop: "1px dotted #cea70b",
                                                width: "100%",
                                                marginBottom: "10px"
                                            }} />
                                            {isEqual(infoClient.clientTypeKey, NATURAL_PERSON) ?
                                                <span className="title-middle">Observaciones/Justificación de vinculación PN</span>
                                                :
                                                <span className="title-middle">Observaciones</span>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ paddingBottom: '10px' }}>
                                    <Col xs={12} md={12} lg={12}>
                                        <h4>Observación vinculación</h4>
                                        {isEmpty(infoClient.observationAdmin) ?
                                            <p>Sin observación.</p>
                                            :
                                            <p style={{ textAlign: 'justify' }}>{infoClient.observationAdmin}</p>
                                        }
                                    </Col>
                                </Row>
                                {infoClient.linkingRequestId == null &&
                                    <Row style={{ paddingBottom: '10px' }}>
                                        <Col xs={12} md={12} lg={12}>
                                            <dt>
                                                <span>Observación </span>
                                                {
                                                    isEqual(infoClient.clientTypeKey, NATURAL_PERSON) &&
                                                    <span>(<span style={{ color: "red" }}>*</span>)</span>
                                                }
                                            </dt>
                                            <div>
                                                <Textarea
                                                    {...observationTrader}
                                                    name="actionArea"
                                                    type="text"
                                                    style={{ width: '100%', height: '100%', textAlign: 'justify' }}
                                                    max="1000"
                                                    rows={3}
                                                    touched={true}
                                                    error={this.state.observationError}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                }
                            </div>
                            <div className="modalBt4-footer modal-footer">
                                <Row >
                                    <Col xs={9} md={9} lg={9}>
                                        <div style={{ textAlign: "left", fontStyle: "italic" }} >
                                            <span>{helpLinksMessage}</span>
                                        </div>
                                    </Col>
                                    <Col xs={3} md={3} lg={3}>
                                        <button type="button" onClick={this._handleSaveLinkingClient}
                                            className="btn btn-primary modal-button-edit">Guardar
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Modal>
            </Col>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setEntities,
        clearEntities,
        updateErrorsLinkEntities,
        swtShowMessage,
        saveLinkClient,
        getMasterDataFields,
        updateFieldInfoClient,
        consultStateBlackListClient,
        showLoading,
        updateValuesBlackList,
        consultInfoClient,
        consultParameterServer
    }, dispatch);
}

function mapStateToProps({ linkEntitiesClient, tabReducer, selectsReducer, blackListClient }, { infoClient }) {
    const isValidLinkEntities = !tabReducer.get('errorEditLinkEntitiesClient');
    const message = _.isEmpty(blackListClient.get('message')) ? '' : blackListClient.get('message');
    const level = _.isEmpty(blackListClient.get('level')) ? '' : blackListClient.get('level');
    return {
        message,
        level,
        selectsReducer,
        linkEntitiesClient,
        isValidLinkEntities,
        infoClient,
        initialValues: {
            observationTrader: ''
        }
    };

}

export default reduxForm({
    form: 'submitModalLinkClient',
    fields
}, mapStateToProps, mapDispatchToProps)(ButtonLinkClientComponent);