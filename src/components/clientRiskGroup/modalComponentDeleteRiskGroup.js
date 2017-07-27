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
import { getClientsRiskGroup, editNameRiskGroup, deleteRiskGroup } from './actions';
import ClientsRiskGroup from './clientsRiskGroup';
import { showLoading } from '../loading/actions';

import _ from 'lodash';
import $ from 'jquery';


const fields = ["justification"]
const validate = values => {
  const errors = {};

  if (!values.justification) {
    errors.justification = VALUE_REQUIERED;
  } else {
    errors.justification = null;
  }

  return errors;
};

var thisForm;
class modalComponentDeleteRiskGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      showErrorForm: false
    };

    this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
    this._closeError = this._closeError.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);

    thisForm = this;
  }

  _closeError() {
    this.setState({ showError: false, messageError: '' });
  }

  componentWillMount() { }

  _onchangeValue(val) {

    var { fields: { justification } } = this.props;
    justification.onChange(val);


  }


  _handlerSubmitGroup() {
    const { fields: { justification }, deleteRiskGroup, swtShowMessage, riskGroup, isOpen } = this.props;

    const jsonUpdateGroup = {
      id: riskGroup.id,
      observation: justification.value !== undefined ? justification.value : null
    }
    const self = this;

    deleteRiskGroup(jsonUpdateGroup).then((data) => {

      if (validateResponse(data)) {

        if (_.get(data, 'payload.data.data', false)) {
          swtShowMessage('success',
            'Grupo de riesgo pendiente por eliminación',
            'Señor usuario, La eliminación debe ser aprobado por el analista de Riesgos.');
          isOpen();
          // self.setState({
          //   showError: false,
          //   showErrorForm: false
          // });
        } else {
          swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de eliminar el grupo de riesgo.');
        }

      } else {
        swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de eliminar el grupo de riesgo.');
      }

    }, (reason) => {
      // changeStateSaveData(false, "");
      swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error eliminando el grupo de riesgo.');
    })


  }

  render() {

    const { fields: { justification }, handleSubmit } = this.props;


    return (

      <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
        onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }} >
        <div id="content-modal-rosk-group" className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{ overflowX: "hidden", marginBottom: '15px', height: "auto" }}>

          <Row style={{ padding: "10px 20px 20px 20px" }}>

            <Col md={12}>

              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <dt><span>Justificación </span>
                  <span>(<span style={{ color: "red" }}>*</span>)</span>
                </dt>
                <Textarea className="form-control need-input"
                  {...justification}
                  name="justification"
                  maxLength="250"
                  onChange={val => this._onchangeValue(val)}
                />
              </div>
            </Col>

            <SweetAlert
              type="error"
              show={this.state.showErrorForm}
              title="Campos obligatorios"
              text="Señor usuario, para eliminar un grupo de riesgo debe ingresar los campos obligatorios."
              onConfirm={() => this.setState({ showErrorForm: false })}
            />
          </Row>

        </div >
        <div className="modalBt4-footer modal-footer">
          <button className="btn btn-danger" type="submit"
            style={{ cursor: 'pointer', marginLeft: "20px" }}>
            <i className="trash icon"></i> Elimnar </button>
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
    deleteRiskGroup,
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
  form: 'submitGroupDelete',
  fields,
  destroyOnUnmount: true,
  validate,
  onSubmitFail: errors => {
    thisForm.setState({ showErrorForm: true });
  }
}, mapStateToProps, mapDispatchToProps)(modalComponentDeleteRiskGroup);
