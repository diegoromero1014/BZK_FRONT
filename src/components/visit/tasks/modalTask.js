import React, {Component} from "react";
import moment from "moment";
import {reduxForm} from "redux-form";
import {bindActionCreators} from "redux";
import {Col, Row} from "react-flexbox-grid";
import _ from "lodash";
import $ from "jquery";

import momentLocalizer from "react-widgets/lib/localizers/moment";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import RichText from "../../richText/richTextComponent";

import {addTask, editTask} from "./actions";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {htmlToText} from "../../../actionsGlobal";
import {swtShowMessage} from "../../sweetAlertMessages/actions";

import {fields, validations as validate} from './rulesAndFieldsTaskVisit';
import CommentsComponent from "../../globalComponents/comments/commentsComponent";
import {fillComments} from "../../globalComponents/comments/actions";
import {REQUEST_SUCCESS} from "../../../constantsGlobal";
import {getTaskNotesByUserTaskId, saveTaskNote} from "../../pendingTask/createPendingTask/actions";


var usersBanco = [];
var idUsuario, nameUsuario;

export class ModalTask extends Component {

    constructor(props) {
        super(props);
        this._closeCreate = this._closeCreate.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this._handleCreateTask = this._handleCreateTask.bind(this);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this.state = {
            showSuccessAdd: false,
            showSuccessEdit: false,
            showEr: false,
            prueba: [],
            showErrorYa: false,
            nameAsignator: window.localStorage.getItem('name')
        };
        this.errorTask = null;
        momentLocalizer(moment);
    }

    async componentDidMount() {
        const {fields: {idEmployee, responsable, fecha, tarea, id}, taskEdit, dispatchFillComments} = this.props;
        if (taskEdit !== undefined) {
            id.onChange(taskEdit.id);
            idEmployee.onChange(taskEdit.idResponsable);
            responsable.onChange(taskEdit.responsable);
            tarea.onChange(taskEdit.tarea);
            fecha.onChange(moment(taskEdit.fechaForm, 'DD/MM/YYYY'));
            if(id.value)
                await this.getTaskNotesByUserTaskId();
            else
                dispatchFillComments(taskEdit.notes);
            this.setState({
                nameAsignator: taskEdit.taskAsignator
            })
        }
    }

    _closeCreate() {
        const {isOpen, taskEdit} = this.props;
        if (taskEdit !== undefined) {
            // Esto se puede borrar
            this.setState({
                showSuccessEdit: false
            });
        } else {
            // Esto se puede borrar
            this.setState({
                showSuccessAdd: false
            });
        }
        isOpen();
        this.props.resetForm();
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { responsable, idEmployee }, filterUsersBancoDispatch, dispatchSwtShowMessage } = this.props;
        const selector = $('.ui.search.responsable');

        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            if (responsable.value !== "" && responsable.value !== null && responsable.value !== undefined) {
                if (responsable.value.length < 3) {
                    dispatchSwtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                    return;
                }
                selector.toggleClass('loading');
                filterUsersBancoDispatch(responsable.value).then((data) => {
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
                            responsable.onChange(event.title)
                            idEmployee.onChange(event.idUsuario);
                            return 'default';
                        }
                    });
                    selector.toggleClass('loading');
                    selector.search('search local', responsable.value);
                    selector.focus();
                });
            }
        }
    }

    _updateValue(value) {
        const { fields: { responsable } } = this.props;
        responsable.onChange(value);
    }

    _handleCreateTask() {
        const {fields: {responsable, fecha, tarea, idEmployee, id}, dispatchAddTask, dispatchEditTask, taskEdit, dispatchSwtShowMessage, commentsReducer} = this.props;
        if (responsable.value !== nameUsuario) {
            nameUsuario = responsable.value;
            idUsuario = null;
        }

        if (moment(fecha.value, 'DD/MM/YYYY').isValid()) {
            if (taskEdit !== undefined) {
                taskEdit.tarea = tarea.value;
                taskEdit.textTarea = htmlToText(tarea.value);
                taskEdit.idResponsable = idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null;
                taskEdit.responsable = nameUsuario;
                taskEdit.fecha = fecha.value;
                taskEdit.fechaForm = fecha.value;
                taskEdit.id = id.value;
                taskEdit.notes = Object.assign(commentsReducer.comments);
                dispatchEditTask(taskEdit);

                dispatchSwtShowMessage('success', 'Tarea editada', 'Señor usuario, la tarea fue editada exitosamente', {onConfirmCallback: this._closeCreate})

            } else {
                const uuid = _.uniqueId('task_');
                let task = {
                    uuid,
                    id: null,
                    tarea: tarea.value,
                    textTarea: htmlToText(tarea.value),
                    idResponsable: idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null,
                    responsable: nameUsuario,
                    fecha: fecha.value,
                    fechaForm: fecha.value,
                    notes: Object.assign(commentsReducer.comments),
                    taskAsignator : window.localStorage.getItem('name')
                };
                dispatchAddTask(task);

                // Aqui hay que llamar la accion
                dispatchSwtShowMessage('success', 'Tarea agregada', 'Señor usuario, la tarea fue agregada exitosamente', {onConfirmCallback: this._closeCreate})
            }
        } else {
            fecha.onChange('');
        }

    }

    saveTaskComment = async (comment) => {
        const { dispatchSaveTaskNote, visitReducer } = this.props;
        comment.shouldNotifyMentions = visitReducer.get('detailVisit').data.documentStatus;
        await dispatchSaveTaskNote(comment);
        await this.getTaskNotesByUserTaskId();
    };

    getTaskNotesByUserTaskId = async () => {
        const { fields: {id}, dispatchGetTaskNotesByUserTaskId, dispatchFillComments } = this.props;
        const getNotesResponse = await dispatchGetTaskNotesByUserTaskId(id.value);
        if(_.get(getNotesResponse, 'payload.data.status') === REQUEST_SUCCESS) {
            const notes = _.get(getNotesResponse, 'payload.data.data');
            dispatchFillComments(notes);
        }
    };

    render() {
        const {fields: {responsable, fecha, tarea, idEmployee, id}, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreateTask)}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                     id="modalComponentScroll"
                     style={{paddingBottom: "0px"}}>
                    <dt className="business-title"><span
                        style={{ paddingLeft: '20px' }}>Adicionar pendiente a la reunión</span></dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        <p style={{ paddingTop: "10px", marginBottom: "0px" }}>Los campos marcados con asterisco (<span
                            style={{ color: "red" }}>*</span>) son obligatorios.</p>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={12} md={6} lg={6}>
                                <dt>Asignador:<span id="asignator" style={{fontWeight:'normal'}}> {this.state.nameAsignator}</span></dt>
                            </Col>
                        </Row>
                        <Row style={{ padding: "0px 10px 0px 0px" }}>
                            <Col xs={6} md={6} lg={6}>
                                <dt><span>Responsable (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBoxFilter
                                        id="PendingResponsible"
                                        name="responsableTask"
                                        labelInput="Ingrese un criterio de búsqueda..."
                                        {...responsable}
                                        parentId="dashboardComponentScroll"
                                        onChange={(val) => {
                                            if (idEmployee.value) {
                                                idEmployee.onChange(null)
                                            }
                                            responsable.onChange(val)
                                        }}
                                        value={responsable.value}
                                        onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                                        onSelect={val => this._updateValue(val)}
                                        max="255"
                                    />
                                </dt>
                            </Col>
                            <Col xs={6} md={6} lg={6}>
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
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Tarea (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <RichText
                                    name="description"
                                    type="text"
                                    style={{ width: '100%', height: '150pt' }}
                                    {...tarea}
                                    touched={true}
                                    error={this.errorTask}
                                    placeholder="Ingrese la descripción"
                                />
                            </Col>
                        </Row>
                        <Row style={{paddingTop: 40, width: '99%', paddingLeft: 20}}>
                            <Col xs={12} md={12} lg={12}>
                                <CommentsComponent
                                    header="Notas"
                                    reportId={id.value ? id.value : null}
                                    saveCommentAction={this.saveTaskComment}/>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit">
                        <span>Guardar</span>
                    </button>
                </div>


            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchAddTask: addTask,
        dispatchEditTask: editTask,
        filterUsersBancoDispatch: filterUsersBanco,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchFillComments: fillComments,
        dispatchGetTaskNotesByUserTaskId: getTaskNotesByUserTaskId,
        dispatchSaveTaskNote: saveTaskNote
    }, dispatch);
}

function mapStateToProps({tasks, selectsReducer, participants, commentsReducer, visitReducer}, {taskEdit}) {
    if (taskEdit !== undefined) {
        return {
            participants,
            tasks,
            selectsReducer,
            commentsReducer,
            visitReducer,
            initialValues: {
                idEmployee: taskEdit.idResponsable,
                responsable: taskEdit.responsable,
                fecha: taskEdit.fechaForm,
                tarea: taskEdit.tarea,
                id: taskEdit.id
            }

        }
    } else {
        return {
            tasks,
            selectsReducer,
            commentsReducer,
            visitReducer,
            initialValues: {
                idEmployee: '',
                responsable: '',
                fecha: '',
                tarea: '',
                id: ''
            }
        };
    }
}

export default reduxForm({
    form: 'submitValidation',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalTask);