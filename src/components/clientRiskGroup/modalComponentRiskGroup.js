import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { reduxForm } from 'redux-form';
import Input from '../../ui/input/inputComponent';
import Textarea from '../../ui/textarea/textareaComponent';

import SweetAlert from 'sweetalert-react';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { REQUEST_ERROR, ERROR_MESSAGE_REQUEST, MESSAGE_USER_WITHOUT_PERMISSIONS, MESSAGE_LOAD_DATA, VALUE_REQUIERED } from '../../constantsGlobal';
import { stringValidate, validateValueExist, validateResponse, formValidateKeyEnter, nonValidateEnter } from '../../actionsGlobal';
import { bindActionCreators } from 'redux';
import { getClientsRiskGroup, editNameRiskGroup } from './actions';
import ClientsRiskGroup from './clientsRiskGroup';
import { showLoading } from '../loading/actions';

import _ from 'lodash';
import $ from 'jquery';


const fields = ["groupName", "groupObservations"]
const validate = values => {
  const errors = {};

  if (!values.groupName) {
    errors.groupName = VALUE_REQUIERED;
  } else {
    errors.groupName = null;
  }

  if (!values.groupObservations) {
    errors.groupObservations = VALUE_REQUIERED;
  } else {
    errors.groupObservations = null;
  }

  return errors;
};

var thisForm;
class ModalComponentRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      showErrorForm: false,
      allowEditGroup: false,
      riskGroup: {}
    };

    this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
    this._closeError = this._closeError.bind(this);
    this._mapClientItems = this._mapClientItems.bind(this);
    thisForm = this;
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() {
    const { fields: { groupName }, getClientsRiskGroup, clientInformacion, nonValidateEnter, showLoading } = this.props;

    const infoClient = clientInformacion.get('responseClientInfo');

    nonValidateEnter(true);
    showLoading(true, MESSAGE_LOAD_DATA);

    this.setState({ allowEditGroup: false })

    getClientsRiskGroup(infoClient.id).then((data) => {
      let riskGroup = _.get(data, 'payload.data.data')
      this.setState({
        riskGroup: _.get(data, 'payload.data.data')
      })
      groupName.onChange(riskGroup.name);

      showLoading(false, "");

    });

  }

  _mapClientItems(data, index) {
    return <ClientsRiskGroup
      key={data.id}
      dataName={data.clientName}
      dataDocumentType={data.documentType}
      dataDocument={data.documentNumber}
    />
  }

  _onchangeValue(type, val) {
    switch (type) {
      case "groupName":
        var { fields: { groupName } } = this.props;
        groupName.onChange(val);
        break;
      case "groupObservations":
        var { fields: { groupObservations } } = this.props;
        groupObservations.onChange(val);
        break;
      default:
        break;
    }
    // const { clearState } = this.props;
    // clearState();
    // console.log(clearState);

  }
  _handlerSubmitGroup() {
    const { fields: { groupName, groupObservations }, clientInformacion, editNameRiskGroup, swtShowMessage } = this.props;

    const infoClient = clientInformacion.get('responseClientInfo');

    const jsonUpdateGroup = {
      clientId: infoClient.id,
      name: groupName.value !== undefined ? groupName.value : null,
      notification: groupObservations.value !== undefined ? groupObservations.value : null
    }
    console.log(jsonUpdateGroup)

   editNameRiskGroup(jsonUpdateGroup).then((resutl) => {

    }, (reason) => {
      // changeStateSaveData(false, "");
       swtShowMessage('error', 'Error editando grupo de riesgo', 'Señor usuario, ocurrió un error editando el grupo de riesgo.');
    })



  }

  render() {

    const {
            fields: {
                groupName, groupObservations
              },
      riskGroupReducer,
      clientInformacion,
      handleSubmit
            } = this.props;
    //riskGroupReducer.get('economicGroupClients')
    console.log("this.state.riskGroup", this.state.riskGroup)

    const riskGroup = Object.assign({}, this.state.riskGroup);
    const members = Object.assign([], this.state.riskGroup.members);
    // const members = [];
    // const riskGroup = {};


    return (
      <div id="content-modal-rosk-group" className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: "hidden", marginBottom: '15px' }}>

        <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
          onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }} >
          <Row style={{ padding: "10px 20px 20px 20px" }}>

            <Col xs={10} md={8} lg={6}>
              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <dt><span>Nombre de grupo </span>
                  {this.state.allowEditGroup && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                </dt>
                {!this.state.allowEditGroup &&
                  <p>{riskGroup.name}</p>
                }
                {this.state.allowEditGroup &&
                  <Input name="groupName"
                    type="text"
                    max="60"
                    {...groupName}
                    onChange={val => this._onchangeValue("groupName", val)}
                  />

                }
              </div>
            </Col>
            <Col xs={2} md={4} lg={6} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >
              {this.state.allowEditGroup &&
                <div>
                  <button className="btn btn-primary" type="submit" style={{ cursor: 'pointer' }} >
                    <i className="plus icon"></i> Guardar </button>
                  <button className="btn btn-default active" type="button" onClick={() => this.setState({ allowEditGroup: !this.state.allowEditGroup })}
                    style={{ cursor: 'pointer', marginLeft: "20px" }} > Cancelar </button>
                </div>
              }
              {!this.state.allowEditGroup &&
                <div>
                  <button className="btn btn-primary" type="button" onClick={() => this.setState({ allowEditGroup: !this.state.allowEditGroup })}
                    style={{ cursor: 'pointer' }} >
                    <i className="edit icon"></i> Editar </button>
                </div>
              }
              <button className="btn btn-danger" type="button"
                style={{ cursor: 'pointer', marginLeft: "20px" }}>
                <i className="trash icon"></i> Elimnar </button>
            </Col>

            {this.state.allowEditGroup &&
              <Col md={12}>

                <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  <dt><span>Nombre de grupo </span>
                    <span>(<span style={{ color: "red" }}>*</span>)</span>
                  </dt>
                  <Textarea className="form-control need-input"
                    {...groupObservations}
                    name="groupObservations"
                    maxLength="250"
                    onChange={val => this._onchangeValue("groupObservations", val)}
                  />
                </div>
              </Col>
            }
            <SweetAlert
              type="error"
              show={this.state.showErrorForm}
              title="Campos obligatorios"
              text="Señor usuario, para editar un contacto debe ingresar los campos obligatorios."
              onConfirm={() => this.setState({ showErrorForm: false })}
            />
          </Row>
        </form>

        <hr style={{ width: "100%", height: "1px", margin: "0px" }} />
        <Row style={{ padding: "10px 20px 20px 20px" }}>
          <div className="team-modal" style={{ width: "100%", display: "grid", gridTemplateColumns: "30% 30% 30%", justifyContent: "space-around", marginBottom: "30px" }}>
            {members.length === 0 ?
              <div style={{ textAlign: "center", marginTop: "15px" }}> <h4 className="form-item">Señor usuario, no hay clientes asociados a este grupo económico.</h4> </div>
              :
              members.map(this._mapClientItems)}
          </div>

        </Row>
      </div >
    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClientsRiskGroup,
    nonValidateEnter,
    showLoading,
    editNameRiskGroup,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ riskGroupReducer, clientInformacion }, ownerProps) {
  return {
    riskGroupReducer,
    clientInformacion
  };
}

// export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentRiskGroup);
export default reduxForm({
  form: 'submitGroupEdit',
  fields,
  destroyOnUnmount: true,
  validate,
  onSubmitFail: errors => {
    thisForm.setState({ showErrorForm: true });
  }
}, mapStateToProps, mapDispatchToProps)(ModalComponentRiskGroup);
