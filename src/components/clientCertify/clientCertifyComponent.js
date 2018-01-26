import React from 'react'

import {goBack, redirectUrl} from "../globalComponents/actions";
import {Col, Row} from "react-flexbox-grid";
import {
    clearValuesAdressess, consultDataSelect, consultList, consultListWithParameter,
    consultListWithParameterUbication, economicGroupsByKeyword, getMasterDataFields
} from "../selectsComponent/actions";
import * as constants from "../selectsComponent/constants";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../ui/comboBoxFilter/comboBoxFilter";
import $ from "jquery";

import {
    GOVERNMENT, FINANCIAL_INSTITUTIONS, CONSTRUCT_PYME, KEY_DESMONTE,
    KEY_EXCEPCION, KEY_EXCEPCION_NO_GERENCIADO, KEY_EXCEPCION_NO_NECESITA_LME,
    KEY_OPTION_OTHER_OPERATIONS_FOREIGNS, KEY_OPTION_OTHER_ORIGIN_GOODS,
    KEY_OPTION_OTHER_ORIGIN_RESOURCE, MAXIMUM_OPERATIONS_FOREIGNS, TITLE_DESCRIPTION
} from "./constants";

const fields = [
    'economicGroupName', 'economicGroupName', 'nitPrincipal', 'groupEconomic', 'marcGeren', 'justifyNoGeren', 
    'centroDecision', 'necesitaLME', 'justifyNoLME', 'justifyExClient'
]
//Data para los select de respuesta "Si" - "No"
const valuesYesNo = [
    { 'id': '', 'value': "Seleccione..." },
    { 'id': true, 'value': "Si" },
    { 'id': false, 'value': "No" }
];

const validate = (values, props) => {
    const errors = {}

    return errors;
}


let infoMarcaGeren = true;
var initValueJustifyNonGeren = false;
var initValueJustifyNonLME = false;

//Componente genérico para cargar los selects de justificación
function SelectsJustificacion(props) {
    if (props.visible !== undefined && props.visible !== null && props.visible.toString() === "false") {
        return <Col xs={12} md={4} lg={4}>
            <dt>
                {props.title}
            </dt>
            <dt>
                <ComboBox
                    labelInput={props.labelInput}
                    onBlur={props.onBlur}
                    valueProp={props.valueProp}
                    textProp={props.textProp}
                    {...props.justify}
                    data={props.data}
                    touched={true}
                    parentId="dashboardComponentScroll"
                    onChange={props.onChange}
                />
            </dt>
        </Col>;
    } else {
        return <div></div>;
    }
}

class clientCertify extends React.Component {

    constructor(props) {
        super(props)

        this._onChangeGroupEconomic = this._onChangeGroupEconomic.bind(this)
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this)
        this._onChangeMarcGeren = this._onChangeMarcGeren.bind(this);
        this._onChangeJustifyNoGeren = this._onChangeJustifyNoGeren.bind(this);
        this._onChangeValueNeedLME = this._onChangeValueNeedLME.bind(this);
        this._onChangeValueJustifyNoNeedLME = this._onChangeValueJustifyNoNeedLME.bind(this);

    }

    componentWillMount() {

        const { clientInformacion } = this.props; 

        var infoClient = clientInformacion.get('responseClientInfo');

        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        } else {
            if (_.isEmpty(infoClient)) {
                
                redirectUrl("/dashboard/clientInformation");

            }

        }
    }

    _onConfirmExit() {
        goBack();
    }

    _onChangeGroupEconomic(e) {
        const { fields: { economicGroupName, nitPrincipal, groupEconomic }, economicGroupsByKeyword } = this.props;
        if (_.isNil(e.target.value) || _.isEqual(e.target.value, "")) {
            nitPrincipal.onChange("");
            groupEconomic.onChange('');
        }
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            economicGroupsByKeyword(economicGroupName.value);
            economicGroupName.onChange('');
            groupEconomic.onChange('');
        } else {
            economicGroupName.onChange(e.target.value);
        }
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { groupEconomic, economicGroupName, nitPrincipal }, economicGroupsByKeyword } = this.props;
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            groupEconomic.onChange('');
            nitPrincipal.onChange('');
            e.preventDefault();
            if (economicGroupName.value !== "" && economicGroupName.value !== null && economicGroupName.value !== undefined) {
                $('.ui.search.participantBanc').toggleClass('loading');
                economicGroupsByKeyword(economicGroupName.value).then((data) => {
                        let economicGroup1 = _.get(data, 'payload.data.messageBody.economicGroupValueObjects');
                        let economicGroup2 = _.forEach(economicGroup1, function (data1) {
                            data1.title = data1.group;
                            data1.description = data1.nitPrincipal != null ? data1.nitPrincipal : '';
                        });
                        $('.ui.search.participantBanc')
                            .search({
                                cache: false,
                                source: economicGroup1,
                                searchFields: [
                                    'title',
                                    'description',
                                    'id',
                                    'relationshipManagerId'
                                ],
                                onSelect: function (event) {
                                    economicGroupName.onChange(event.group);
                                    groupEconomic.onChange(event.id);
                                    nitPrincipal.onChange(event.nitPrincipal);
                                    return 'default';
                                }
                            });
                        $('.ui.search.participantBanc').toggleClass('loading');
                        $('.prompt').focus();
                    }
                );
            }
        }
    }

    _onChangeMarcGeren(val) {
        if (!infoMarcaGeren && val === 'true') {
            var dataTypeNote, idExcepcionNoGerenciado;
            const { selectsReducer, deleteNote, notes, updateErrorsNotes } = this.props;
            dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            idExcepcionNoGerenciado = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_GERENCIADO]), '[0].id');
            const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                    deleteNote(note.uid);
                    return false;
                } else {
                    return true
                }
            });
            let isValidNotesDescription = true;
            _.forEach(notesWithoutNoGeren, (note) => {
                isValidNotesDescription = !_.isEmpty(note.body)
            });
            if (isValidNotesDescription) {
                updateErrorsNotes(false);
            }
        } else {
            infoMarcaGeren = false;
        }
        if (val === 'true' || val === true && initValueJustifyNonGeren) {
            const { fields: { justifyNoGeren } } = this.props;
            justifyNoGeren.onChange('');
        } else {
            initValueJustifyNonGeren = true;
        }
    }


    _onChangeJustifyNoGeren(val) {
        const { selectsReducer, clientInformacion, notes, updateErrorsNotes, setNotes, deleteNote } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        if (!infoJustificationForNoRM || infoClient.justificationForNoRM !== val) {
            let dataJustifyNoGeren = selectsReducer.get(constants.JUSTIFICATION_NO_RM);
            let keyJustify = _.get(_.filter(dataJustifyNoGeren, ['id', parseInt(val)]), '[0].key');
            let dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            let idExcepcionNoGerenciado = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_GERENCIADO]), '[0].id');
            if (keyJustify === KEY_DESMONTE) {
                oldJustifyGeren = KEY_DESMONTE;
                if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
                    let hasNotesNoGeren = false;
                    _.forEach(notes.toArray(), (note) => {
                        if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                            hasNotesNoGeren = true;
                        }
                    });

                    if (notes.size === 0 || !hasNotesNoGeren) {
                        var noteObligatory = [];
                        noteObligatory.push({
                            typeOfNote: idExcepcionNoGerenciado,
                            typeOfNoteKey: KEY_EXCEPCION_NO_GERENCIADO,
                            note: ''
                        });
                        setNotes(noteObligatory);
                    }
                }
            }
            if (oldJustifyGeren === KEY_DESMONTE && keyJustify !== KEY_DESMONTE) {
                oldJustifyGeren = val;
                const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                    if (idExcepcionNoGerenciado === parseInt(note.combo)) {
                        deleteNote(note.uid);
                        return false;
                    } else {
                        return true
                    }
                });
                let isValidNotesDescription = true;
                _.forEach(notesWithoutNoGeren, (note) => {
                    isValidNotesDescription = !_.isEmpty(note.body)
                });
                if (isValidNotesDescription) {
                    updateErrorsNotes(false);
                }
            }
        } else {
            infoJustificationForNoRM = false;
            oldJustifyGeren = KEY_DESMONTE;
        }
    }


    _onChangeValueNeedLME(val) {
        const {
            fields: { necesitaLME, justifyNoLME }, clientInformacion,
            selectsReducer, deleteNote, notes, updateErrorsNotes
        } = this.props;
        if (val === 'true' || val && initValueJustifyNonLME) {
            justifyNoLME.onChange('');
            const dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            const idNotNeedExceptionLME = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_NECESITA_LME]), '[0].id');
            var notesWithoutNoNeedLME = _.remove(notes.toArray(), (note) => {
                if (idNotNeedExceptionLME === parseInt(note.combo)) {
                    deleteNote(note.uid);
                    return false;
                } else {
                    return true
                }
            });
            let isValidNotesDescription = true;
            _.forEach(notesWithoutNoNeedLME, (note) => {
                isValidNotesDescription = !_.isEmpty(note.body)
            });
            if (isValidNotesDescription) {
                updateErrorsNotes(false);
            }
            justifyNoLME.onChange('');
        } else {
            initValueJustifyNonLME = true;
        }
        necesitaLME.onChange(val);
    }

    _onChangeValueJustifyNoNeedLME(val) {
        const { selectsReducer, clientInformacion, notes, updateErrorsNotes, setNotes, deleteNote } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        if (!infoJustificationNeedLME || infoClient.justificationForCreditNeed !== val) {
            let dataJustifyNoNeedLME = selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED);
            let keyJustify = _.get(_.filter(dataJustifyNoNeedLME, ['id', parseInt(val)]), '[0].key');
            let dataTypeNote = selectsReducer.get(constants.TYPE_NOTES);
            let idExeptionNoNeedLME = _.get(_.filter(dataTypeNote, ['key', KEY_EXCEPCION_NO_NECESITA_LME]), '[0].id');
            if (keyJustify === KEY_EXCEPCION) {
                oldJustifyNoNeedLME = KEY_EXCEPCION;
                if (infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== '') {
                    let hasNotesNoGeren = false;
                    _.forEach(notes.toArray(), (note) => {
                        if (idExeptionNoNeedLME === parseInt(note.combo)) {
                            hasNotesNoGeren = true;
                        }
                    });
                    if (notes.size === 0 || !hasNotesNoGeren) {
                        const noteObligatory = [];
                        noteObligatory.push({
                            typeOfNote: idExeptionNoNeedLME,
                            typeOfNoteKey: KEY_EXCEPCION_NO_NECESITA_LME,
                            note: ''
                        });
                        setNotes(noteObligatory);
                    }
                }
            }
            if (oldJustifyNoNeedLME === KEY_EXCEPCION && keyJustify !== KEY_EXCEPCION) {
                oldJustifyNoNeedLME = val;
                const notesWithoutNoGeren = _.remove(notes.toArray(), (note) => {
                    if (idExeptionNoNeedLME === parseInt(note.combo)) {
                        deleteNote(note.uid);
                        return false;
                    } else {
                        return true
                    }
                });
                let isValidNotesDescription = true;
                _.forEach(notesWithoutNoGeren, (note) => {
                    isValidNotesDescription = !_.isEmpty(note.body)
                });
                if (isValidNotesDescription) {
                    updateErrorsNotes(false);
                }
            }
        } else {
            infoJustificationNeedLME = false;
            oldJustifyNoNeedLME = KEY_EXCEPCION;
        }
    }
    
    render(){

        const { fields: { nitPrincipal, economicGroupName, originGoods, originResource, operationsForeigns, marcGeren, justifyNoGeren, centroDecision, necesitaLME, justifyNoLME, justifyExClient }, clientInformacion, selectsReducer } = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        console.log(infoClient)
        const allowChangeEconomicGroup = !infoClient.allowChangeEconomicGroup ? 'disabled' : '';

        return (
            <div>
    <Row style={{ padding: "20px 10px 10px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row"
                                style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="book icon" style={{ fontSize: "25px" }} />
                            <span className="title-middle"> Datos de conocimiento comercial</span>
                        </div>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Grupo económico/relación </span>
                            
                        </dt>
                        <dt>
                            <div className="ui search participantBanc fluid">
                                <ComboBoxFilter className="prompt" id="inputEconomicGroup"
                                    style={{ borderRadius: "3px" }}
                                                autoComplete="off"
                                                disabled={allowChangeEconomicGroup}
                                                type="text"
                                                {...economicGroupName}
                                                value={economicGroupName.value}
                                                onChange={this._onChangeGroupEconomic}
                                                placeholder="Ingrese un criterio de búsqueda..."
                                                onKeyPress={this.updateKeyValueUsersBanco}
                                                touched={true}
                                />
                            </div>
                        </dt>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>NIT principal </span>
                            
                        </dt>
                        <dt style={{ marginTop: '8px' }}>
                            <span style={{ fontWeight: 'normal' }}>{nitPrincipal.value}</span>
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4} style={{ paddingRight: "10px" }}>
                        <dt>
                            <span>Marca gerenciamiento </span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                name="marcGeren"
                                labelInput="Seleccione marca..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                {...marcGeren}
                                onChange={val => this._onChangeMarcGeren(val)}
                                touched={true}
                            />
                        </dt>
                    </Col>
                    <SelectsJustificacion
                        visible={marcGeren.value}
                        title="Justificación no gerenciamiento"
                        labelInput="Seleccione..."
                        value={justifyNoGeren.value}
                        onBlur={justifyNoGeren.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        parentId="dashboardComponentScroll"
                        justify={justifyNoGeren}
                        obligatory={true}
                        data={selectsReducer.get(constants.JUSTIFICATION_NO_RM) || []}
                        onChange={val => this._onChangeJustifyNoGeren(val)}
                        touched={true}
                    />
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>Centro de decisión </span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                name="centroDecision"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                {...centroDecision}
                                touched={true}
                            />
                        </dt>
                    </Col>
                </Row>
                <Row style={{ padding: "0px 10px 20px 20px" }}>
                    <Col xs={12} md={4} lg={4}>
                        <dt>
                            <span>¿Necesita LME? </span> {!infoClient.isProspect &&
                                <div style={{ display: "inline" }}></div>}
                        </dt>
                        <dt>
                            <ComboBox
                                labelInput="Seleccione..."
                                {...necesitaLME}
                                value={necesitaLME.value}
                                onBlur={necesitaLME.onBlur}
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={valuesYesNo}
                                touched={true}
                                onChange={val => this._onChangeValueNeedLME(val)}
                            />
                        </dt>
                    </Col>
                    <SelectsJustificacion
                        visible={necesitaLME.value}
                        title="Justificación no necesita LME"
                        labelInput="Seleccione..."
                        value={justifyNoLME.value}
                        onBlur={justifyNoLME.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        justify={justifyNoLME}
                        obligatory={true}
                        data={selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED) || []}
                        onChange={val => this._onChangeValueJustifyNoNeedLME(val)}
                        touched={true}
                    />
                    <SelectsJustificacion
                        visible={'false'}
                        title="Justificación excliente"
                        labelInput="Seleccione..."
                        value={justifyExClient.value}
                        onBlur={justifyExClient.onBlur}
                        valueProp={"id"}
                        textProp={"value"}
                        justify={justifyExClient}
                        obligatory={false}
                        data={selectsReducer.get(constants.JUSTIFICATION_LOST_CLIENT) || []}
                        onChange={justifyExClient.onChange}
                        touched={true}
                    />
                </Row>
                <div className="" style={{
                    marginTop: "50px",
                    position: "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: "100%",
                    marginBottom: "0px",
                    backgroundColor: "#F8F8F8",
                    height: "50px",
                    background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "400px", height: "100%", position: "fixed", right: "0px" }}>
                        
                            <button className="btn"
                                style={{ float: "right", margin: "8px 0px 0px 120px", position: "fixed" }}
                                    onClick={this.clickButtonScrollTop} type="submit">
                                <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                            </button>
                        
                        <button className="btn btn-secondary modal-button-edit" onClick={this._closeWindow} style={{
                            float: "right",
                            margin: "8px 0px 0px 250px",
                            position: "fixed",
                            backgroundColor: "#C1C1C1"
                        }} type="button">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps({ clientInformacion, selectsReducer }, ownProps ) {
    const infoClient = clientInformacion.get('responseClientInfo');
    const { contextClient } = infoClient;

    return {
        clientInformacion,
        selectsReducer
    }
}

function mapDispatchToProps(dispatch) {
      return bindActionCreators ({
        economicGroupsByKeyword
      }, dispatch)
}


export default reduxForm({
    form: 'clientCertify',
    fields, 
    validate
}, mapStateToProps, mapDispatchToProps)(clientCertify)
