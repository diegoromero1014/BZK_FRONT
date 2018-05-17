import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { reduxForm } from 'redux-form';

import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import SweetAlert from '../sweetalertFocus';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import {VALUE_REQUIERED, SESSION_EXPIRED, VALUE_XSS_INVALID} from '../../constantsGlobal';
import {validateResponse, formValidateKeyEnter, nonValidateEnter, xssValidation, onSessionExpire} from '../../actionsGlobal';
import { bindActionCreators } from 'redux';
import * as constants from '../selectsComponent/constants';
import { findClientByStrTypeIdAndNumber } from '../clients/actions';
import { getMasterDataFields } from '../selectsComponent/actions';
import { showLoading } from '../loading/actions';
import MemberRiskGroup from './memberRiskGroup'
import _ from 'lodash';

const fields = [
    "idType", "idNumber"
];

const validate = values => {
    const errors = {};

    if (!values.idType) {
        errors.idType = VALUE_REQUIERED;
    } else {
        errors.idType = null;
    }
    if (!values.idNumber) {
        errors.idNumber = VALUE_REQUIERED;
    } else if (xssValidation(values.idNumber)) {
        errors.idNumber = VALUE_XSS_INVALID;
    } else {
        errors.idNumber = null;
    }
    return errors;
};

let thisForm;
let myForm = null;
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
        this.subrmitFormChild = this.subrmitFormChild.bind(this);
        thisForm = this;
    }

    _closeError() {
        this.setState({ showError: false, messageError: '' });
    }

    componentWillMount() {
        this.setState({ showForm: false });
        this.props.getMasterDataFields([constants.SHAREHOLDER_ID_TYPE]).then((data) => {
            if (_.get(data, 'payload.data.messageHeader.status') === SESSION_EXPIRED) {
                onSessionExpire();
            }
        });

    }

    _onchangeValue(file, val) {
        switch (file) {
            case "idType":
                let { fields: { idType } } = this.props;
                idType.onChange(val);
                break;
            case "idNumber":
                let { fields: { idNumber } } = this.props;
                idNumber.onChange(val);
                break;
            default:
                break;
        }
    }

    _handlerSubmitGroup() {
        const { fields: { idType, idNumber }, swtShowMessage, findClientByStrTypeIdAndNumber, selectsReducer } = this.props;
        const strTypeDocument = _.get(_.find(selectsReducer.get(constants.SHAREHOLDER_ID_TYPE), (item) => _.isEqual(item.id, parseInt(idType.value))), 'value', '');
        const jsonFindClient = {
            strTypeDocument: strTypeDocument,
            typeDocument: idType.value !== undefined ? idType.value : null,
            numberDocument: idNumber.value !== undefined ? idNumber.value : null
        };
        findClientByStrTypeIdAndNumber(jsonFindClient).then((data) => {
            if (validateResponse(data)) {
                this.setState({
                    showForm: true,
                    disabledPrimaryFields: true,
                    clientsBasicInfo: _.get(data, 'payload.data.data', {})
                });
            } else {
                swtShowMessage('error', 'Error consultando el cliente', 'Señor usuario, ocurrió un error tratando de consultar el cliente.');
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

    subrmitFormChild(){
        myForm.submit()
    }

    render() {

        const { fields: { idType, idNumber }, handleSubmit, isOpen, riskGroup, validateHasRiskGroup } = this.props;
        const { selectsReducer } = this.props;
        // onClick={() => dispatch(submit('submitMemberForm'))}
        // console.log(submit);
        return (
            <div>
                <div id="content-modal-rosk-group"
                    className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    style={{ overflowX: "hidden" }}>
                    <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
                        onKeyPress={val => formValidateKeyEnter(val, true)} style={{ width: "100%" }}>
                        <Row style={{ padding: "10px 20px 0px" }}>
                            <Col xs={12} md={!this.state.disabledPrimaryFields ? 5 : 6}>
                                <dt><span>Tipo de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <ComboBox
                                    name="tipoDocumento"
                                    onChange={val => this._onchangeValue("idType", val)}
                                    labelInput="Seleccione..."
                                    {...idType}
                                    disabled={this.state.disabledPrimaryFields ? "disabled" : ""}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get(constants.SHAREHOLDER_ID_TYPE)}
                                />
                            </Col>
                            <Col xs={12} md={!this.state.disabledPrimaryFields ? 5 : 6}>
                                <dt><span>Número de documento (</span><span style={{ color: "red" }}>*</span>)</dt>
                                <Input
                                    name="documento"
                                    type="text"
                                    max="20"
                                    disabled={this.state.disabledPrimaryFields}
                                    placeholder="Número de documento"
                                    {...idNumber}
                                />
                            </Col>
                            {!this.state.disabledPrimaryFields &&
                                <Col xs={2} md={4} lg={2} style={{ paddingTop: '25pt' }}>
                                    <button className="btn btn-primary" type="submit" title="Buscar cliente"
                                        style={{ fontSize: '1.2em' }}>
                                        <i className="search icon" />
                                    </button>
                                </Col>
                            }
                            <SweetAlert
                                type="warning"
                                show={this.state.showConfirmCreateUser}
                                showCancelButton={true}
                                cancelButtonText="Cancelar"
                                title="Búsqueda de cliente"
                                text="Señor usuario, el cliente no fue encontrado, ¿desea crearlo?"
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
                            ref={(input) => { myForm = input; }}
                            validateHasRiskGroup={validateHasRiskGroup}
                            isOpen={isOpen}
                            riskGroup={riskGroup}
                            clientsBasicInfo={this.state.clientsBasicInfo}
                            documentType={idType.value}
                            documentNumber={idNumber.value}
                        />
                    }
                </div >

                <div className="modalBt4-footer modal-footer">
                    {this.state.showForm &&
                        <button className="btn btn-prymary" type="button"
                        onClick={this.subrmitFormChild} style={{ cursor: 'pointer', marginLeft: "20px" }}>
                            Agregar </button>

                    }
                    <button className="btn btn-default btnDefaultAyax " type="button"
                        style={{ cursor: 'pointer', marginLeft: "20px" }} onClick={() => {
                            isOpen()
                        }}>
                        Cancelar
                    </button>
                </div>
            </div>

        )
    };
}
// {/*form={"submitMemberForm"}  */}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter,
        showLoading,
        swtShowMessage,
        findClientByStrTypeIdAndNumber,
        getMasterDataFields
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
