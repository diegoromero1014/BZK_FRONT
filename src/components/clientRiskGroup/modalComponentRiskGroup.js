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
import ModalComponentDeleteRiskGroup from './modalComponentDeleteRiskGroup';
import ModalComponentMemberRiskGroup from './modalComponentMemberRiskGroup';
import ClientsRiskGroup from './clientsRiskGroup';
import { showLoading } from '../loading/actions';
import Modal from 'react-modal';

import _ from 'lodash';
import $ from 'jquery';


const fields = ["groupName", "groupCode", "groupObservations"]
const validate = values => {
  const errors = {};

  if (!values.groupName) {
    errors.groupName = VALUE_REQUIERED;
  } else {
    errors.groupName = null;
  }

  if (!values.groupCode) {
    errors.groupCode = VALUE_REQUIERED;
  } else {
    errors.groupCode = null;
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
      modalDelteRiskGroupIsOpen: false,
      modalMemberIsOpen: false,
      riskGroup: {}
    };

    this.openModalDelteRiskGroup = this.openModalDelteRiskGroup.bind(this);
    this.closeModalDelteRiskGroup = this.closeModalDelteRiskGroup.bind(this);
    this.openModalMember = this.openModalMember.bind(this);
    this.closeModalMember = this.closeModalMember.bind(this);

    this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
    this._closeError = this._closeError.bind(this);
    this._mapClientItems = this._mapClientItems.bind(this);
    thisForm = this;
  }


  openModalDelteRiskGroup() {
    this.setState({ modalDelteRiskGroupIsOpen: true });
  }

  closeModalDelteRiskGroup() {
    this.setState({ modalDelteRiskGroupIsOpen: false });
  }

  openModalMember() {
    this.setState({ modalMemberIsOpen: true });
  }

  closeModalMember() {
    this.setState({ modalMemberIsOpen: false });
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() {
    const { fields: { groupName, groupCode }, getClientsRiskGroup, clientInformacion,
      nonValidateEnter, showLoading, isOpen, swtShowMessage } = this.props;

    const infoClient = clientInformacion.get('responseClientInfo');

    nonValidateEnter(true);
    showLoading(true, MESSAGE_LOAD_DATA);

    this.setState({ allowEditGroup: false })

    getClientsRiskGroup(infoClient.id).then((data) => {
      if (validateResponse(data)) {

        let riskGroup = _.get(data, 'payload.data.data')
        this.setState({
          riskGroup: _.get(data, 'payload.data.data')
        })
        groupName.onChange(riskGroup.name);
        groupCode.onChange(riskGroup.code);

      } else {
        swtShowMessage('error', 'Error consultado grupo de riesgo', 'Señor usuario, ocurrió un error tratando de consultar el grupo de riesgo.');
        isOpen();
      }

      showLoading(false, "");
    });

  }

  _mapClientItems(data, index) {
    return <ClientsRiskGroup
      key={data.id}
      dataName={data.clientName}
      dataDocumentType={data.documentType}
      dataDocument={data.documentNumber}
      client={data}
    />
  }

  _onchangeValue(type, val) {
    switch (type) {
      case "groupName":
        var { fields: { groupName } } = this.props;
        groupName.onChange(val);
        break;
      case "groupCode":
        var { fields: { groupCode } } = this.props;
        groupCode.onChange(val);
        break;
      case "groupObservations":
        var { fields: { groupObservations } } = this.props;
        groupObservations.onChange(val);
        break;
      default:
        break;
    }

  }
  _handlerSubmitGroup() {
    const { fields: { groupName, groupCode, groupObservations }, clientInformacion, editNameRiskGroup, swtShowMessage } = this.props;

    const infoClient = clientInformacion.get('responseClientInfo');

    const riskGroup = Object.assign({}, this.state.riskGroup);

    const jsonUpdateGroup = {
      id: riskGroup.id,
      name: groupName.value !== undefined ? groupName.value : null,
      code: groupCode.value !== undefined ? groupCode.value : null,
      observation: groupObservations.value !== undefined ? groupObservations.value : null
    }
    const self = this;

    editNameRiskGroup(jsonUpdateGroup).then((data) => {

      if (validateResponse(data)) {
        swtShowMessage('success', 'Grupo de riesgo modificado', 'Señor usuario, La edición del nombre debe ser aprobada por el analista de riesgos. En caso de no ser aprobado, se regresará al nombre anterior.');

        getClientsRiskGroup(infoClient.id);
        groupObservations.onChange("");

        self.setState({
          showError: false,
          showErrorForm: false,
          allowEditGroup: false,
          riskGroup: Object.assign(self.state.riskGroup, {
            name: groupName.value,
            code: groupCode.value
          })
        });

      } else {
        swtShowMessage('error', 'Error editando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de editar el grupo de riesgo.');
      }

    }, (reason) => {
      swtShowMessage('error', 'Error editando grupo de riesgo', 'Señor usuario, ocurrió un error editando el grupo de riesgo.');
    })



  }

  render() {

    const { fields: { groupName, groupCode, groupObservations },
      riskGroupReducer, clientInformacion, handleSubmit } = this.props;

    const riskGroup = riskGroupReducer.get('riskGroupClients')

    const _riskGroup = Object.assign({}, riskGroup);
    const members = Object.assign([], _riskGroup.members);


    return (
      <div id="content-modal-rosk-group" className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: "hidden", marginBottom: '15px' }}>

        <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
          onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }} >
          <Row style={{ padding: "10px 20px 20px 20px" }}>

            <Col xs={10} md={6} lg={3}>
              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <dt><span>Código del grupo </span>
                  {this.state.allowEditGroup && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                </dt>
                {!this.state.allowEditGroup &&
                  <p style={{ wordBreak: "break-word" }}>{riskGroup ? riskGroup.code : ""}</p>
                }
                {this.state.allowEditGroup &&
                  <Input name="groupCode"
                    type="text"
                    max="60"
                    {...groupCode}
                    onChange={val => this._onchangeValue("groupCode", val)}
                  />

                }
              </div>
            </Col>

            <Col xs={10} md={6} lg={this.state.allowEditGroup ? 9 : 5}>
              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <dt><span>Nombre del grupo </span>
                  {this.state.allowEditGroup && <span>(<span style={{ color: "red" }}>*</span>)</span>}
                </dt>
                {!this.state.allowEditGroup &&
                  <p style={{ wordBreak: "break-word" }}>{riskGroup ? riskGroup.name : ""}</p>
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



            {this.state.allowEditGroup &&
              <Col md={12}>

                <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  <dt><span>Observaciones </span>
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

            <Col xs={2} md={4} lg={this.state.allowEditGroup ? 12 : 4} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "10px" }} >
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
              <button className="btn btn-danger" type="button" onClick={this.openModalDelteRiskGroup}
                style={{ cursor: 'pointer', marginLeft: "20px" }}>
                <i className="trash icon"></i> Elimnar </button>

              <Modal isOpen={this.state.modalDelteRiskGroupIsOpen} onRequestClose={this.closeModalDelteRiskGroup} className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog modalBt4-md">
                  <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                      <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Eliminar grupo de riesgo</h4>
                      <button type="button" onClick={this.closeModalDelteRiskGroup} className="close" data-dismiss="modal" role="close">
                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                        <span className="sr-only">Close</span>
                      </button>
                    </div>
                    {<ModalComponentDeleteRiskGroup riskGroup={riskGroup} isOpen={this.closeModalDelteRiskGroup} />}
                  </div>
                </div>
              </Modal>


            </Col>

            <SweetAlert
              type="error"
              show={this.state.showErrorForm}
              title="Campos obligatorios"
              text="Señor usuario, para editar un grupo de riesgo debe ingresar los campos obligatorios."
              onConfirm={() => this.setState({ showErrorForm: false })}
            />
          </Row>
        </form>

        <hr style={{ width: "100%", height: "1px", margin: "0px" }} />
        <Row style={{ padding: "10px 20px 20px 20px" }}>
          <Col lg={12} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} >

            <button className="btn btn-primary" type="button" onClick={this.openModalMember}
              style={{ cursor: 'pointer', marginLeft: "20px" }} >
              <i className="plus icon"></i> Agregar cliente </button>


            <Modal isOpen={this.state.modalMemberIsOpen} onRequestClose={this.closeModalMember} className="modalBt4-fade modal fade contact-detail-modal in">
              <div className="modalBt4-dialog modalBt4-lg">
                <div className="modalBt4-content modal-content">
                  <div className="modalBt4-header modal-header">
                    <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Agregar cliente</h4>
                    <button type="button" onClick={this.closeModalMember} className="close" data-dismiss="modal" role="close">
                      <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                      <span className="sr-only">Close</span>
                    </button>
                  </div>
                  {<ModalComponentMemberRiskGroup riskGroup={riskGroup} isOpen={this.closeModalMember} />}
                </div>
              </div>
            </Modal>

          </Col>

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

export default reduxForm({
  form: 'submitGroupEdit',
  fields,
  destroyOnUnmount: true,
  validate,
  onSubmitFail: errors => {
    thisForm.setState({ showErrorForm: true });
  }
}, mapStateToProps, mapDispatchToProps)(ModalComponentRiskGroup);
