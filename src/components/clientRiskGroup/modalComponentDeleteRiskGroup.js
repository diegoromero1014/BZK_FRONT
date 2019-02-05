import React, {Component} from "react";
import {Col, Row} from "react-flexbox-grid";
import {reduxForm} from "redux-form";
import Textarea from "../../ui/textarea/textareaComponent";
import SweetAlert from "../sweetalertFocus";
import {swtShowMessage} from "../sweetAlertMessages/actions";
import {formValidateKeyEnter, nonValidateEnter, validateResponse} from "../../actionsGlobal";
import {bindActionCreators} from "redux";
import {deleteRiskGroup, getClientsRiskGroup, updateIsPendingRiskGroup} from "./actions";
import {showLoading} from "../loading/actions";

import _ from "lodash";
import { fields, validations as validate } from './fieldsAndRulesForDeleteRiskGroup';



let thisForm;
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
        this.requestDeleteRiskGroup = this.requestDeleteRiskGroup.bind(this);

        thisForm = this;
    }

    _closeError() {
        this.setState({showError: false, messageError: ''});
    }

    _onchangeValue(val) {

        let {fields: {justification}} = this.props;
        justification.onChange(val);
    }

    requestDeleteRiskGroup() {
        const {updateIsPendingRiskGroup, fields: {justification}, deleteRiskGroup, swtShowMessage, riskGroup, isOpen, validateHasRiskGroup} = this.props;

        const jsonUpdateGroup = {
            id: riskGroup.id,
            observation: justification.value !== undefined ? justification.value : null
        };
        const self = this;

        deleteRiskGroup(jsonUpdateGroup).then((data) => {
            if (validateResponse(data)) {
                if (_.get(data, 'payload.data.data', false)) {
                    updateIsPendingRiskGroup(true);
                    swtShowMessage('success',
                        'Grupo de riesgo pendiente por eliminación',
                        'Señor usuario, la eliminación debe ser aprobada por el analista de riesgos.');
                } else {
                    swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de eliminar el grupo de riesgo.');
                }
            } else {
                swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error tratando de eliminar el grupo de riesgo.');
            }
            isOpen();
        }, (reason) => {
            isOpen();
            swtShowMessage('error', 'Error eliminando grupo de riesgo', 'Señor usuario, ocurrió un error eliminando el grupo de riesgo.');
        })
    }

    _handlerSubmitGroup() {
        const {validateHasRiskGroup} = this.props;
        validateHasRiskGroup(() => {
            this.requestDeleteRiskGroup();
        });

    }

    render() {
        const {fields: {justification}, handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this._handlerSubmitGroup)}
                  onKeyPress={val => formValidateKeyEnter(val, true)} style={{width: "100%"}}>
                <div id="content-modal-rosk-group"
                     className="modalBt4-body modal-body business-content editable-form-content clearfix"
                     style={{overflowX: "hidden", height: "auto"}}>

                    <Row style={{padding: "10px 20px 0px"}}>

                        <Col md={12}>

                            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                                <dt><span>Justificación </span>
                                    <span>(<span style={{color: "red"}}>*</span>)</span>
                                </dt>
                                <Textarea className="form-control need-input"
                                          {...justification}
                                          name="justification"
                                          onChange={val => this._onchangeValue(val)}
                                />
                            </div>
                        </Col>

                        <SweetAlert
                            type="error"
                            show={this.state.showErrorForm}
                            title="Campos obligatorios"
                            text="Señor usuario, para eliminar un grupo de riesgo debe ingresar los campos obligatorios."
                            onConfirm={() => this.setState({showErrorForm: false})}
                        />
                    </Row>

                </div >
                <div className="modalBt4-footer modal-footer">
                    <button className="btn btn-danger" type="submit"
                            style={{cursor: 'pointer', marginLeft: "20px"}}>
                        Eliminar
                    </button>
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
        swtShowMessage,
        updateIsPendingRiskGroup
    }, dispatch);
}

function mapStateToProps({riskGroupReducer, clientInformacion}, ownerProps) {
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
        thisForm.setState({showErrorForm: true});
    }
}, mapStateToProps, mapDispatchToProps)(modalComponentDeleteRiskGroup);
