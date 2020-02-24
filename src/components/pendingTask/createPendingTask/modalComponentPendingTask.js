import React, { Component } from "react";
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import { reduxForm } from "redux-form";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import { createPendingTaskNew } from "./actions.js";
import { clearUserTaskCreate, clearUserTaskOrder, tasksByClientFindServer } from "../actions.js";
import { getMasterDataFields } from "../../selectsComponent/actions";
import Textarea from "../../../ui/textarea/textareaComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import { changeStateSaveData } from "../../dashboard/actions";
import { NUMBER_RECORDS } from "../constants";
import { MESSAGE_SAVE_DATA, REQUEST_SUCCESS, REQUEST_INVALID_INPUT } from "../../../constantsGlobal";
import { TASK_STATUS } from "../../selectsComponent/constants";
import { redirectUrl } from "../../globalComponents/actions";
import RichText from '../../richText/richTextComponent';
import {swtShowMessage} from "../../sweetAlertMessages/actions";
import { fields, validations as validate } from './fieldsAndRulesForReduxForm';

import _ from "lodash";
import $ from "jquery";
import moment from "moment";
import CommentsComponent from "../../globalComponents/comments/commentsComponent";

var usersBanco = [];
var idUsuario, nameUsuario;


class ModalComponentPendingTask extends Component {

    constructor(props) {
        super(props);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._handleCreatePendingTask = this._handleCreatePendingTask.bind(this);
        this.processValidation =this.processValidation.bind(this);
        this.notes = [
            {
                id: 3123123,
                initials: 'MC',
                author: 'Monica Castillo',
                createdTimestamp: 1517597630576,
                content: 'Recuerda hacer la diligencia a la dirección pactada',
                replies: [
                    {
                        id: 48489477,
                        initials: 'CR',
                        author: 'Cristhian Rios',
                        createdTimestamp: 1517597630576,
                        content: 'Ya está listo',
                    },
                    {
                        id: 4890984,
                        initials: 'AA',
                        author: 'Alvaro Agudelo',
                        createdTimestamp: 1517597630576,
                        content: 'Moni, tenemos un inconveniente.',
                    }
                ]
            },
            {
                id: 43223,
                initials: 'DG',
                author: 'Daniel Gallego',
                createdTimestamp: 1517597630576,
                content: 'Enterado'
            },
        ]
        this.state = {
            showEx: false,
            showEr: false,
            tareaError: null
        }
    }

    _updateValue(value) {
        const { fields: { responsable } } = this.props;
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
        const { fields: { responsable, idEmployee }, filterUsersBanco, swtShowMessage } = this.props;
        const selector = $('.ui.search.responsable');
       
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (responsable.value !== "" && responsable.value !== null && responsable.value !== undefined) {
                if(responsable.value.length < 3) {
                    swtShowMessage('error','Error','Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                    return;
                }
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
        const { fields: { responsable, fecha, idEmployee, idEstado, tarea, advance }, changeStateSaveData } = this.props;
        if (moment(fecha.value, 'DD/MM/YYYY').isValid()) {
            const messageBody = {
                "clientId": window.sessionStorage.getItem('idClientSelected'),
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
                    
                    if ((_.get(data, 'payload.data.status') === REQUEST_SUCCESS)) {
                        swtShowMessage('success','Creación de tarea','Señor usuario, la tarea se creó exitosamente.',{onConfirmCallback: this._closeCreate})
                        tasksByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "finalDate", 0, "");
                    } else { 
                        
                        if ((_.get(data, 'payload.data.status') === REQUEST_INVALID_INPUT)) {
                            
                            const validationsErrorFromServer = _.get(data, 'payload.data.data[0].detail');
                                _.forEach(validationsErrorFromServer, (field) => {
                                this.processValidation(field);
                            });
                        } else {
                                         
                            swtShowMessage('error','Error creando la tarea',"Señor usuario, ocurrió un error creando la tarea.");
                        }
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
    processValidation(field) {
        if (field) {
            switch (field.field) {
                case "task":
                    this.setState({ tareaError: field.message[0] });
                    break;   
                default:
                    break;
            }
        }
    }
    render() {
        const { fields: { responsable, fecha, idEstado, tarea, advance, idEmployee }, selectsReducer, handleSubmit } = this.props;
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
                                    onChange={(val) => {if (idEmployee.value) { idEmployee.onChange(null) } responsable.onChange(val)}}
                                    value={responsable.value}
                                    onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                                    onSelect={val => this._updateValue(val)}
                                    error={responsable.error || idEmployee.error}
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
                                    error={this.state.tareaError||tarea.error}
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
                        <Row style={{ padding: "20px 10px 0px 0px" }}>
                            <Col xs={12} md={12} lg={12}>
                                <CommentsComponent header="Notas"/>
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

function mapStateToProps({ tasksByClient, selectsReducer }) {
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
