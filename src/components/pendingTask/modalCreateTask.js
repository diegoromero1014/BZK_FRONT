import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../ui/comboBoxFilter/comboBoxFilter';
import { Row, Col } from 'react-flexbox-grid';
import Textarea from '../../ui/textarea/textareaComponent';
import { filterUsersBanco } from '../participantsVisitPre/actions';
import DateTimePickerUi from '../../ui/dateTimePicker/dateTimePickerComponent';
import { getMasterDataFields } from '../selectsComponent/actions';
import { TASK_STATUS } from '../selectsComponent/constants';
import { createPendingTaskNew } from './createPendingTask/actions'
import { clearUserTask, tasksByClientFindServer } from './actions';
import { MESSAGE_SAVE_DATA, EDITAR, REQUEST_SUCCESS, REQUEST_INVALID_INPUT } from '../../constantsGlobal';
import { redirectUrl } from '../globalComponents/actions';
import { NUMBER_RECORDS } from './constants';
import { changeStateSaveData } from '../main/actions';
import { getInfoTaskUser, tasksByUser, clearMyPendingPaginator, updateUserNameTask } from '../myPendings/myTasks/actions';
import { validateValue } from '../../actionsGlobal';
import RichText from '../richText/richTextComponent';
import {swtShowMessage} from "../sweetAlertMessages/actions";
import { fields, validations as validate } from './createPendingTask/fieldsAndRulesForReduxForm';
import ButtonDetailsRedirectComponent from '../grid/buttonDetailsRedirectComponent';
import { detailBusiness } from './../businessPlan/actions';
import { detailVisit } from './../visit/actions';
import {validatePermissionsByModule} from './../../actionsGlobal';
import {
  MODULE_BUSSINESS_PLAN,
  MODULE_VISITS
} from './../../constantsGlobal';


var usersBanco = [];
let nameEntity;


export class ModalCreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      taskEdited: false,
      showErrtask: false,
      tareaError: null,
      nameUsuario: ""
    };
    this.cancelSubmit = false;
    this.entityId = null;
    this.clientId = null;
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._closeViewOrEditTask = this._closeViewOrEditTask.bind(this);
    this._handleEditTask = this._handleEditTask.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._editTask = this._editTask.bind(this);
    this.processValidation =this.processValidation.bind(this);
    this._handleRelationLink = this._handleRelationLink.bind(this);
  }

  _updateValue(value) {
    const { fields: { responsable } } = this.props;
    responsable.onChange(value);
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

  componentWillMount() {
 
    const { fields: { id, responsable, idEmployee, idEstado, advance, fecha, tarea }, taskEdit, getMasterDataFields, getInfoTaskUser, updateUserNameTask, detailBusiness, detailVisit, dispatch } = this.props;
    updateUserNameTask("");
    getMasterDataFields([TASK_STATUS]);
    let idTask = _.get(taskEdit, 'id', taskEdit);
    getInfoTaskUser(idTask).then((data) => {
      const task = _.get(data, 'payload.data.data');
      if (task.nameEntity === 'Plan de negocio') {
        dispatch(validatePermissionsByModule(MODULE_BUSSINESS_PLAN));
        detailBusiness(task.entityId);
      } else if (task.nameEntity === 'Visita') {
        dispatch(validatePermissionsByModule(MODULE_VISITS));
        detailVisit(task.entityId);
      }

      responsable.onChange(task.responsable);
      idEmployee.onChange(task.idResponsable);
      idEstado.onChange(task.idStatus);
      advance.onChange(task.advance);
      id.onChange(task.id);
      if (moment(task.finalDate, 'YYYY-MM-DD').isValid()) {
        fecha.onChange(moment(task.finalDate, 'YYYY-MM-DD').format("DD/MM/YYYY"));
      } else {
        fecha.onChange(moment(task.finalDate).format("DD/MM/YYYY"));
      }
        nameEntity = task.nameEntity;
        this.entityId = task.entityId;
        this.clientId = task.clientId;
      tarea.onChange(task.task);
      this.setState({nameUsuario:task.assignedBy});
    });
  }

  _closeViewOrEditTask() {
    const { isOpen, tasksByClientFindServer, tasksByUser, clearMyPendingPaginator, functCloseModal, updateUserNameTask } = this.props;
    this.setState({ isEditable: false, taskEdited: false, showErrtask: false });
    isOpen();
    updateUserNameTask('');
    if (!_.isUndefined(functCloseModal) && !_.isNull(functCloseModal)) {
      functCloseModal();
    } else {
      tasksByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "finalDate", 0, "");
      clearMyPendingPaginator();
      tasksByUser(0, NUMBER_RECORDS, "", "", "");
    }
    this.props.resetForm();
  }

  _editTask() {
    this.setState({
      isEditable: !this.state.isEditable
    });
  }

  _handleEditTask() {
    const { createPendingTaskNew, changeStateSaveData, idClient, swtShowMessage } = this.props;
    const { fields: { id, responsable, idEmployee, fecha, idEstado, tarea, advance }} = this.props;
    if (this.cancelSubmit) {
      return;
    }
    if (moment(fecha.value, 'DD/MM/YYYY').isValid()) {

      var messageBody = {
        "id": id.value,
        "clientId": _.isUndefined(idClient) || _.isNull(idClient) ? window.sessionStorage.getItem('idClientSelected') : idClient,
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
          if (_.get(data, 'payload.data.status') === REQUEST_SUCCESS) {
         
            swtShowMessage('success',"Edición de tarea","Señor usuario, la tarea se editó exitosamente.",{onConfirmCallback: this._closeViewOrEditTask});

          } else {
            
              if ((_.get(data, 'payload.data.status') === REQUEST_INVALID_INPUT)) {
                              
                const validationsErrorFromServer = _.get(data, 'payload.data.data[0].detail');
                    _.forEach(validationsErrorFromServer, (field) => {
                    this.processValidation(field);
                });
                
            } else {                
                swtShowMessage('error','Error editando la tarea',"Señor usuario, ocurrió un error editando la tarea.");
            }
          }
        }
      }, (reason) => {
        changeStateSaveData(false, "");
        swtShowMessage('error',"Error editando tarea","Señor usuario, ocurrió un error editando la tarea.");
      });
    } else {
      fecha.onChange('');
    }
  }
  _handleRelationLink(){
    const{businessPlanReducer, visitReducer}=this.props;
    let actionsRedirect;
    let detail;
    switch (nameEntity) {
      case "Plan de negocio":
        detail = businessPlanReducer.get("detailBusiness");
        actionsRedirect = {
          typeClickDetail: "businessPlan",
          ownerDraft: detail.data.documentStatus,
          idClient: this.clientId,
          urlRedirect: "/dashboard/businessPlanEdit",
          id: this.entityId
        };
        break;
      case"Visita":
      detail = visitReducer.get("detailVisit");
        actionsRedirect = {
          typeClickDetail:"visita",
          ownerDraft: detail.data.documentStatus,
          idClient: this.clientId,
          urlRedirect: "/dashboard/visitaEditar",
          id: this.entityId
          };
          break;
        default:
          break;
        }
        return actionsRedirect;
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
    
    const { fields: { responsable, fecha, idEstado, tarea, advance, idEmployee },
      selectsReducer, reducerGlobal, handleSubmit, myPendingsReducer, actionEdit } = this.props;

    var visibleEdit, editAction;
    var userName = myPendingsReducer.get('userName');
    if (actionEdit) {
      visibleEdit = _.isNull(userName) || _.isUndefined(userName) ? true : _.isEqual(userName.toLowerCase(), window.localStorage.getItem('userNameFront').toLowerCase());
    } else {
      editAction = true;
    }

    return (
      <form onSubmit={handleSubmit(this._handleEditTask)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll"
          style={{ paddingBottom: "20px" }}>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <p style={{ paddingTop: "10px", marginBottom: "0px" }} >Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</p>
            <Row style={{ padding: "0px 10px 0px 0px" }}>
              <Col xs={6} md={6} lg={6}>
                <dt>Asignador: <span id="asignator" style={{fontWeight:'normal'}}>{this.state.nameUsuario}</span></dt>
              </Col>
            </Row>
            <Row style={{ padding: "0px 10px 0px 0px" }}>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Fecha de cierre - DD/MM/YYYY (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt style={{ paddingTop: "0px" }}>
                  <DateTimePickerUi
                    {...fecha}
                    culture='es'
                    time={false}
                    disabled={this.state.isEditable ? '' : 'disabled'}
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
                    disabled={this.state.isEditable ? '' : 'disabled'}
                  />
                </dt>
              </Col>
              <Col xs={12} md={3} ld={3}>
                {(_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), EDITAR), false) &&
                  (visibleEdit || editAction)) &&
                  <button type="button" onClick={this._editTask} className={'btn btn-primary modal-button-edit'}
                    style={{ marginRight: '15px', float: 'right', marginTop: '35px' }}>
                    Editar <i className={'icon edit'}></i>
                  </button>
                }
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
                  disabled={this.state.isEditable ? '' : 'disabled'}
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
                  style={{ width: '100%', height: '120px' }}
                  readOnly={!this.state.isEditable}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                  error= {this.state.tareaError||tarea.error}
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
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          {nameEntity ?
            <Row xs={12} md={12} lg={12}>
              <Col xs={6} md={10} lg={10} style={{ textAlign: "left", varticalAlign: "middle", marginLeft: "0px" }}>
               {!_.isNull(this.entityId) ? 
                <span style={{ fontWeight: "bold", color: "#818282"}}>Pendiente de {nameEntity}
                  <span style={{paddingLeft:"2em"}}>
                    <ButtonDetailsRedirectComponent actionsRedirect={ () => {this.cancelSubmit = true; return this._handleRelationLink()  }} />
                  </span>
                </span> 
                :<span style={{ fontWeight: "bold", color: "#818282"}}>Pendiente de {nameEntity}</span>
               }
              </Col>
              <Col xs={6} md={2} lg={2}>

                <button
                  type="submit"
                  className="btn btn-primary modal-button-edit"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                >{'Guardar'}</button>
              </Col>
            </Row>
            :
            <button
              type="submit"
              className="btn btn-primary modal-button-edit"
              disabled={this.state.isEditable ? '' : 'disabled'}
            >{'Guardar'}</button>
          }
        </div>
        
        
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    filterUsersBanco,
    getMasterDataFields,
    createPendingTaskNew,
    clearUserTask,
    updateUserNameTask,
    tasksByClientFindServer,
    clearMyPendingPaginator,
    changeStateSaveData,
    getInfoTaskUser,
    tasksByUser,
    validateValue,
    swtShowMessage,
    detailBusiness,
    detailVisit,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ tasksByClient, selectsReducer, participants, reducerGlobal, visitReducer, businessPlanReducer, myPendingsReducer }) {
  return {
    tasksByClient,
    selectsReducer,
    participants,
    reducerGlobal,
    myPendingsReducer, 
    visitReducer,
    businessPlanReducer
  }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ModalCreateTask);
