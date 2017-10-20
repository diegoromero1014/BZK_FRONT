import React, {Component} from "react";
import {Col, Row} from "react-flexbox-grid";
import {redirectUrl} from "../globalComponents/actions";
import {reduxForm} from "redux-form";
import Input from "../../ui/input/inputComponent";
import ComboBox from "../../ui/comboBox/comboBoxComponent";
import Textarea from "../../ui/textarea/textareaComponent";

import SweetAlert from "sweetalert-react";
import {swtShowMessage} from "../sweetAlertMessages/actions";
import {SESSION_EXPIRED, VALUE_REQUIERED} from "../../constantsGlobal";
import {formValidateKeyEnter, nonValidateEnter, validateResponse} from "../../actionsGlobal";
import {bindActionCreators} from "redux";
import {addClientRiskGroup, getClientsRiskGroup} from "./actions";
import * as constants from "../selectsComponent/constants";
import {consultDataSelect} from "../selectsComponent/actions";
import {showLoading} from "../loading/actions";
import _ from "lodash";

const fields = [
    "clientName", "conformationReasonId", "segmentClient", "justification"
];
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

    if (!values.justification) {
        errors.justification = VALUE_REQUIERED;
    } else {
        errors.justification = null;
    }

    return errors;
};

let thisForm;
class memberRiskGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            showErrorForm: false
        };
        this._handlerSubmitGroup = this._handlerSubmitGroup.bind(this);
        this._closeError = this._closeError.bind(this);
        this._onchangeValue = this._onchangeValue.bind(this);
        this.requestAddMemberRiskGroup = this.requestAddMemberRiskGroup.bind(this);
        thisForm = this;
    }

    _closeError() {
        this.setState({showError: false, messageError: ''});
    }

    componentWillMount() {
        const {consultDataSelect} = this.props;
        consultDataSelect(constants.REASON_CONFORMATION).then((data) => {
            if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
                redirectUrl("/login");
            }
        });
    }

    _onchangeValue(file, val) {
        switch (file) {
            case "clientName":
                let {fields: {clientName}} = this.props;
                clientName.onChange(val);
                break;
            case "conformationReasonId":
                let {fields: {conformationReasonId}} = this.props;
                conformationReasonId.onChange(val);
                break;
            case "segmentClient":
                let {fields: {segmentClient}} = this.props;
                segmentClient.onChange(val);
                break;
            case "justification":
                let {fields: {justification}} = this.props;
                justification.onChange(val);
                break;

            default:
                break;
        }

    }

    requestAddMemberRiskGroup() {
        const {
            fields: {clientName, conformationReasonId, segmentClient, justification}, riskGroup,
            swtShowMessage, isOpen, clientsBasicInfo, documentType, documentNumber,
            addClientRiskGroup, getClientsRiskGroup, clientInformacion
        } = this.props;

        const jsonUpdateGroup = {
            idClient: clientsBasicInfo.idClient,
            documentTypeId: documentType,
            documentNumber: documentNumber,
            clientName: clientName.value,
            conformationReasonId: conformationReasonId.value,
            riskGroupId: riskGroup.id,
            justification: justification.value
        };

        const infoClient = clientInformacion.get('responseClientInfo');

        addClientRiskGroup(jsonUpdateGroup).then((data) => {
            if (validateResponse(data)) {
                let result = _.get(data, 'payload.data.data', "");
                if (result != "hasGroup" && result != "error") {
                    swtShowMessage('success',
                        'Cliente pendiente por aprobación',
                        'Señor usuario, para agregar el cliente debe ser aprobado por el analista de riesgos.');
                    getClientsRiskGroup(infoClient.id);

                    this.setState({
                        showForm: true,
                        disabledPrimaryFields: true,
                        clientsBasicInfo: _.get(data, 'payload.data.data', {})
                    });

                } else {
                    let msjError = 'Señor usuario, ocurrió un error tratando de agregar el cliente.';
                    let msjHasGroup = 'Señor usuario, este cliente ya pertenece a un grupo de riesgo.';
                    swtShowMessage('error', 'Error agregando el cliente', (result == "hasGroup" ? msjHasGroup : msjError));
                }

            } else {
                swtShowMessage('error', 'Error agregando el cliente', 'Señor usuario, ocurrió un error tratando de agregar el cliente.');
            }

            isOpen();

        }, (reason) => {
            this.setState({showConfirmCreateUser: true});
            swtShowMessage('error', 'Error agregando cliente', 'Señor usuario, ocurrió un error tratando de agregar el cliente.');
            isOpen();
        })

    }

    _handlerSubmitGroup() {
        const {validateHasRiskGroup} = this.props;
        validateHasRiskGroup(() => {
            this.requestAddMemberRiskGroup();
        })
    }

    render() {
        const {fields: {clientName, conformationReasonId, segmentClient, justification}, handleSubmit, clientsBasicInfo} = this.props;
        const {selectsReducer} = this.props;
        return <form id={"submitMemberForm"} onSubmit={handleSubmit(this._handlerSubmitGroup)}
                     onKeyPress={val => formValidateKeyEnter(val, true)} style={{width: "100%"}}>
            <div id="content-modal-rosk-group"
                 className="modalBt4-body modal-body business-content editable-form-content clearfix"
                 style={{overflow: "hidden", height: "428px", paddingBottom: "0"}}>

                <Row style={{padding: "10px 20px 20px 20px"}}>
                    <Col xs={12} md={6} lg={6}>
                        <dt><span>Nombre del cliente (</span><span style={{color: "red"}}>*</span>)</dt>
                        <Input
                            name="nombre"
                            type="text"
                            max="100"
                            onChange={val => this._onchangeValue("clientName", val)}
                            placeholder="Nombre del cliente"
                            disabled={!!clientsBasicInfo.idClient}
                            {...clientName}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <dt><span>Segmento</span></dt>
                        <Input
                            name="Segmento"
                            type="text"
                            max="100"
                            placeholder="Segmento"
                            onChange={val => this._onchangeValue("segmentClient", val)}
                            disabled={'disabled'}
                            {...segmentClient}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <dt><span>Razón de conformación (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox
                            name="razonConformacion"
                            labelInput="Seleccione..."
                            {...conformationReasonId}
                            onChange={val => this._onchangeValue("conformationReasonId", val)}
                            valueProp={'id'}
                            textProp={'value'}
                            data={selectsReducer.get('reasonConformation')}
                        />
                    </Col>
                    <Col xs={12} md={6} lg={12}>
                        <dt><span>Justificación </span>
                            <span>(<span style={{color: "red"}}>*</span>)</span>
                        </dt>
                        <Textarea className="form-control need-input"
                                  {...justification}
                                  name="justification"
                                  maxLength="250"
                                  onChange={val => this._onchangeValue("justification", val)}
                        />
                    </Col>
                    <SweetAlert
                        type="error"
                        show={this.state.showErrorForm}
                        title="Campos obligatorios"
                        text="Señor usuario, para agregar un cliente debe ingresar los campos obligatorios."
                        onConfirm={() => this.setState({showErrorForm: false})}
                    />
                </Row>
            </div >
        </form >
    }
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

function mapStateToProps({riskGroupReducer, clientInformacion, selectsReducer, clientR}, ownerProps) {
    return {
        riskGroupReducer,
        clientInformacion,
        selectsReducer,
        initialValues: {
            clientName: ownerProps.clientsBasicInfo ? ownerProps.clientsBasicInfo.nameClient : null,
            segmentClient: ownerProps.clientsBasicInfo ? ownerProps.clientsBasicInfo.segment : null
        },
        clientR
    };
}

export default reduxForm({
    form: 'submitMemberForm',
    fields,
    destroyOnUnmount: true,
    validate,
    onSubmitFail: errors => {
        thisForm.setState({showErrorForm: true});
    }
}, mapStateToProps, mapDispatchToProps)(memberRiskGroup);
