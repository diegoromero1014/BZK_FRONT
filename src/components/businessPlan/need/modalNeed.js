import moment from 'moment';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import SweetAlert from 'sweetalert-react';
import {DateTimePicker} from 'react-widgets';
import {Row, Grid, Col} from 'react-flexbox-grid';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Input from '../../../ui/input/inputComponent';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../../ui/comboBoxFilter/comboBoxFilter';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import {getClientNeeds,getPipelineProducts} from '../../selectsComponent/actions';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {IMPLEMENTATION_TIMELINE,STATUS_NEED} from './constants';
import {addNeed, editNeed} from './actions';
import _ from 'lodash';
import $ from 'jquery';

const fields = ["idEmployee","needType", "descriptionNeed", "needProduct", "needImplementation","needTask", "needBenefits", "needResponsable", "needDate", "statusNeed"];
const errors = {};
var usersBanco = [];
var idUsuario, nameUsuario;
const validate = (values) => {
  if(!values.needType){
    errors.needType = "Debe seleccionar una opción";
  }else{
    errors.needType = null;
  }
  if(!values.descriptionNeed){
    errors.descriptionNeed = "Debe ingresar un valor";
  }else{
    errors.descriptionNeed = null;
  }
  if(!values.needProduct){
    errors.needProduct = "Debe seleccionar una opción";
  }else{
    errors.needProduct = null;
  }
  if(!values.needImplementation){
    errors.needImplementation = "Debe seleccionar una opción";
  }else{
    errors.needImplementation = null;
  }
  if(!values.needTask){
    errors.needTask = "Debe ingresar un valor";
  }else{
    errors.needTask = null;
  }
  if(!values.needBenefits){
    errors.needBenefits = "Debe ingresar un valor";
  }else{
    errors.needBenefits = null;
  }
  if(!values.needResponsable){
    errors.needResponsable = "Debe ingresar un valor";
  }else{
    errors.needResponsable = null;
  }
  if(!values.needDate){
    errors.needDate = "Debe seleccionar una fecha";
  }else{
    errors.needDate = null;
  }
  if(!values.statusNeed){
    errors.statusNeed = "Debe seleccionar una opción";
  }else{
    errors.statusNeed = null;
  }
  return errors;
};

class ModalNeed extends Component {

  constructor(props) {
    super(props);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._handleCreateNeed = this._handleCreateNeed.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
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
    const {fields:{idEmployee,needType, descriptionNeed, needProduct, needImplementation,needTask, needBenefits, needResponsable, needDate, statusNeed}, needEdit} = this.props;
    if(needEdit !== undefined){
      needType.onChange(needEdit.needIdType);
      descriptionNeed.onChange(needEdit.descriptionNeed);
      needProduct.onChange(needEdit.needIdProduct);
      needImplementation.onChange(needEdit.needIdImplementation);
      needTask.onChange(needEdit.needTask);
      needBenefits.onChange(needEdit.needBenefits);
      idEmployee.onChange(needEdit.needIdResponsable);
      needResponsable.onChange(needEdit.needResponsable);
      statusNeed.onChange(needEdit.statusIdNeed);
      needDate.onChange(moment(needEdit.needDate, 'DD MMM YYYY').format("DD/MM/YYYY"));
    }
  }

  _closeCreate(){
    const {isOpen, needEdit} = this.props;
    if(needEdit !== undefined){
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

  _handleCreateNeed(){
    const {fields:{needType, idEmployee,descriptionNeed, needProduct, needImplementation,needTask, needBenefits, needResponsable, needDate, statusNeed},selectsReducer, handleSubmit, error, addNeed, editNeed, needEdit} = this.props;
    var status = _.get(_.filter(selectsReducer.get(STATUS_NEED), ['id',  parseInt(statusNeed.value)]), '[0].value');
    var implementation = _.get(_.filter(selectsReducer.get(IMPLEMENTATION_TIMELINE), ['id',  parseInt(needImplementation.value)]), '[0].value');
    var needC = _.get(_.filter(selectsReducer.get('pipelineClientNeeds'), ['id',  parseInt(needType.value)]), '[0].need');
    var productC = _.get(_.filter(selectsReducer.get('pipelineProducts'), ['id',  parseInt(needProduct.value)]), '[0].product');
    if(needResponsable.value !== nameUsuario){
      nameUsuario = needResponsable.value;
      idUsuario = idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null;
    }
     if(needEdit !== undefined){
       needEdit.needIdType = needType.value;
       needEdit.needType = needC;
       needEdit.descriptionNeed = descriptionNeed.value;
       needEdit.needIdProduct = needProduct.value;
       needEdit.needProduct = productC;
       needEdit.needIdImplementation = needImplementation.value;
       needEdit.needImplementation = implementation;
       needEdit.needTask = needTask.value;
       needEdit.needBenefits = needBenefits.value;
       needEdit.needIdResponsable = idUsuario;
       needEdit.needResponsable = nameUsuario;
       needEdit.needDate = needDate.value;
       needEdit.statusIdNeed = statusNeed.value;
       needEdit.statusNeed=status;
        editNeed(needEdit);
        this.setState({
          showSuccessEdit: true
        });
      }else{
        const uuid = _.uniqueId('need_');
        var need = {
          uuid,
          needIdType: needType.value,
          needType:needC,
          descriptionNeed :descriptionNeed.value,
          needIdProduct:needProduct.value,
          needProduct:productC,
          needIdImplementation:needImplementation.value,
          needImplementation:implementation,
          needTask:needTask.value,
          needBenefits:needBenefits.value,
          needIdResponsable: idUsuario,
          needResponsable: nameUsuario,
          needDate: needDate.value,
          statusIdNeed:statusNeed.value,
          statusNeed:status
        }
        addNeed(need);
        this.setState({
          showSuccessAdd: true
        });
      }
  }

  updateKeyValueUsersBanco(e){
    const {fields: {needResponsable,idEmployee}, filterUsersBanco} = this.props;
    idEmployee.onChange(null);
    const selector =  $('.ui.search.needResponsable');
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      if(needResponsable.value !== "" && needResponsable.value !== null && needResponsable.value !== undefined){
        selector.toggleClass('loading');
        filterUsersBanco(needResponsable.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          selector.search({
              cache: false,
              source: usersBanco,
              searchFields: [
                'title',
                'description'
              ],
              onSelect : function(event) {
                  needResponsable.onChange(event.title);
                  idEmployee.onChange(event.idUsuario);
                  return 'default';
              }
            });
            selector.toggleClass('loading');
            selector.search('search local', needResponsable.value);
            selector.focus();
          });
      }
    }
  }

  _updateValue(value){
    const{fields: {needResponsable}} = this.props;
    needResponsable.onChange(value);
  }

  componentWillMount() {
    const {getClientNeeds,getMasterDataFields,getPipelineProducts,selectsReducer} = this.props;
    getClientNeeds();
    getPipelineProducts();
    getMasterDataFields([IMPLEMENTATION_TIMELINE,STATUS_NEED]);
  }

    render() {
      const {selectsReducer} = this.props;
        const {initialValues, fields:{needType, descriptionNeed, needProduct, needImplementation,needTask, needBenefits, needResponsable, needDate, statusNeed}, handleSubmit, error}= this.props;
        return (
          <form onSubmit={handleSubmit(this._handleCreateNeed)}>
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
              <dt className="business-title"><span style={{paddingLeft: '20px'}}>Adicionar necesidad al plan de negocio</span></dt>
              <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                <p style={{paddingTop: "10px", marginBottom: "0px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</p>
                <Row>
                  <Col xs>
                    <dt><span>Necesidad (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <ComboBox
                        name="needType"
                        {...needType}
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'need'}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get('pipelineClientNeeds') || []}
                      />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Descripción de la necesidad (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Textarea
                        name="descriptionNeed"
                        type="text"
                        style={{width: '100%', height: '100%'}}
                        max="3500"
                        {...descriptionNeed}
                        rows={5}
                        />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <dt><span>Producto(s) que satisface(n) la necesidad  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <ComboBox
                        name="needProduct"
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'product'}
                        {...needProduct}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get('pipelineProducts') || []}
                      />
                    </dt>
                  </Col>
                  <Col xs>
                    <dt><span>Implementación  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <ComboBox
                        name="needImplementation"
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        {...needImplementation}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(IMPLEMENTATION_TIMELINE) || []}
                      />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Plan de Acción / Cómo le voy a llevar el producto y/o servicio (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Textarea
                        name="needTask"
                        type="text"
                        style={{width: '100%', height: '100%'}}
                        max="3500"
                        {...needTask}
                        rows={5}
                        />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Resultados y/o Beneficios Esperados  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Textarea
                        name="needBenefits"
                        type="text"
                        style={{width: '100%', height: '100%'}}
                        max="3500"
                        {...needBenefits}
                        rows={5}
                        />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Responsable  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                    <ComboBoxFilter
                      name="needResponsable"
                      {...needResponsable}
                      onChange={needResponsable.onChange}
                      value={needResponsable.value}
                      labelInput="Ingrese un criterio de búsqueda..."
                      parentId="dashboardComponentScroll"
                      onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                      onSelect={val => this._updateValue(val)}
                    />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <dt><span>Estado  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                    <ComboBox
                      name="statusNeed"
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...statusNeed}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(STATUS_NEED) || []}
                    />
                    </dt>
                  </Col>
                  <Col xs>
                    <dt><span>Fecha de Solución (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                    <DateTimePickerUi
                      culture='es'
                      format={"DD/MM/YYYY"}
                      time={false}
                      {...needDate}
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
             title="Necesidad agregada"
             text="Señor usuario, la necesidad fue agregada exitosamente"
             onConfirm={() => this._closeCreate()}
           />
           <SweetAlert
            type="success"
            show={this.state.showSuccessEdit}
            title="Necesidad editada"
            text="Señor usuario, la necesidad fue editada exitosamente"
            onConfirm={() => this._closeCreate()}
          />
          </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClientNeeds,getMasterDataFields,getPipelineProducts,filterUsersBanco,addNeed,
    editNeed,
  }, dispatch);
}

function mapStateToProps({needs, selectsReducer}, {needEdit}) {
  if(needEdit !== undefined){
    return {
      needs,
      selectsReducer,
      initialValues: {
        needType: needEdit.needIdType,
        descriptionNeed:needEdit.descriptionNeed,
        needProduct:needEdit.needIdProduct,
        needImplementation:needEdit.needIdImplementation,
        needTask:needEdit.needTask,
        needBenefits:needEdit.needBenefits,
        needResponsable:needEdit.needResponsable,
        idEmployee: needEdit.needIdResponsable,
        statusNeed:needEdit.statusIdNeed,
        needDate: moment(needEdit.needDate, 'DD MMM YYYY').format("DD/MM/YYYY")
      }

    }
  }else{
    return {
      needs,
      selectsReducer,
      initialValues: {
        needType: '',
        descriptionNeed:'',
        needProduct:'',
        needImplementation:'',
        needTask:'',
        needBenefits:'',
        needResponsable:'',
        statusNeed:'',
        needDate: ''
      }
    };
  }
}


export default reduxForm({form : 'submitValidation', fields, validate}, mapStateToProps, mapDispatchToProps)(ModalNeed);
