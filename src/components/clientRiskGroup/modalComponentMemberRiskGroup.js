import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { reduxForm } from 'redux-form';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';

import SweetAlert from 'sweetalert-react';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { REQUEST_ERROR, ERROR_MESSAGE_REQUEST, MESSAGE_USER_WITHOUT_PERMISSIONS, MESSAGE_LOAD_DATA, VALUE_REQUIERED, SESSION_EXPIRED } from '../../constantsGlobal';
import { stringValidate, validateValueExist, validateResponse, formValidateKeyEnter, nonValidateEnter } from '../../actionsGlobal';
import { bindActionCreators } from 'redux';


import * as constants from '../selectsComponent/constants';

import { findClientByTypeAndNumber } from '../clients/actions';
import { consultDataSelect, consultList } from '../selectsComponent/actions';

import ClientsRiskGroup from './clientsRiskGroup';
import { showLoading } from '../loading/actions';

import MemberRiskGroup from './memberRiskGroup'

import _ from 'lodash';
import $ from 'jquery';


const fields = [
  "idType", "idNumber"

]
const validate = values => {
  const errors = {};

  if (!values.idType) {
    errors.idType = VALUE_REQUIERED;
  } else {
    errors.idType = null;
  }

  if (!values.idNumber) {
    errors.idNumber = VALUE_REQUIERED;
  } else {
    errors.idNumber = null;
  }

  return errors;
};

var thisForm;
class modalComponentMemberRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      showErrorForm: false,
      showForm: false,
      showConfirmCreateUser: false,
      disabledPrimaryFields: false,
      clientsBasicInfo: {}
    };

    this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
    this._closeError = this._closeError.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);
    this.confirmExtClients = this.confirmExtClients.bind(this);
    thisForm = this;
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() {
    const { consultDataSelect, consultList } = this.props;

    this.setState({ showForm: false });

    consultDataSelect(constants.CLIENT_ID_TYPE).then((data) => {
      if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
        redirectUrl("/login");
      }
    });

  }

  _onchangeValue(file, val) {

    switch (file) {
      case "idType":
        var { fields: { idType } } = this.props;
        idType.onChange(val);
        break;
      case "idNumber":
        var { fields: { idNumber } } = this.props;
        idNumber.onChange(val);
        break;

      default:
        break;
    }
  }


  _handlerSubmitGroup() {
    const { fields: { idType, idNumber }, swtShowMessage, isOpen, findClientByTypeAndNumber } = this.props;

    const jsonUpdateGroup = {
      typeDocument: idType.value !== undefined ? idType.value : null,
      numberDocument: idNumber.value !== undefined ? idNumber.value : null
    }
    const self = this;

    findClientByTypeAndNumber(jsonUpdateGroup).then((data) => {
      if (validateResponse(data)) {
        this.setState({
          showForm: true,
          disabledPrimaryFields: true,
          clientsBasicInfo: _.get(data, 'payload.data.data', {})
        });
      } else {
        swtShowMessage('error', 'Error retirando el cliente', 'Señor usuario, ocurrió un error tratando de retirar el cliente.');
      }
     

    }, (reason) => {
      this.setState({ showConfirmCreateUser: true });
    })
  }

  confirmExtClients(confirm) {
    if (confirm) {
      this.setState({
        showConfirmCreateUser: false,
        disabledPrimaryFields: true,
        showForm: true,
        clientsBasicInfo: {}
      })
    } else {
      this.setState({
        showConfirmCreateUser: false
      })
    }
  }

  render() {

    const { fields: { idType, idNumber }, handleSubmit, isOpen, riskGroup } = this.props;
    const { selectsReducer, clientR } = this.props;


    return (
      <div>

        <div id="content-modal-rosk-group" className="modalBt4-body modal-body business-content editable-form-content clearfix"
          style={{ overflowX: "hidden" }}>

          <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
            onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }} >

            <Row style={{ padding: "10px 20px 0px" }}>


              <Col xs={12} md={!this.state.disabledPrimaryFields ? 5 : 6}>
                <dt><span>Tipo de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="tipoDocumento"
                  onChange={val => this._onchangeValue("idType", val)}
                  labelInput="Seleccion el tipo de documento del prospecto"
                  {...idType}
                  disabled={this.state.disabledPrimaryFields ? "disabled" : ""}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeDocument')}
                />


              </Col>
              <Col xs={12} md={!this.state.disabledPrimaryFields ? 5 : 6} style={{ paddingRight: "30px" }}>
                <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                <Input
                  name="documento"
                  type="text"
                  max="20"
                  disabled={this.state.disabledPrimaryFields}
                  placeholder="Ingrese el número de documento del prospecto"
                  {...idNumber}
                />
              </Col>
              {!this.state.disabledPrimaryFields &&
                <Col xs={2} md={4} lg={2} style={{ height: "73px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                  <button className="btn btn-primary" type="submit" title="Buscar cliente"
                    style={{ fontSize: '1.2em' }}>
                    <i className="search icon" ></i>
                  </button>
                </Col>
              }



              <SweetAlert
                type="warning"
                show={this.state.showConfirmCreateUser}
                showCancelButton={true}
                title="Busqueda de cliente"
                text="Señor usuario, el usuario no fue encontrado, desea crear uno."
                onConfirm={() => this.setState({
                  showConfirmCreateUser: false,
                  disabledPrimaryFields: true,
                  showForm: true,
                  clientsBasicInfo: {}
                })}
                onCancel={() => this.setState({ showConfirmCreateUser: false })}
              />
            </Row>
          </form >

          {this.state.showForm &&
            <MemberRiskGroup
              isOpen={isOpen}
              riskGroup={riskGroup}
              clientsBasicInfo={this.state.clientsBasicInfo}
              documentType={idType.value}
              documentNumber={idNumber.value}
            />
          }
        </div >

        <div className="modalBt4-footer modal-footer" >
          {this.state.showForm &&
            <button className="btn btn-prymary" type="submit"
              form={"submitMemberForm"} style={{ cursor: 'pointer', marginLeft: "20px" }}>
              <i className="trash icon"></i> Agregar </button>
          }
          <button className="btn btn-default active" type="button"
            style={{ cursor: 'pointer', marginLeft: "20px" }} onClick={() => { isOpen() }}>
            Cancelar </button>
        </div>
      </div>

    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    nonValidateEnter,
    showLoading,
    swtShowMessage,
    findClientByTypeAndNumber,
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({ riskGroupReducer, clientInformacion, selectsReducer, clientR }, ownerProps) {
  return {
    riskGroupReducer,
    clientInformacion,
    selectsReducer,
    clientR
  };
}

export default reduxForm({
  form: 'submitMember',
  fields,
  destroyOnUnmount: true,
  validate,
  onSubmitFail: errors => {
    thisForm.setState({ showErrorForm: true });
  }
}, mapStateToProps, mapDispatchToProps)(modalComponentMemberRiskGroup);
