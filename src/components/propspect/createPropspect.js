import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {validateProspectExists, clearState, clearAllState} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import {toggleMessage} from '../messages/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectGeneric from '../selectsComponent/selectGeneric/selectGeneric';
import FormCreateProspect from './formCreateProspect';
import {consultDataSelect, consultList} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';

const fields = ["idType", "idNumber", "idCelula"];
var prospectInApplication = true;

class CreatePropspect extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      styleTypeDocument: {},
      styleDocumentNumber: {},
      styleCelula: {}
    }
    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);
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

  _onchangeValue(type, val){
    switch (type) {
      case "celula":
        var {fields: {idCelula}} = this.props;
        idCelula.onChange(val);
        this.setState({
          styleCelula: {}
        });
      break;
        break;
      case "idNumber":
        var {fields: {idNumber}} = this.props;
        idNumber.onChange(val);
        this.setState({
          styleDocumentNumber: {}
        });
        break;
      default:
        break;
    }

    const {clearState} = this.props;
    clearState();
  }

  _onChangeTypeDocument(val){
    var {fields: {idType}} = this.props
    idType.onChange(val);
    this.setState({
      styleTypeDocument: {}
    });
    const {clearState} = this.props;
    clearState();
  };

  _onChangeCelula(val){
    var {fields: {idCelula}} = this.props
    idCelula.onChange(val);
    this.setState({
      styleCelula: {}
    });
    const {clearState} = this.props;
    clearState();
  };

  _clickButtonCreateProps(formData){
    const {idType, idNumber, idCelula} = formData;
    var styleError = {borderColor: "red"};
    var error = false;
    if( idType === null || idType === undefined ){
      error = true;
      this.setState({
        styleTypeDocument: styleError
      })
    }
    if( idNumber === null || idNumber === undefined || idNumber === "" ){
      error = true;
      this.setState({
        styleDocumentNumber: styleError
      })
    }
    if( idCelula === null || idCelula === undefined || idCelula === "" ){
      error = true;
      this.setState({
        styleCelula: styleError
      })
    }
    if( !error ){
      const {validateProspectExists} = this.props;
      validateProspectExists(idType, idNumber);
    } else {
      alert("Señor usuario, por favor ingrese todos los campos obligatorios(*).");
    }
  }

  render(){
    const { fields: { idType, idNumber, idCelula }, error, handleSubmit, clearState} = this.props
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
     if(status === "Exists" ){
       clearState();
       //toggleMessage("Señor usuario, ocurrió en error tratando de validar si el prospecto existe, por favor intentelo .");
       alert("Señor usuario, el prospecto que desea registrar, ya se encuentra creado en la aplicación.");
    }
    var options = ["apple", "mango", "grapes", "melon", "strawberry"].map(function(fruit){
                return {label: fruit, value: fruit}
            });
    return(
      <div style={{marginTop: "10px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
          <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
            <Col xs={12} md={3} lg={3}>
              <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectTypeDocument
                onChange={val => this._onChangeTypeDocument(val.id)}
                store={idType.id}
                styles={this.state.styleTypeDocument}
              />
            </Col>
            <Col xs={12} md={3} lg={3} style={{paddingRight: "30px"}}>
              <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
                <input
                  type="text"
                  className="form-control inputDataValue"
                  style={this.state.styleDocumentNumber}
                  placeholder="Ingrese el número de documento del usuario"
                  onKeyPress={val => this._onchangeValue("idNumber", val)}
                  {...idNumber}
                />
            </Col>
            <Col xs={10} md={4} lg={4}>
              <dt><span>Célula (</span><span style={{color: "red"}}>*</span>)</dt>
                <SelectGeneric
                  onChange={val => this._onChangeCelula(val.id)}
                  store={idType.id}
                  valueField={'id'}
                  textField={'value'}
                  style={this.state.styleCelula}
                  data={selectsReducer.get('dataTypeDocument')}
                />
            </Col>
            <Col xs={2} md={4} lg={2}>
              <button className="btn btn-default" type="submit" title="Buscar prospecto"
                style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "25px", paddingTop: "4px !important"}}>
                <i className="icon-search" style={{color: "white"}}></i>
              </button>
            </Col>
          </Row>
        </form>
        { !prospectInApplication &&
          <FormCreateProspect />
        }

      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    validateProspectExists,
    toggleMessage,
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
  fields
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);
