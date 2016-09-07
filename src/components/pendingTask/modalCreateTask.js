import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../ui/comboBoxFilter/comboBoxFilter';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Textarea from '../../ui/textarea/textareaComponent';
import {filterUsersBanco} from '../participantsVisitPre/actions';
import DateTimePickerUi from '../../ui/dateTimePicker/dateTimePickerComponent';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {getMasterDataFields} from '../selectsComponent/actions';
import {TASK_STATUS} from '../selectsComponent/constants';
import {createPendingTaskNew} from './createPendingTask/actions'
import {clearUserTask, tasksByClientFindServer} from './actions';
import {NUMBER_RECORDS} from './constants';
import {changeStateSaveData} from '../dashboard/actions';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';

const fields = ["id", "idEmployee", "responsable", "fecha", "tarea", "idEstado", "advance", "visit", "dateVisit"];
var usersBanco = [];
var idUsuario, nameUsuario;

const validate = values => {
  const errors = {};
  if(!values.responsable){
    errors.responsable = "Debe ingresar un valor";
  }else{
    errors.responsable = null;
  }
  if(!values.fecha){
    errors.fecha = "Debe seleccionar una opción";
  }else{
    errors.fecha = null;
  }
  if(!values.tarea){
    errors.tarea = "Debe ingresar un valor";
  }else{
    errors.tarea = null;
  }
  if(!values.idEstado){
    errors.idEstado = "Debe ingresar un valor";
  }else{
    errors.idEstado = null;
  }
  return errors;
};

class ModalCreateTask extends Component{
  constructor(props){
    super(props);
    this.state = {
      isEditable: false,
      taskEdited: false,
      showErrtask: false
    }
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._closeViewOrEditTask = this._closeViewOrEditTask.bind(this);
    this._handleEditTask = this._handleEditTask.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._editTask = this._editTask.bind(this);
  }

  _updateValue(value){
    const{fields: {responsable}, contactsByClient} = this.props;
      responsable.onChange(value);
  }

  updateKeyValueUsersBanco(e){
    const {fields: {responsable, idEmployee}, filterUsersBanco} = this.props;
    const selector =  $('.ui.search.responsable');
    idEmployee.onChange(null);
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      if(responsable.value !== "" && responsable.value !== null && responsable.value !== undefined){
        selector.toggleClass('loading');
        filterUsersBanco(responsable.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          selector.search({
              cache: false,
              source: usersBanco,
              maxResults : 1500,
              searchFields: [
                'title',
                'description'
              ],
              onSelect : function(event) {
                  responsable.onChange(event.title);
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

  componentWillMount(){
    const{fields: {idEstado}, taskEdit, getMasterDataFields} = this.props;
    getMasterDataFields([TASK_STATUS]);
    if( taskEdit !== undefined && taskEdit !== null && taskEdit !== "" ){
      setTimeout(function(){
        idEstado.onChange(taskEdit.idStatus);
      }, 500)
    }
  }

  _closeViewOrEditTask() {
    const {isOpen, tasksByClientFindServer} = this.props;
    this.setState({isEditable: false, taskEdited: false, showErrtask: false});
    isOpen();
    tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS,"c.closingDate", 0, "");
    this.props.resetForm();
  }

  _editTask(){
    this.setState({
      isEditable: !this.state.isEditable
    });
  }

  _handleEditTask(){
    const {createPendingTaskNew, changeStateSaveData} = this.props;
    const {fields:{id, responsable, idEmployee, fecha, idEstado, tarea, advance},handleSubmit,error}= this.props;
    var messageBody = {
      "id": id.value,
      "clientId": window.localStorage.getItem('idClientSelected'),
      "task": tarea.value,
      "advance" : advance.value,
      "status" : idEstado.value,
      "closingDate" : fecha.value !== '' && fecha.value !== null && fecha.value !== undefined ? moment(fecha.value, "DD/MM/YYYY").format('x'): null,
      "employeeName": responsable.value,
      "employeeId": idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null,
    }
    changeStateSaveData(true);
    createPendingTaskNew(messageBody).then((data) => {
      changeStateSaveData(false);
        if((_.get(data, 'payload.data.status') === 200)){
            this.setState({taskEdited: true});
          } else {
            this.setState({showErrtask: true});
        }
        }, (reason) => {
          changeStateSaveData(false);
          this.setState({showErrtask: true});
      });
  }

  render(){
    const {fields: {responsable, fecha, idEstado, tarea, advance, dateVisit},
        taskEdit, selectsReducer, handleSubmit} = this.props;
    return  (
      <form onSubmit={handleSubmit(this._handleEditTask)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll"
          style={{paddingBottom:"20px"}}>
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <p style={{paddingTop: "10px", marginBottom: "0px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</p>
            <Row style={{padding: "0px 10px 0px 0px"}}>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Fecha de cierre - DD/MM/YYYY (<span style={{color: "red"}}>*</span>)</span></dt>
                <dt style={{paddingTop:"0px"}}>
                  <DateTimePickerUi
                    {...fecha}
                    culture='es'
                    format={"DD/MM/YYYY"}
                    time={false}
                    disabled={this.state.isEditable ? '' : 'disabled'}
                  />
                </dt>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Estado (<span style={{color: "red"}}>*</span>)</span></dt>
                <dt style={{paddingTop:"0px"}}>
                  <ComboBox name="idEstado" labelInput="Seleccione"
                    {...idEstado}
                    valueProp={'id'}
                    textProp = {'value'}
                    labelInput="Seleccione"
                    data={selectsReducer.get(TASK_STATUS) || []}
                    disabled={this.state.isEditable ? '' : 'disabled'}
                  />
                </dt>
              </Col>
              <Col xs={12} md={3} ld={3}>
                <button type="button" onClick={this._editTask} className={'btn btn-primary modal-button-edit'}
                  style={{marginRight:'15px', float:'right', marginTop:'35px'}}>
                  Editar <i className={'icon edit'}></i>
                </button>
              </Col>
            </Row>
            <Row style={{padding: "0px 10px 0px 0px"}}>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Responsable (<span style={{color: "red"}}>*</span>)</span></dt>
                <dt style={{paddingTop:"0px"}}>
                  <ComboBoxFilter
                    name="responsableTask"
                    labelInput="Ingrese un criterio de búsqueda..."
                    {...responsable}
                    parentId="dashboardComponentScroll"
                    onChange={responsable.onChange}
                    value={responsable.value}
                    onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                    onSelect={val => this._updateValue(val)}
                    disabled={this.state.isEditable ? '' : 'disabled'}
                    max="255"
                  />
                </dt>
              </Col>
            </Row>
            <Row style={{padding: "0px 10px 0px 0px"}}>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Tarea (<span style={{color: "red"}}>*</span>)</span></dt>
                <dt style={{paddingTop:"0px"}}>
                  <Textarea
                    {...tarea}
                    name="createTask"
                    type="text"
                    max="1000"
                    title="La longitud máxima de caracteres es de 1000"
                    style={{width: '100%', height: '120px'}}
                    disabled={this.state.isEditable ? '' : 'disabled'}
                  />
                </dt>
              </Col>
            </Row>
            <Row style={{padding: "0px 10px 0px 0px"}}>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Observaciones</span></dt>
                <dt style={{paddingTop:"0px"}}>
                  <Textarea
                    {...advance}
                    name="advanceTask"
                    type="text"
                    max="1000"
                    title="La longitud máxima de caracteres es de 1000"
                    style={{width: '100%', height: '120px'}}
                    disabled={this.state.isEditable ? '' : 'disabled'}
                  />
                </dt>
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">

          {dateVisit.value !== null ?
            <Row xs={12} md={12} lg={12}>
              <Col xs={6} md={10} lg={10} style={{textAlign:"left", varticalAlign: "middle", marginLeft:"0px"}}>
                  <span style={{fontWeight: "bold", color: "#818282"}}>Pendiente de la visita: </span><span style={{marginLeft: "0px", color: "#818282"}}>{dateVisit.value}</span>
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
        <SweetAlert
          type= "success"
          show={this.state.taskEdited}
          title="Edición de tarea"
          text="Señor usuario, la tarea se editó de forma exitosa."
          onConfirm={() => this._closeViewOrEditTask()}
        />
        <SweetAlert
         type= "error"
         show={this.state.showErrtask}
         title="Error editando tarea"
         text="Señor usuario, ocurrió un error editando la tarea."
         onConfirm={() => this.setState({showErrtask:false})}
         />
      </form>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    filterUsersBanco,
    getMasterDataFields,
    createPendingTaskNew,
    clearUserTask,
    tasksByClientFindServer,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({tasksByClient, selectsReducer, participants}, {taskEdit}){
  return {
    tasksByClient,
    selectsReducer,
    participants,
    initialValues: {
      responsable: taskEdit.responsable,
      idEmployee:taskEdit.idResponsable,
      idEstado: taskEdit.idStatus,
      advance: taskEdit.advance,
      id: taskEdit.id,
      fecha: moment(taskEdit.finalDate, 'YYYY-MM-DD').format("DD/MM/YYYY"),
      tarea : taskEdit.task,
      dateVisit : taskEdit.dateVisit === null ? null :  moment(taskEdit.dateVisit, 'YYYY-MM-DD HH:mm:ss').format("DD MMM YYYY hh:mm a")
    }
  }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ModalCreateTask);
