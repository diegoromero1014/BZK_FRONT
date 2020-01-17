import moment from "moment";
import { reduxForm } from "redux-form";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import _ from "lodash";
import $ from "jquery";
import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import RichText from "../../richText/richTextComponent";
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import { getMasterDataFields } from "../../selectsComponent/actions";
import { addArea, editArea, validateWhiteListOnArea } from "./actions";
import { htmlToText } from "../../../actionsGlobal";
import { STATUS_AREAS } from "./constants";
import { MESSAGE_ERROR } from '../../../constantsGlobal';

const fields = ["idEmployee", "areaDes", "actionArea", "areaResponsable", "areaDate", "statusArea"];
const errors = {};
let usersBanco = [];
let idUsuario, nameUsuario;
let thisForm;

const validate = (values) => {
  if (!values.areaDes) {
    errors.areaDes = "Debe ingresar un valor";
  } else {
    errors.areaDes = null;
  }

  if (!values.actionArea || _.isEmpty(htmlToText(values.actionArea))) {
    errors.actionArea = "Debe ingresar un valor";
  } else {
    errors.actionArea = null;
  }

  if (!values.areaResponsable) {
    errors.areaResponsable = "Debe ingresar un valor";
  } else if (!values.idEmployee) {
    errors.areaResponsable = "Seleccione un empleado";
  } else {
    errors.areaResponsable = null;
  }
  if (!values.statusArea) {
    errors.statusArea = "Debe seleccionar una opción";
  } else {
    errors.statusArea = null;
  }
  if (!values.areaDate) {
    errors.areaDate = "Debe seleccionar una fecha";
  } else if (!moment(values.areaDate, 'DD/MM/YYYY').isValid()) {
    errors.needDate = "Debe seleccionar una fecha";
  } else {
    errors.areaDate = null;
  }

  return errors;
};
export class ModalArea extends Component {

  constructor(props) {
    super(props);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._handleCreateArea = this._handleCreateArea.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._onClickDate = this._onClickDate.bind(this);
    this.processValidation = this.processValidation.bind(this);

    this.state = {
      showSuccessAdd: false,
      showSuccessEdit: false,
      showEr: false,
      prueba: [],
      showErrorYa: false,
      openDatePicker: false
    }

    this.errorArea = null;
    this.errorActionArea = null;
    momentLocalizer(moment);
    thisForm = this;
  }

  componentDidMount() {
    const { fields: { idEmployee, areaDes, actionArea, areaResponsable, areaDate, statusArea }, areaEdit } = this.props;
    if (areaEdit !== undefined) {
      areaDes.onChange(areaEdit.areaDes);
      actionArea.onChange(areaEdit.actionArea);
      areaResponsable.onChange(areaEdit.areaResponsable);
      idEmployee.onChange(areaEdit.areaIdResponsable);
      statusArea.onChange(areaEdit.statusIdArea);
      areaDate.onChange(moment(areaEdit.areaFormat, 'DD/MM/YYYY'));
    }
  }

  _onClickDate() {
    setTimeout(function () {
      document.getElementById('modalComponentScrollArea').scrollTop = 1000;
    }, 100);
  }

  _closeCreate() {
    const { isOpen, areaEdit } = this.props;
    if (areaEdit !== undefined) {
      this.setState({
        showSuccessEdit: false
      });
    } else {
      this.setState({
        showSuccessAdd: false
      });
    }
    isOpen();
    this.props.resetForm();
  }

  _handleCreateArea() {
    const { fields: { idEmployee, areaDes, actionArea, areaResponsable, areaDate, statusArea }, addArea, editArea, areaEdit, selectsReducer, swtShowMessage, validateWhiteListOnArea } = this.props;
    let status = _.get(_.filter(selectsReducer.get(STATUS_AREAS), ['id', parseInt(statusArea.value)]), '[0].value');
    if (areaResponsable.value !== nameUsuario) {
      nameUsuario = areaResponsable.value;
      idUsuario = idEmployee.value;
    }

    let jsonValidate = {
      area: areaDes.value,
      actionArea: actionArea.value
    }
    validateWhiteListOnArea(jsonValidate).then((data) => {
      let errors = data.payload.data.data;
      for (let index = 0; index < errors.length; index++) {
        const error = errors[index];
        const field = error.fieldName;

        this.processValidation(field, error);

      }
      if (errors.length > 0) {
        this.disableSubmitButton = false;
        this.forceUpdate();
        return;
      }

      this.errorArea = null;
      this.errorActionArea = null;

      if (areaEdit !== undefined) {
        areaEdit.actionArea = actionArea.value;
        areaEdit.areaDes = areaDes.value;
        areaEdit.statusIdArea = statusArea.value;
        areaEdit.areaDate = areaDate.value;
        areaEdit.areaFormat = areaDate.value;
        areaEdit.statusArea = status;
        areaEdit.areaIdResponsable = idUsuario;
        areaEdit.areaResponsable = nameUsuario;
        editArea(areaEdit);
        swtShowMessage('success', "Área editada exitosamente", "Señor usuario, recuerde guardar el plan de negocio. De no ser así las áreas editadas se perderán.", { onConfirmCallback: this._closeCreate });

      } else {
        const uuid = _.uniqueId('area_');
        let area = {
          uuid,
          areaDes: areaDes.value,
          actionArea: actionArea.value,
          areaIdResponsable: idUsuario,
          areaResponsable: nameUsuario,
          areaDate: areaDate.value,
          areaFormat: areaDate.value,
          statusIdArea: statusArea.value,
          statusArea: status
        }
        addArea(area);
        swtShowMessage('success', "Área agregada exitosamente", "Señor usuario, recuerde guardar el plan de negocio. De no ser así las áreas agregadas se perderán.", { onConfirmCallback: this._closeCreate });

      }
    });

  }

  processValidation(field, error) {
    if (field) {
      switch (field) {
        case "relatedInternalParty":
          this.errorArea = error.message;
          break;
        case "actionNeeded":
          this.errorActionArea = error.message;
        default:
          break;
      }
    }
  }

  updateKeyValueUsersBanco(e) {
    const { fields: { areaResponsable, idEmployee }, filterUsersBanco, swtShowMessage } = this.props;
  
    const selector = $('.ui.search.areaResponsable');
    if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
      e.consultclick ? "" : e.preventDefault();
      if (areaResponsable.value !== "" && areaResponsable.value !== null && areaResponsable.value !== undefined) {
        if (areaResponsable.value.length < 3) {
          swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
          return;
        }
        selector.toggleClass('loading');
        filterUsersBanco(areaResponsable.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          selector.search({
            cache: false,
            source: usersBanco,
            maxResults: 1500,
            searchFields: [
              'title',
              'description'
            ],
            onSelect: function (event) {
              areaResponsable.onChange(event.title);
              idEmployee.onChange(event.idUsuario);

              return 'default';
            }
          });
          selector.toggleClass('loading');
          selector.search('search local', areaResponsable.value);
          setTimeout(function () {
            $('#inputParticipantBanc').focus();
          }, 150);
        });
      }
    }
  }

  _updateValue(value) {
    const { fields: { areaResponsable } } = this.props;
    areaResponsable.onChange(value);
  }

  componentWillMount() {
    const { getMasterDataFields } = this.props;
    getMasterDataFields([STATUS_AREAS]);
  }

  render() {
    const { selectsReducer, disabled, fields: { areaDes, actionArea, areaResponsable, areaDate, statusArea, idEmployee }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this._handleCreateArea)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScrollArea">
          <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Adicionar área al plan de negocio</span></dt>
          <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '30px' }}>
            <p style={{ paddingTop: "10px", marginBottom: "0px" }} >Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</p>
            <Row>
              <Col xs>
                <dt><span>Área (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt style={{ paddingTop: "0px" }}>
                  <Input
                    type="text"
                    name="areaDes"
                    {...areaDes}
                    disabled={disabled}
                    error={this.errorArea}
                    max="200" />
                </dt>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Acciones necesarias (<span style={{ color: "red" }}>*</span>)</span></dt>
                <RichText
                  name="actionArea"
                  style={{ width: '100%', height: '180px' }}
                  {...actionArea}
                  disabled={disabled}
                  error={this.errorActionArea}
                  readOnly={_.isEqual(disabled, 'disabled')}
                />
              </Col>
            </Row>
            <Row style={{ paddingTop: '20px' }}>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Responsable  (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt style={{ paddingTop: "0px" }}>
                  <ComboBoxFilter
                    name="areaResponsable"
                    {...areaResponsable}
                    value={areaResponsable.value}
                    labelInput="Ingrese un criterio de búsqueda..."
                    parentId="dashboardComponentScroll"
                    onChange={(val) => { if (idEmployee.value) { idEmployee.onChange(null) } areaResponsable.onChange(val) }}
                    onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                    onSelect={val => this._updateValue(val)}
                    max="50"
                    disabled={disabled}
                  />

                </dt>
              </Col>
            </Row>
            <Row>
              <Col xs>
                <dt><span>Estado  (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt style={{ paddingTop: "0px" }}>
                  <ComboBox
                    name="statusArea"
                    labelInput="Seleccione..."
                    valueProp={'id'}
                    textProp={'value'}
                    {...statusArea}
                    parentId="dashboardComponentScroll"
                    data={selectsReducer.get(STATUS_AREAS) || []}
                    disabled={disabled}
                  />

                </dt>
              </Col>
              <Col xs>
                <dt><span>Fecha de solución - DD/MM/YYYY (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt style={{ paddingTop: "0px" }}>
                  <DateTimePickerUi
                    id='fecha'
                    culture='es'
                    format={"DD/MM/YYYY"}
                    time={false}
                    {...areaDate}
                    onClick={this._onClickDate}
                    disabled={disabled}
                  />
                </dt>
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          <button type="submit" className="btn btn-primary modal-button-edit" disabled={disabled} style={_.isEqual(disabled, "disabled") ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}>
            <span>Agregar</span>
          </button>
        </div>


      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    filterUsersBanco,
    addArea,
    editArea,
    swtShowMessage,
    validateWhiteListOnArea
  }, dispatch);
}

function mapStateToProps({ areas, selectsReducer }, { areaEdit }) {
  if (areaEdit !== undefined) {
    return {
      areas,
      selectsReducer,
      initialValues: {
        areaDes: areaEdit.needIdType,
        actionArea: areaEdit.actionArea,
        areaResponsable: areaEdit.areaResponsable,
        idEmployee: areaEdit.areaIdResponsable,
        statusArea: areaEdit.statusIdArea,
        areaDate: areaEdit.areaFormat
      }

    }
  } else {
    return {
      areas,
      selectsReducer,
      initialValues: {
        areaDes: '',
        actionArea: '',
        areaResponsable: '',
        statusArea: '',
        areaDate: ''
      }
    };
  }
}

export default reduxForm({
  form: 'submitModalArea',
  fields,
  validate,
  onSubmitFail: () => {
    document.getElementById('modalComponentScrollArea').scrollTop = 0;
    const { swtShowMessage } = thisForm.props;
      swtShowMessage(MESSAGE_ERROR, "Campos obligatorios", "Señor usuario, para agregar una área debe ingresar los campos obligatorios.");
  }
}, mapStateToProps, mapDispatchToProps)(ModalArea);