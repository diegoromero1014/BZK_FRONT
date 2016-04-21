import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {validateProspectExists, clearState, clearAllState} from './actions';
import {redirectUrl} from '../globalComponents/actions';
import {toggleMessage} from '../messages/actions';
import SelectTypeDocument from '../selectsComponent/SelectTypeDocument/ComponentTypeDocument';
import FormCreateProspect from './formCreateProspect';

const fields = ["idType", "idNumber"];

class CreatePropspect extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      styleTypeDocument: {},
      styleDocumentNumber: {},
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
  }

  _onchangeValue(e){
    this.setState({
      styleDocumentNumber: {}
    });
  }

  _onChangeTypeDocument(val){
    var {fields: {idType}} = this.props
    idType.onChange(val);
    this.setState({
      styleTypeDocument: {}
    });
  };

  _clickButtonCreateProps(formData){
    const {idType} = formData;
    const {idNumber} = formData;
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
    if( !error ){
      const {validateProspectExists} = this.props;
      validateProspectExists(idType, idNumber);
    } else {
      alert("Señor usuario, por favor ingrese todos los campos obligatorios(*).");
    }
  }

  render(){
    const { fields: { idType, idNumber }, error, handleSubmit, clearState} = this.props
    const {propspectReducer} = this.props;
    const status = propspectReducer.get('status');
    const validateLogin = propspectReducer.get('validateLogin');
    const prospectExist =  propspectReducer.get('prospectExist');
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
    return(
      <div style={{marginTop: "10px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
          <Row style={{padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
            <Col xs={12} md={4} lg={5}>
              <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectTypeDocument
                onChange={val => this._onChangeTypeDocument(val.id)}
                store={idType.id}
                styles={this.state.styleTypeDocument}
              />
            </Col>
            <Col xs={10} md={4} lg={5}>
              <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
                <input
                  type="text"
                  className="form-control inputDataValue"
                  style={this.state.styleDocumentNumber}
                  placeholder="Ingrese el número de documento del usuario"
                  onKeyPress={this._onchangeValue}
                  {...idNumber}
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
        {!prospectExist &&
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
    clearAllState
  }, dispatch);
}

function mapStateToProps({propspectReducer},ownerProps) {
  return {
    propspectReducer
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);
