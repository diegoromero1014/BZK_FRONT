import React, { Component } from 'react';
import SweetAlert from '../sweetalertFocus';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { validateProspectExists, clearState, clearAllState } from './actions';
import { redirectUrl } from '../globalComponents/actions';
import SelectGeneric from '../selectsComponent/selectGeneric/selectGeneric';
import FormCreateProspect from './formCreateProspect';
import { consultDataSelect, consultList, getMasterDataFields } from '../selectsComponent/actions';
import { SESSION_EXPIRED, VALUE_XSS_INVALID } from '../../constantsGlobal';
import * as constants from '../selectsComponent/constants';
import * as constantsPropect from './constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import { xssValidation, onSessionExpire } from '../../actionsGlobal';
import _ from 'lodash';

var prospectInApplication = true;
var nameTipeDocument = "";

var typeMessage = "warning";
var titleMessage = "Prospecto/cliente existente";
var message = "El prospecto/cliente ya se encuentra registrado en la aplicación.";

const validate = values => {
  const errors = {}
  if (!values.idType) {
    errors.idType = "Debe seleccionar un valor";
  }
  else {
    errors.idType = null;
  }

  if (!values.clientType) {
    errors.clientType = "Debe seleccionar un valor";
  }
  else {
    errors.clientType = null;
  }

  if (!values.idNumber) {
    errors.idNumber = "Debe ingresar un valor";
  }
  else if (xssValidation(values.idNumber)) {
    errors.idNumber = VALUE_XSS_INVALID;
  }
  else {
    errors.idNumber = null;
  }
  return errors
};

class CreatePropspect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEr: false,
      showEx: false,
      idTypeMaster: [],
      idTypeMasterSelector: "",
      personType: null
    }
    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
    this._onClickButtonChange = this._onClickButtonChange.bind(this);
    this.clientetypeChange = this.clientetypeChange.bind(this);
    this._closeError = this._closeError.bind(this);
  }

  componentWillMount() {
    const { clearAllState } = this.props;
    clearAllState();
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    }
    const { consultDataSelect, consultList, getMasterDataFields } = this.props;

    getMasterDataFields([constants.CLIENT_ID_TYPE, constants.CLIENT_TYPE, constants.DOCUMENT_TYPE_PERSON]).then((data) => {
      if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
        onSessionExpire();
      }
    });

    consultList(constants.TEAM_FOR_EMPLOYEE);
  }

  _closeError() {
    this.setState({ showEx: false, showEr: false });
  }

  _onClickButtonChange() {
    prospectInApplication = true;
    const { fields: { idType, idNumber, clientType }, clearAllState } = this.props;
    clearAllState();
    idNumber.onChange('');
    idType.onChange('');
    clientType.onChange('');
  };

  _clickButtonCreateProps(formData) {
    const { fields: { idType, idNumber }, validateProspectExists } = this.props;
    idNumber.onChange(idNumber.value.trim());
    validateProspectExists(idType.value, idNumber.value.trim())
      .then((data) => {
        if ((_.get(data, 'payload.data.status') === "Exists")) {
          typeMessage = "warning";
          titleMessage = "Prospecto/cliente existente";
          message = "El prospecto/cliente ya se encuentra registrado en la aplicación.";
          this.setState({ showEr: true });
        } else if (_.get(data, 'payload.data.status') === "Error") {
          typeMessage = "error";
          titleMessage = "Error";
          message = "Ocurrió un error tratando de consultar si el prospecto ya se encuentra registrado en la aplicación.";
          this.setState({ showEx: true });
        }
      }, (reason) => {
        this.setState({ showEx: true });
      });
  }


  clientetypeChange(valor) {
    const { fields: { idType }, selectsReducer } = this.props;
    let clientTypes = selectsReducer.get('clientType');
    
    if (clientTypes) {
      let clientType = clientTypes.find(type => type.id == valor);
      let idTypeMaster = clientType.key == constantsPropect.NATURE_PERSON ?
        constants.DOCUMENT_TYPE_PERSON : constants.CLIENT_ID_TYPE;

      this.setState({
        idTypeMaster: selectsReducer.get(idTypeMaster),
        idTypeMasterSelector: idTypeMaster,
        personType: _.filter(selectsReducer.get('clientType'), ['id', parseInt(valor)]).pop()
      });

    } else {
      this.setState({
        idTypeMaster: [],
        idTypeMasterSelector: "",
        personType: null
      });
    }

    idType.onChange('');


  }

  render() {
    const { fields: { idType, idNumber, clientType }, error, handleSubmit, clearState } = this.props
    const { propspectReducer } = this.props;
    const { selectsReducer } = this.props;
    const status = propspectReducer.get('status');
    const validateLogin = propspectReducer.get('validateLogin');
    const prospectExist = propspectReducer.get('prospectExist');
    if (status !== "OK") {
      prospectInApplication = prospectExist;
    } else {
      prospectInApplication = true;
    }
    return (
      <div style={{ marginTop: "10px" }}>
        <span style={{ marginLeft: "20px" }} >Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
        {prospectInApplication &&
          <form onSubmit={handleSubmit(this._clickButtonCreateProps)}>
            <Row style={{ padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)" }}>
              <Col xs={12} md={5} lg={3}>
                <dt><span>Tipo de cliente (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="tipoCliente"
                  labelInput="Seleccion el tipo de persona del prospecto"
                  {...clientType}
                  valueProp={'id'}
                  textProp={'value'}
                  onChange={this.clientetypeChange}
                  data={selectsReducer.get('clientType')}
                />
              </Col>
              <Col xs={12} md={5} lg={4}>
                <dt><span>Tipo de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="tipoDocumento"
                  labelInput="Seleccion el tipo de documento del prospecto"
                  {...idType}
                  valueProp={'id'}
                  textProp={'value'}
                  data={this.state.idTypeMaster}
                />
              </Col>
              <Col xs={12} md={5} lg={3} style={{ paddingRight: "30px" }}>
                <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                <Input
                  name="documento"
                  type="text"
                  max="20"
                  placeholder="Ingrese el número de documento del prospecto"
                  {...idNumber}
                />
              </Col>
              <Col xs={2} md={4} lg={2}>
                <button className="btn btn-primary" type="submit" title="Buscar prospecto"
                  style={{ marginLeft: "30px", marginTop: "20px", fontSize: '1.2em', paddingTop: "4px !important" }}>
                  <i className="search icon" style={{ color: "white" }}></i>
                </button>
              </Col>
            </Row>
          </form>
        }

        {!prospectInApplication &&
          <Row style={{ marginLeft: "15px", marginTop: "20px", border: '1px solid #cecece', paddingTop: "10px", marginRight: "35px", borderRadius: "5px" }}>            
            <Col xs={12} md={3} lg={3}>
              <dt><span>Tipo de cliente</span></dt>
              <dl><span>{clientType.value && this.state.personType.value}</span></dl>
            </Col>
            <Col xs={12} md={3} lg={4}>
              <dt><span>Tipo de documento</span></dt>
              <dl><span>{idType.value && _.filter(selectsReducer.get(this.state.idTypeMasterSelector), ['id', parseInt(idType.value)])[0].value}</span></dl>
            </Col>
            <Col xs={12} md={3} lg={3}>
              <dt><span>Número de documento</span></dt>
              <dl><span>{idNumber.value}</span></dl>
            </Col>
            <Col xs={12} md={3} lg={2} style={{ margingLeft: "30px" }}>
              <button className="btn" type="button" title="cambiar tipo y número documento"
                style={{ marginTop: "5px", color: "white" }}
                onClick={this._onClickButtonChange}
              >
                <i style={{ color: "white", margin: '0em', fontSize: '1.2em' }} className="erase icon" ></i>
              </button>
            </Col>
          </Row>
        }

        {!prospectInApplication &&
          <FormCreateProspect clientType={this.state.personType} idTupeDocument={idType.value} numberDocument={idNumber.value} />
        }
        <SweetAlert
          type={typeMessage}
          show={this.state.showEr}
          title={titleMessage}
          text={message}
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
    consultList,
    getMasterDataFields
  }, dispatch);
}

function mapStateToProps({ propspectReducer, selectsReducer }, ownerProps) {
  return {
    propspectReducer, selectsReducer
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields: ["idType", "idNumber", "clientType"],
  validate,
  onSubmitFail: errors => {

    if (Object.keys(errors).map(i => errors[i]).indexOf(VALUE_XSS_INVALID) > -1) {
      thisForm.setState({ showEr: true });
    } else {
      thisForm.setState({ showEr: true });
    }

  }
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);
