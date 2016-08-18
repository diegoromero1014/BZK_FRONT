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
import {getMasterDataFields} from '../../selectsComponent/actions';
import {STATUS_AREAS} from './constants';
import {addArea, editArea} from './actions';
import _ from 'lodash';
import $ from 'jquery';

const fields = ["idEmployee","areaDes", "actionArea", "areaResponsable", "areaDate", "statusArea"];
const errors = {};
var usersBanco = [];
var idUsuario, nameUsuario;
const validate = (values) => {
  if(!values.areaDes){
    errors.areaDes = "Debe ingresar un valor";
  }else{
    errors.areaDes = null;
  }
  if(!values.actionArea){
    errors.actionArea = "Debe ingresar un valor";
  }else{
    errors.actionArea = null;
  }
  if(!values.areaResponsable){
    errors.areaResponsable = "Debe ingresar un valor";
  }else{
    errors.areaResponsable = null;
  }
  if(!values.statusArea){
    errors.statusArea = "Debe seleccionar una opción";
  }else{
    errors.statusArea = null;
  }
  if(!values.areaDate){
    errors.areaDate = "Debe seleccionar una fecha";
  }else{
    errors.areaDate = null;
  }
  return errors;
};
class ModalArea extends Component {

  constructor(props) {
    super(props);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._handleCreateArea = this._handleCreateArea.bind(this);
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
    const {fields:{idEmployee,areaDes, actionArea, areaResponsable, areaDate,statusArea}, areaEdit} = this.props;
    if(areaEdit !== undefined){
      areaDes.onChange(areaEdit.areaDes);
      actionArea.onChange(areaEdit.actionArea);
      areaResponsable.onChange(areaEdit.areaResponsable);
      idEmployee.onChange(areaEdit.areaIdResponsable);
      statusArea.onChange(areaEdit.statusIdArea);
      areaDate.onChange(moment(areaEdit.areaDate, 'DD MMM YYYY').format("DD/MM/YYYY"));
    }
  }

  _closeCreate(){
    const {isOpen, areaEdit} = this.props;
    if(areaEdit !== undefined){
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

  _handleCreateArea(){
    const {fields:{idEmployee,areaDes, actionArea, areaResponsable, areaDate,statusArea}, handleSubmit, error, addArea, editArea, areaEdit,selectsReducer} = this.props;
    var status = _.get(_.filter(selectsReducer.get(STATUS_AREAS), ['id',  parseInt(statusArea.value)]), '[0].value');
    if(areaResponsable.value !== nameUsuario){
      nameUsuario = areaResponsable.value;
      idUsuario = idEmployee.value;
    }
     if(areaEdit !== undefined){
       areaEdit.actionArea = actionArea.value;
       areaEdit.areaDes = areaDes.value;
       areaEdit.statusIdArea = statusArea.value;
       areaEdit.statusArea = status;
       areaEdit.areaIdResponsable = idUsuario;
       areaEdit.areaResponsable = nameUsuario;
       editArea(areaEdit);
        this.setState({
          showSuccessEdit: true
        });
      }else{
        const uuid = _.uniqueId('area_');
        var area = {
          uuid,
          areaDes: areaDes.value,
          actionArea :actionArea.value,
          areaIdResponsable: idUsuario,
          areaResponsable: nameUsuario,
          areaDate: areaDate.value,
          statusIdArea:statusArea.value,
          statusArea:status
        }
        addArea(area);
        this.setState({
          showSuccessAdd: true
        });
      }
  }

  updateKeyValueUsersBanco(e){
    const {fields: {areaResponsable,idEmployee}, filterUsersBanco} = this.props;
    const selector =  $('.ui.search.areaResponsable');
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      if(areaResponsable.value !== "" && areaResponsable.value !== null && areaResponsable.value !== undefined){
        selector.toggleClass('loading');
        filterUsersBanco(areaResponsable.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          selector.search({
              cache: false,
              source: usersBanco,
              searchFields: [
                'title',
                'description'
              ],
              onSelect : function(event) {
                  areaResponsable.onChange(event.title);
                  idEmployee.onChange(event.idUsuario);
                  return 'default';
              }
            });
            selector.toggleClass('loading');
            selector.search('search local', areaResponsable.value);
            selector.focus();
          });
      }
    }
  }

  _updateValue(value){
    const{fields: {areaResponsable}} = this.props;
    areaResponsable.onChange(value);
  }

  componentWillMount() {
    const {getMasterDataFields} = this.props;
    getMasterDataFields([STATUS_AREAS]);
  }

    render() {
      const {selectsReducer} = this.props;
        const {initialValues, fields:{areaDes, actionArea, areaResponsable, areaDate,statusArea}, handleSubmit, error}= this.props;
        return (
          <form onSubmit={handleSubmit(this._handleCreateArea)}>
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
              <dt className="business-title"><span style={{paddingLeft: '20px'}}>Adicionar área al plan de negocio</span></dt>
              <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                <p style={{paddingTop: "10px", marginBottom: "0px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</p>
                <Row>
                  <Col xs>
                    <dt><span>Área (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Input
                      type="text"
                      name="areaDes"
                      {...areaDes}
                      max="200"/>
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Acciones necesarias (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                      <Textarea
                        name="actionArea"
                        type="text"
                        style={{width: '100%', height: '100%'}}
                        max="3500"
                        rows={5}
                        {...actionArea}
                        />
                    </dt>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12} lg={12}>
                    <dt><span>Responsable  (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                    <ComboBoxFilter
                      name="areaResponsable"
                      {...areaResponsable}
                      onChange={areaResponsable.onChange}
                      value={areaResponsable.value}
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
                      name="statusArea"
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...statusArea}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(STATUS_AREAS) || []}
                    />
                    </dt>
                  </Col>
                  <Col xs>
                    <dt><span>Fecha de solución (<span style={{color: "red"}}>*</span>)</span></dt>
                    <dt style={{paddingTop:"0px"}}>
                    <DateTimePickerUi
                      culture='es'
                      format={"DD/MM/YYYY"}
                      time={false}
                      {...areaDate}
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
             title="Área agregada"
             text="Señor usuario, el área fue agregada exitosamente."
             onConfirm={() => this._closeCreate()}
           />
           <SweetAlert
            type="success"
            show={this.state.showSuccessEdit}
            title="Área editada"
            text="Señor usuario, el área fue editada exitosamente."
            onConfirm={() => this._closeCreate()}
          />
          </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,filterUsersBanco,addArea,
    editArea
  }, dispatch);
}

function mapStateToProps({areas, selectsReducer}, {areaEdit}) {
  if(areaEdit !== undefined){
    return {
      areas,
      selectsReducer,
      initialValues: {
        areaDes: areaEdit.needIdType,
        actionArea:areaEdit.actionArea,
        areaResponsable:areaEdit.areaResponsable,
        idEmployee: areaEdit.areaIdResponsable,
        statusArea:areaEdit.statusIdArea,
        areaDate: moment(areaEdit.areaDate, 'DD MMM YYYY').format("DD/MM/YYYY")
      }

    }
  }else{
    return {
      areas,
      selectsReducer,
      initialValues: {
        areaDes: '',
        actionArea:'',
        areaResponsable:'',
        statusArea:'',
        areaDate: ''
      }
    };
  }
}


export default reduxForm({form : 'submitValidation', fields,validate}, mapStateToProps, mapDispatchToProps)(ModalArea);
