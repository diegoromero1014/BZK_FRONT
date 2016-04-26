import React, {Component} from 'react';
import SweetAlert from 'sweetalert-react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {validateProspectExists, clearState, clearAllState} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectGeneric from '../selectsComponent/selectGeneric/selectGeneric';
import FormCreateProspect from './formCreateProspect';
import {consultDataSelect, consultList} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import _ from 'lodash';

var prospectInApplication = true;
var nameTipeDocument = "";

const validate = values => {
    const errors = {}
    if (!values.idType) {
        errors.idType = "Debe seleccionar un valor";
    } else {
      errors.idType = null;
    }
    if (!values.idNumber) {
        errors.idNumber = "Debe ingresar un valor";
    } else {
      errors.idNumber = null;
    }
    return errors
};

class CreatePropspect extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      showEr: false,
      showEx:false
    }
    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
    this._onClickButtonChange = this._onClickButtonChange.bind(this);
    this._closeError = this._closeError.bind(this);
  }

  componentWillMount(){
    const {clearAllState} = this.props;
    clearAllState();
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
    const {consultDataSelect, consultList} = this.props;
    consultDataSelect(constants.CLIENT_ID_TYPE);
    consultList(constants.TEAM_FOR_EMPLOYEE);
  }

  _closeError(){
      this.setState({showEx:false, showEr: false});
  }

  _onClickButtonChange(){
    prospectInApplication = true;
    const {clearAllState} = this.props;
    clearAllState();
  };

  _clickButtonCreateProps(formData){
    const {idType, idNumber} = formData;
    const {validateProspectExists} = this.props;
    validateProspectExists(idType, idNumber)
    .then((data) => {
      if((_.get(data, 'payload.data.status') === "Exists")){
          this.setState({showEr: true});
        } else if(_.get(data, 'payload.data.status') === "Error") {
          this.setState({showEx: true});
        }
      }, (reason) => {
        this.setState({showEx: true});
    });
  }

  render(){
    const { fields: { idType, idNumber }, error, handleSubmit, clearState} = this.props
    const {propspectReducer} = this.props;
    const {selectsReducer} = this.props;
    const status = propspectReducer.get('status');
    const validateLogin = propspectReducer.get('validateLogin');
    const prospectExist =  propspectReducer.get('prospectExist');
    if( status !== "OK" ){
      prospectInApplication = prospectExist;
    } else {
      prospectInApplication = true;
    }
    if( !validateLogin ){
      //redirectUrl("/login");
    }
    if( status === "Error" ){
      //toggleMessage("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo .");
      clearState();
      alert("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo.");
    }

    return(
      <div style={{marginTop: "10px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          {prospectInApplication &&
          <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
            <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
              <Col xs={12} md={5} lg={5}>
                <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="tipoDocumento"
                  labelInput="Ingrese el número de documento del prospecto"
                  {...idType}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeDocument')}
                />
              </Col>
              <Col xs={12} md={5} lg={5} style={{paddingRight: "30px"}}>
                <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
                  <Input
                    name="documento"
                    type="text"
                    placeholder="Ingrese el número de documento del prospecto"
                    onChange={val => this._onchangeValue("idNumber",val)}
                    {...idNumber}
                  />
              </Col>
              <Col xs={2} md={4} lg={2}>
                <button className="btn btn-default" type="submit" title="Buscar prospecto"
                  style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "20px", paddingTop: "4px !important"}}>
                  <i className="search icon" style={{color: "white"}}></i>
                </button>
              </Col>
            </Row>
          </form>
        }

        {!prospectInApplication &&
          <Row style={{marginLeft: "15px", marginTop: "20px", border: '1px solid #cecece', paddingTop: "10px", marginRight: "20px", borderRadius: "5px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Tipo de documento</span></dt>
              <dl><span>{idType.value && _.filter(selectsReducer.get('dataTypeDocument'), ['id', parseInt(idType.value)] )[0].value}</span></dl>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <dt><span>Número de documento</span></dt>
              <dl><span>{idNumber.value}</span></dl>
            </Col>
            <Col xs={12} md={3} lg={2}  style={{margingLeft: "30px"}}>
              <button className="btn" type="submit" title="Buscar prospecto"
                style={{marginTop: "10px", color: "white"}}
                onClick={this._onClickButtonChange}
              >Cambiar</button>
            </Col>
          </Row>
        }

        {!prospectInApplication &&
          <FormCreateProspect idTupeDocument={idType.value} numberDocument={idNumber.value} />
        }
        <SweetAlert
         type= "warning"
         show={this.state.showEr}
         title="Prospecto existente"
         text="El prospecto ya se encuentra registrado en la aplicación."
         onConfirm={() => this._closeError()}
         />
         <SweetAlert
          type= "error"
          show={this.state.showEr}
          title="Error"
          text="Ocurrió un error tratando de consultar si el prospecto ya se encuentra registrado en la aplicación."
          onConfirm={() => this._closeError()}
          />
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateProspectExists,
    clearState,
    clearAllState,
    consultDataSelect,
    consultList
  }, dispatch);
}

function mapStateToProps({propspectReducer, selectsReducer},ownerProps) {
  return {
    propspectReducer, selectsReducer
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields: ["idType", "idNumber"],
  validate
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);
