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
import { getClientsRiskGroup, addClientRiskGroup } from './actions';

import * as constants from '../selectsComponent/constants';

import { findClientByTypeAndNumber } from '../clients/actions';
import { consultDataSelect, consultList } from '../selectsComponent/actions';

import ClientsRiskGroup from './clientsRiskGroup';
import { showLoading } from '../loading/actions';

import _ from 'lodash';
import $ from 'jquery';


const fields = [
  "clientName", "conformationReasonId", "segmentClient"
]
const validate = values => {
  const errors = {};

  if (!values.clientName) {
    errors.clientName = VALUE_REQUIERED;
  } else {
    errors.clientName = null;
  }

  if (!values.conformationReasonId) {
    errors.conformationReasonId = VALUE_REQUIERED;
  } else {
    errors.conformationReasonId = null;
  }

  if (!values.segmentClient) {
    errors.segmentClient = VALUE_REQUIERED;
  } else {
    errors.segmentClient = null;
  }

  return errors;
};

var thisForm;
class memberRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      showErrorForm: false,
      csss: "dafdsaf"
    };

    this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
    this._closeError = this._closeError.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);

    thisForm = this;
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() {

    const { fields: { clientName }, consultDataSelect, consultList, clientsBasicInfo } = this.props;
    consultDataSelect(constants.SEGMENTS).then((data) => {
      if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
        redirectUrl("/login");
      }
    });
    consultDataSelect(constants.REASON_CONFORMATION).then((data) => {
      if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
        redirectUrl("/login");
      }
    });

    // clientName.onChange(clientsBasicInfo.nameClient);
  }

  _onchangeValue(file, val) {
    switch (file) {
      case "clientName":
        var { fields: { clientName } } = this.props;
        clientName.onChange(val);
        break;
      case "conformationReasonId":
        var { fields: { conformationReasonId } } = this.props;
        conformationReasonId.onChange(val);
        break;
      case "segmentClient":
        var { fields: { segmentClient } } = this.props;
        segmentClient.onChange(val);
        break;

      default:
        break;
    }

  }


  _handlerSubmitGroup() {
    const { fields: { clientName, conformationReasonId, segmentClient }, riskGroup,
      swtShowMessage, isOpen, clientsBasicInfo, documentType, documentNumber, addClientRiskGroup } = this.props;
    const jsonUpdateGroup = {
      idClient: clientsBasicInfo.idClient,
      documentTypeId: documentType,
      documentNumber: documentNumber,
      clientName: clientName.value,
      segmentClientId: segmentClient.value,
      conformationReasonId: conformationReasonId.value,
      riskGroupId: riskGroup.id
    }
    const self = this;

    addClientRiskGroup(jsonUpdateGroup).then((data) => {
      if (validateResponse(data)) {

        let result = _.get(data, 'payload.data.data', "");
        if (result != "hasGroup" && result != "error") {
          swtShowMessage('success',
            'Cliente pendiente por Aprobacion',
            'Señor usuario, para agregar el cliente, debe ser aprobado por el analista de Riesgos.');
        } else {
          let msjError = 'Señor usuario, ocurrió un error tratando de agregar el cliente.';
          let msjHasGroup = 'Señor usuario, este cliente ya pertenece a un grupo de riesgo.';
          swtShowMessage('error', 'Error agregando el cliente', (result == "hasGroup" ? msjHasGroup : msjError));
        }

        this.setState({
          showForm: true,
          disabledPrimaryFields: true,
          clientsBasicInfo: _.get(data, 'payload.data.data', {})
        });


      } else {
        swtShowMessage('error', 'Error agregando el cliente', 'Señor usuario, ocurrió un error tratando de agregar el cliente.');
      }

      isOpen();

    }, (reason) => {
      this.setState({ showConfirmCreateUser: true });
      // changeStateSaveData(false, "");
      swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, ocurrió un error tratando de agregar el cliente.');
      isOpen();
    })


    //    

  }

  render() {

    const { fields: { clientName, conformationReasonId, segmentClient }, handleSubmit, clientsBasicInfo, isOpen } = this.props;
    const { selectsReducer, clientR } = this.props;


    return (

      <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
        onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }} >
        <div id="content-modal-rosk-group" className="modalBt4-body modal-body business-content editable-form-content clearfix"
          style={{ overflowX: "hidden", marginBottom: '15px', height: "auto" }}>


          <Row style={{ padding: "10px 20px 20px 20px" }}>

            <Col xs={12} md={6} lg={6} style={{ paddingRight: "30px" }}>
              <dt><span>Nombre del cliente (</span><span style={{ color: "red" }}>*</span>)</dt>
              {clientsBasicInfo.nameClient &&
                <p>{clientsBasicInfo.nameClient}</p>
              }
              {!clientsBasicInfo.nameClient &&
                <Input
                  name="nombre"
                  type="text"
                  onChange={val => this._onchangeValue("clientName", val)}
                  placeholder="Ingrese el nombre del cliente"
                  {...clientName}
                />
              }
            </Col>

            <Col xs={12} md={6} lg={6} style={{ paddingRight: "30px" }}>
              <dt><span>Segmento (</span><span style={{ color: "red" }}>*</span>)</dt>

              {clientsBasicInfo.segmentId &&
                <p>{clientsBasicInfo.segment}</p>
              }
              {!clientsBasicInfo.segmentId &&
                <ComboBox
                  name="semento"
                  labelInput="Seleccione un segemento"
                  onChange={val => this._onchangeValue("segmentClient", val)}
                  {...segmentClient}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('segment')}
                />
              }



            </Col>

            <Col xs={12} md={6} lg={6}>
              <dt><span>Razon de conformación (</span><span style={{ color: "red" }}>*</span>)</dt>
              <ComboBox
                name="razonConformacion"
                labelInput="Seleccione la razon de conformación"
                {...conformationReasonId}
                onChange={val => this._onchangeValue("conformationReasonId", val)}

                valueProp={'id'}
                textProp={'value'}
                data={selectsReducer.get('reasonConformation')}
              />
            </Col>

            <SweetAlert
              type="error"
              show={this.state.showErrorForm}
              title="Campos obligatorios"
              text="Señor usuario, para agregar un cliente debe ingresar los campos obligatorios."
              onConfirm={() => this.setState({ showErrorForm: false })}
            />
          </Row>

        </div >
        <div className="modalBt4-footer modal-footer" style={{ position: "absolute", width: "100%", bottom: "0" }}>
          <button className="btn btn-prymary" type="submit"
            style={{ cursor: 'pointer', marginLeft: "20px" }}>
            <i className="trash icon"></i> Agregar </button>
          <button className="btn btn-default active" type="button"
            style={{ cursor: 'pointer', marginLeft: "20px" }} onClick={() => { isOpen() }}>
            Cancelar </button>
        </div>
      </form >


    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClientsRiskGroup,
    nonValidateEnter,
    showLoading,
    swtShowMessage,
    addClientRiskGroup,
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({ riskGroupReducer, clientInformacion, selectsReducer, clientR }, ownerProps) {
  return {
    riskGroupReducer,
    clientInformacion,
    selectsReducer,
    initialValues: {
      clientName: ownerProps.clientsBasicInfo ? ownerProps.clientsBasicInfo.nameClient : null,
      segmentClient: ownerProps.clientsBasicInfo ? ownerProps.clientsBasicInfo.segmentId : null
    },
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
}, mapStateToProps, mapDispatchToProps)(memberRiskGroup);
