import React, { Component } from 'react';
import { Col, Row } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import SweetAlert from '../sweetalertFocus';
import FormCreateProspect from './formCreateProspect';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import { fields, validations as validate } from './fieldsAndRulesCreatePropspect';
import SecurityMessageComponent from './../globalComponents/securityMessageComponent';

import { clearAllState, validateProspectExists } from './actions';
import { redirectUrl } from '../globalComponents/actions';
import { consultList, getMasterDataFields } from '../selectsComponent/actions';

import { onSessionExpire } from '../../actionsGlobal';
import * as constants from '../selectsComponent/constants';
import * as constantsPropect from './constants';

var prospectInApplication = true;

var typeMessage = "warning";
var titleMessage = "Prospecto/cliente existente";
var message = "El prospecto/cliente ya se encuentra registrado en la aplicación.";

export class CreatePropspect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEr: false,
      showEx: false,
      idTypeMaster: [],
      idTypeMasterSelector: "",
      personType: null
    }
    this.clickButtonCreateProps = this.clickButtonCreateProps.bind(this);
    this.onClickButtonChange = this.onClickButtonChange.bind(this);
    this.clientetypeChange = this.clientetypeChange.bind(this);
    this.closeError = this.closeError.bind(this);
  }

  componentWillMount() {
    const { dispatchClearAllState } = this.props;
    dispatchClearAllState();
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    }
    const { dispatchConsultList, dispatchGetMasterDataFields } = this.props;

    dispatchGetMasterDataFields([constants.CLIENT_ID_TYPE, constants.CONTACT_ID_TYPE, constants.CLIENT_TYPE]).then((data) => {
      if (_.get(data, 'payload.data.validateLogin') === false) {
        onSessionExpire();
      }
    });

    dispatchConsultList(constants.TEAM_FOR_EMPLOYEE);
  }

  closeError = () => {
    this.setState({ showEx: false, showEr: false });
  }

  onClickButtonChange = () => {
    prospectInApplication = true;
    const { fields: { idType, idNumber, clientType }, dispatchClearAllState } = this.props;
    dispatchClearAllState();
    idNumber.onChange('');
    idType.onChange('');
    clientType.onChange('');

    this.setState({
      idTypeMaster: [],
      idTypeMasterSelector: "",
      personType: null
    });

  }

  clickButtonCreateProps = () => {
    const { fields: { idType, idNumber }, dispatchValidateProspectExists } = this.props;
    idNumber.onChange(idNumber.value.trim());
    dispatchValidateProspectExists(idType.value, idNumber.value.trim())
      .then((data) => {
        if ((_.get(data, 'payload.data.data.status') === "Exists")) {
          typeMessage = "warning";
          titleMessage = "Prospecto/cliente existente";
          message = "El prospecto/cliente ya se encuentra registrado en la aplicación.";
          this.setState({ showEr: true });
        } else if (_.get(data, 'payload.data.data.status') === 500) {
          typeMessage = "error";
          titleMessage = "Error";
          message = "Ocurrió un error tratando de consultar si el prospecto ya se encuentra registrado en la aplicación.";
          this.setState({ showEx: true });
        }
      }, (reason) => {
        this.setState({ showEx: true });
      });
  }


  clientetypeChange = valor => {
    const { fields: { idType }, selectsReducer } = this.props;
    let clientTypes = selectsReducer.get('clientType');

    if (clientTypes) {
      let clientType = clientTypes.find(type => type.id == valor);
      let idTypeMaster = clientType.key == constantsPropect.NATURE_PERSON ?
        constants.CONTACT_ID_TYPE : constants.CLIENT_ID_TYPE;


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
    const { fields: { idType, idNumber, clientType }, handleSubmit } = this.props;
    const { propspectReducer } = this.props;
    const { selectsReducer } = this.props;
    const status = propspectReducer.get('status');
    const prospectExist = propspectReducer.get('prospectExist');
    if (status !== "OK") {
      prospectInApplication = prospectExist;
    } else {
      prospectInApplication = true;
    }

    return (
      <div style={{ marginTop: "10px" }}>
        <SecurityMessageComponent />
        <span style={{ marginLeft: "20px" }} >Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
        {prospectInApplication &&
          <form onSubmit={handleSubmit(this.clickButtonCreateProps)}>
            <Row style={{ padding: "10px 10px 20px 20px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)" }}>
              <Col xs={12} md={5} lg={3}>
                <dt><span>Tipo de cliente (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="tipoCliente"
                  labelInput="Seleccione el tipo de persona del prospecto"
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
                  labelInput="Seleccione el tipo de documento del prospecto"
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
                  max="30"
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
              <button className="btn" type="button" title="cambiar tipo de cliente, tipo de documento y número documento"
                style={{ marginTop: "5px", color: "white" }}
                onClick={this.onClickButtonChange}
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
          onConfirm={() => this.closeError()}
        />
      </div>
    );
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchValidateProspectExists : validateProspectExists,
    dispatchClearAllState : clearAllState,
    dispatchConsultList : consultList,
    dispatchGetMasterDataFields : getMasterDataFields
  }, dispatch);


const mapStateToProps = ({ propspectReducer, selectsReducer }) => ({ propspectReducer, selectsReducer })

export default reduxForm({
  form: 'submitValidation',
  fields: fields,
  validate,
  onSubmitFail: errors => {
    thisForm.setState({ showEr: true });
  }
}, mapStateToProps, mapDispatchToProps)(CreatePropspect);