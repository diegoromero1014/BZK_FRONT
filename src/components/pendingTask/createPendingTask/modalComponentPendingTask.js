import React, { Component } from "react";
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import { reduxForm } from "redux-form";
import SweetAlert from "sweetalert-react";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import { createPendingTaskNew } from "./actions.js";
import { clearUserTaskCreate, clearUserTaskOrder, tasksByClientFindServer } from "../actions.js";
import { getMasterDataFields } from "../../selectsComponent/actions";
import Textarea from "../../../ui/textarea/textareaComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import { changeStateSaveData } from "../../dashboard/actions";
import { NUMBER_RECORDS } from "../constants";
import { MESSAGE_SAVE_DATA, VALUE_XSS_INVALID } from "../../../constantsGlobal";
import { TASK_STATUS } from "../../selectsComponent/constants";
import { redirectUrl } from "../../globalComponents/actions";
import { htmlToText, xssValidation } from '../../../actionsGlobal';
import RichText from '../../richText/richTextComponent';
import {swtShowMessage} from "../../sweetAlertMessages/actions";

import _ from "lodash";
import $ from "jquery";
import moment from "moment";

const fields = ["idEmployee", "responsable", "fecha", "tarea", "idEstado", "advance"];
var usersBanco = [];
var idUsuario, nameUsuario;

const validate = values => {
    const errors = {};
    if (!values.responsable) {
        errors.responsable = "Debe ingresar un valor";
    } else {
        errors.responsable = null;
    }
    if (!values.fecha) {
        errors.fecha = "Debe seleccionar una opción";
    } else {
        errors.fecha = null;
    }
    
    if (!values.tarea || _.isEmpty(htmlToText(values.tarea))) {
        errors.tarea = "Debe ingresar un valor";
    } else if (xssValidation(values.tarea, true)) {
        errors.tarea = VALUE_XSS_INVALID;
    } else {
        errors.tarea = null;
    }

    if (!values.idEstado) {
        errors.idEstado = "Debe ingresar un valor";
    } else {
        errors.idEstado = null;
    }

    if (xssValidation(values.advance)) {
        errors.advance = VALUE_XSS_INVALID;
    } else {
        errors.advance = null;
    }


    return errors;
};

class ModalComponentPendingTask extends Component {

    constructor(props) {
        super(props);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._handleCreatePendingTask = this._handleCreatePendingTask.bind(this);
        this.state = {
            showEx: false,
            showEr: false
        }
    }

    _updateValue(value) {
        const { fields: { responsable }, contactsByClient } = this.props;
        responsable.onChange(value);
    }

    componentWillMount() {
        const { getMasterDataFields } = this.props;
        this.props.resetForm();
        getMasterDataFields([TASK_STATUS]);
    }

    _closeCreate() {
        const { isOpen, clearUserTaskOrder, clearUserTaskCreate } = this.props;
        this.props.resetForm();
        this.setState({ showEx: false });
        isOpen();
        clearUserTaskOrder();
        clearUserTaskCreate();
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { responsable, idEmployee }, filterUsersBanco } = this.props;
        const selector = $('.ui.search.responsable');
        idEmployee.onChange(null);
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (responsable.value !== "" && responsable.value !== null && responsable.value !== undefined) {
                selector.toggleClass('loading');
                filterUsersBanco(responsable.value).then((data) => {
                    usersBanco = _.get(data, 'payload.data.data');
                    selector.search({
                        cache: false,
                        source: usersBanco,
                        maxResults: 1500,
                        searchFields: [
                            'title',
                            'description'
                        ],
                        onSelect: function (event) {
                            responsable.onChange(event.title);
                            idEmployee.onChange(event.idUsuario);
                            return 'default';
                        }
                    });
                    selector.toggleClass('loading');
                    selector.search('search local', responsable.value);
                    setTimeout(function () {
                        $('#inputParticipantBanc').focus();
                    }, 150);
                });
            }
        }
    }

    _handleCreatePendingTask() {
        const { createPendingTaskNew, tasksByClientFindServer, swtShowMessage } = this.props;
        const { fields: { responsable, fecha, idEmployee, idEstado, tarea, advance }, handleSubmit, error, changeStateSaveData } = this.props;
        if (moment(fecha.value, 'DD/MM/YYYY').isValid()) {
            const messageBody = {
                "clientId": window.localStorage.getItem('idClientSelected'),
                "task": tarea.value,
                "advance": advance.value,
                "status": idEstado.value,
                "closingDate": fecha.value !== '' && fecha.value !== null && fecha.value !== undefined ? moment(fecha.value, "DD/MM/YYYY").format('x') : null,
                "employeeName": responsable.value,
                "employeeId": idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null,
            };
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            createPendingTaskNew(messageBody).then((data) => {
                changeStateSaveData(false, "");
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                    redirectUrl("/login");
                } else {
                    if ((_.get(data, 'payload.data.status') === 200)) {
                        swtShowMessage('success','Creación de tarea','Señor usuario, la tarea se creó exitosamente.',{onConfirmCallback: this._closeCreate})
                        tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, "finalDate", 0, "");
                    } else {                       
                        swtShowMessage('error','Error creando la tarea',"Señor usuario, ocurrió un error creando la tarea.");
                    }
                }
            }, (reason) => {
                changeStateSaveData(false, "");
                this.setState({ showEr: true });
            });
        } else {
            fecha.onChange('');
        }
    }

    render() {
        const { fields: { responsable, fecha, idEstado, tarea, advance }, taskEdit, selectsReducer, handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreatePendingTask)}>
                
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <p style={{ paddingTop: "10px", marginBottom: "0px" }}>Los campos marcados con asterisco (<span
                            style={{ color: "red" }}>*</span>) son obligatorios.</p>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={12} md={4} lg={4}>
                                <dt><span>Fecha de cierre - DD/MM/YYYY (<span style={{ color: "red" }}>*</span>)</span>
                                </dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <DateTimePickerUi
                                        {...fecha}
                                        culture='es'
                                        format={"DD/MM/YYYY"}
                                        time={false}
                                    />
                                </dt>
                            </Col>
                            <Col xs={12} md={4} lg={4}>
                                <dt><span>Estado (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox name="idEstado"
                                        {...idEstado}
                                        valueProp={'id'}
                                        textProp={'value'}
                                        labelInput="Seleccione"
                                        data={selectsReducer.get(TASK_STATUS) || []}
                                    />
                                </dt>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 14px 0px 2px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Responsable (<span style={{ color: "red" }}>*</span>)</span></dt>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <ComboBoxFilter
                                    name="inputParticipantBanc"
                                    labelInput="Ingrese un criterio de búsqueda..."
                                    {...responsable}
                                    parentId="dashboardComponentScroll"
                                    onChange={responsable.onChange}
                                    value={responsable.value}
                                    onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                                    onSelect={val => this._updateValue(val)}
                                    max="255"
                                />
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 14px 0px 2px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Tarea (<span style={{ color: "red" }}>*</span>)</span></dt>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <RichText
                                    {...tarea}
                                    name="createTask"
                                    placeholder="Ingrese una tarea"
                                    style={{ width: '100%', height: '120px' }}
                                />
                            </Col>
                        </Row>
                        <Row style={{ padding: "20px 14px 0px 2px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Observaciones</span></dt>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <Textarea
                                    {...advance}
                                    name="advanceTask"
                                    type="text"
                                    max="1000"
                                    title="La longitud máxima de caracteres es de 1000"
                                    style={{ width: '100%', height: '120px' }}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit"
                        className="btn btn-primary modal-button-edit">Guardar
                    </button>
                </div>
                
                
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        filterUsersBanco,
        createPendingTaskNew,
        getMasterDataFields,
        clearUserTaskOrder,
        tasksByClientFindServer,
        clearUserTaskCreate,
        changeStateSaveData,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ tasksByClient, selectsReducer }, { taskEdit }) {
    return {
        tasksByClient,
        selectsReducer
    }
}


export default reduxForm({
    form: 'formPendingTask',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalComponentPendingTask);
