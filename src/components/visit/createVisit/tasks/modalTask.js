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
import Input from '../../../../ui/input/inputComponent';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../../ui/dateTimePicker/dateTimePickerComponent';

const fields =["responsable", "fecha", "tarea"];
const errors = {};

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
      this._handleCreateTask = this._handleCreateTask.bind(this);
      this.state = {
        showSuccessAdd:false,
        showSuccessEdit:false,
        showEr:false,
        showErrorYa: false
      }
      momentLocalizer(moment);
    }

    componentWillMount(){
      this.props.resetForm();
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

    _handleCreateTask(){
      const {fields:{responsable, fecha, tarea}, handleSubmit, error, addTask, editTask, taskEdit} = this.props;
      if(taskEdit !== undefined){
        taskEdit.tarea = tarea.value;
        taskEdit.responsable = responsable.value;
        taskEdit.fecha = fecha.value;
        editTask(taskEdit);
        this.setState({
          showSuccessEdit: true
        });
      }else{
        const uuid = _.uniqueId('task_');
        var task = {
          uuid,
          tarea: tarea.value,
          responsable: responsable.value,
          fecha: fecha.value
        }
        addTask(task);
        this.setState({
          showSuccessAdd: true
        });
      }
    }

    render() {
        const {modalStatus, selectsReducer} = this.props;
        const {initialValues, fields:{responsable, fecha, tarea}, handleSubmit, error}= this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
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
                      <Input
                        name="txtResponsable"
                        type="text"
                        max="120"
                        placeholder="Responsable de la tarea"
                        {...responsable}
                      />
                    </dt>
                  </Col>
                  <Col xs={6} md={6} lg={6}>
                    <dt><span>Fecha (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <DateTimePickerUi
                        {...fecha}
                        culture='es'
                        format={"DD/MM/YYYY"}
                        time={false}
                        min={new Date()}
                      />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Descripción de la tarea (<span style={{color: "red"}}>*</span>)</span></dt>
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
      editTask
    }, dispatch);
}

function mapStateToProps({tasks,selectsReducer}, {taskEdit}) {
  if(taskEdit !== undefined){
    return {
      tasks,
      selectsReducer,
      initialValues: {
        responsable: taskEdit.responsable,
        fecha: taskEdit.fecha,
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
