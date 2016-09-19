import moment from 'moment';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import SweetAlert from 'sweetalert-react';
import {DateTimePicker} from 'react-widgets';
import {Row, Grid, Col} from 'react-flexbox-grid';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {addTask, editTask} from './actions';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../../ui/comboBoxFilter/comboBoxFilter';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import _ from 'lodash';
import $ from 'jquery';

const fields = ["responsable", "fecha", "tarea"];
const errors = {};
var usersBanco = [];
var idUsuario, nameUsuario;

const validate = (values) => {
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
  return errors;
};

class ModalTask extends Component {

    constructor(props) {
      super(props);
      this._close = this._close.bind(this);
      this._closeCreate = this._closeCreate.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this._handleCreateTask = this._handleCreateTask.bind(this);
      this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
      this.state = {
        showSuccessAdd:false,
        showSuccessEdit:false,
        showEr:false,
        prueba:[],
        showErrorYa: false
      }
      momentLocalizer(moment);
    }

    componentDidMount(){
      const {fields:{responsable, fecha, tarea}, taskEdit} = this.props;
      if(taskEdit !== undefined){
        responsable.onChange(taskEdit.responsable);
        tarea.onChange(taskEdit.tarea);
        fecha.onChange(moment(taskEdit.fechaForm, 'DD/MM/YYYY'));
      }
    }

    _close(){
    }

    _closeCreate(){
      const {isOpen, taskEdit} = this.props;
      if(taskEdit !== undefined){
        this.setState({
          showSuccessEdit: false
        });
      }else{
        this.setState({
          showSuccessAdd: false
        });
      }
      isOpen();
      this.props.resetForm();
    }

    updateKeyValueUsersBanco(e){
      const {fields: {responsable}, filterUsersBanco} = this.props;
      const selector =  $('.ui.search.responsable');
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

    _updateValue(value){
      const{fields: {responsable}, contactsByClient} = this.props;
        responsable.onChange(value);
    }

    _handleCreateTask(){
      const {fields:{responsable, fecha, tarea}, handleSubmit, error, addTask, editTask, taskEdit} = this.props;
      if(responsable.value !== nameUsuario){
        nameUsuario = responsable.value;
        idUsuario = null;
      }
      console.log("moment validate", moment(fecha.value, 'DD/MM/YYYY').isValid() );
      if( moment(fecha.value, 'DD/MM/YYYY').isValid() ){
        if(taskEdit !== undefined){
          taskEdit.tarea = tarea.value;
          taskEdit.idResponsable = idUsuario;
          taskEdit.responsable = nameUsuario;
          taskEdit.fecha = fecha.value;
          taskEdit.fechaForm = fecha.value;
          editTask(taskEdit);
          this.setState({
            showSuccessEdit: true
          });
        }else{
          const uuid = _.uniqueId('task_');
          var task = {
            uuid,
            tarea: tarea.value,
            idResponsable: idUsuario,
            responsable: nameUsuario,
            fecha: fecha.value,
            fechaForm: fecha.value
          }
          addTask(task);
          this.setState({
            showSuccessAdd: true
          });
        }
      } else {
        fecha.onChange('');
      }
    }

    render() {
        const {modalStatus, selectsReducer} = this.props;
        const {initialValues, fields:{responsable, fecha, tarea}, handleSubmit, error}= this.props;
        return (
          <form onSubmit={handleSubmit(this._handleCreateTask)}>
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll"
            style={{paddingBottom:"0px"}}>
              <dt className="business-title"><span style={{paddingLeft: '20px'}}>Adicionar pendiente a la reunión</span></dt>
              <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                <p style={{paddingTop: "10px", marginBottom: "0px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</p>
                <Row style={{padding: "0px 10px 0px 0px"}}>
                  <Col xs={6} md={6} lg={6}>
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
                        max="255"
                      />
                    </dt>
                  </Col>
                  <Col xs={6} md={6} lg={6}>
                    <dt><span>Fecha de cierre - DD/MM/YYYY (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
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
                    <dt><span>Tarea (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Textarea
                        name="description"
                        type="text"
                        style={{width: '100%', height: '100%'}}
                        {...tarea}
                        placeholder="Ingrese la descripción"
                        max="1000"
                        rows={5}
                        />
                    </dt>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="modalBt4-footer modal-footer">
              <button type="submit" className="btn btn-primary modal-button-edit">
                <span>Guardar</span>
              </button>
            </div>
            <SweetAlert
             type="success"
             show={this.state.showSuccessAdd}
             title="Tarea agregada"
             text="Señor usuario, la tarea fue agregada exitosamente"
             onConfirm={() => this._closeCreate()}
           />
           <SweetAlert
            type="success"
            show={this.state.showSuccessEdit}
            title="Tarea editada"
            text="Señor usuario, la tarea fue editada exitosamente"
            onConfirm={() => this._closeCreate()}
          />
          </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      addTask,
      editTask,
      filterUsersBanco
    }, dispatch);
}

function mapStateToProps({tasks, selectsReducer, participants}, {taskEdit}) {
  if(taskEdit !== undefined){
    return {
      participants,
      tasks,
      selectsReducer,
      initialValues: {
        responsable: taskEdit.responsable,
        fecha: taskEdit.fechaForm,
        tarea : taskEdit.tarea
      }

    }
  }else{
    return {
      tasks,
      selectsReducer,
      initialValues: {
        responsable: '',
        fecha: '',
        tarea : ''
      }
    };
  }
}

export default reduxForm({form : 'submitValidation', fields, validate}, mapStateToProps, mapDispatchToProps)(ModalTask);
