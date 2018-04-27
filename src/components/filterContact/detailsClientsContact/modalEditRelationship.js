import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SweetAlert from '../../sweetalertFocus';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { getContactDetails } from '../../contact/contactDetail/actions';
import { changeStateSaveData } from '../../dashboard/actions';
import { formValidateKeyEnter, nonValidateEnter } from '../../../actionsGlobal';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import { changeValueOpenModal, updateRelationshipClientcontact } from '../actions';
import { FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID } from '../../selectsComponent/constants';
import { OPTION_REQUIRED, MESSAGE_SAVE_DATA } from '../../../constantsGlobal';
import { OPEN_EDIT_MODAL } from '../constants';
import { redirectUrl } from '../../globalComponents/actions';
import _ from 'lodash';

const fields = ["contactTypeOfContact", "contactFunctions", "contactLineOfBusiness"];
var thisForm;
const validate = (values) => {
    const errors = {};
    if (!values.contactTypeOfContact) {
        errors.contactTypeOfContact = OPTION_REQUIRED;
    } else {
        errors.contactTypeOfContact = null;
    }
    if (!values.contactFunctions) {
        errors.contactFunctions = OPTION_REQUIRED;
    } else {
        errors.contactFunctions = null;
    }
    return errors;
}

class ModalEditRelationship extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showErrorForm: false,
            updating: true,
            title: "",
            typeView: "success",
            message: ""
        };
        this._handlerSubmitRelationship = this._handlerSubmitRelationship.bind(this);
        this._closeAlertInformation = this._closeAlertInformation.bind(this);
        thisForm = this;
    }

    _handlerSubmitRelationship() {
        const { fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness },
            filterContactsReducer, updateRelationshipClientcontact, changeStateSaveData, getContactDetails } = this.props;
        const entityClientContact = filterContactsReducer.get('entityClientContact');
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        const json = {
            "idClientContact": entityClientContact.idClientContact,
            "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
            "function": JSON.parse('[' + ((contactFunctions.value) ? contactFunctions.value : "") + ']'),
            "lineOfBusiness": JSON.parse('[' + ((contactLineOfBusiness.value) ? contactLineOfBusiness.value : "") + ']')
        };
        updateRelationshipClientcontact(json).then((data) => {
            changeStateSaveData(false, "");
            if (!_.get(data, 'payload.data.validateLogin')) {
                redirectUrl("/login");
            } else {
                if (_.get(data, 'payload.data.status') === 200) {
                    getContactDetails(window.localStorage.getItem('idContactSelected'));
                    this.setState({
                        showErrorForm: true,
                        typeView: "success",
                        title: "Actualizar información",
                        message: "Señor usuario, la relación cliente-contacto ha sido actualizada correctamente."
                    });
                } else {
                    this.setState({
                        showErrorForm: true,
                        typeView: "error",
                        title: "Error actualizando información",
                        message: "Señor usuario, ocurrió un error tratando de actualizar la información."
                    });
                }
            }
        });

    }

    _closeAlertInformation(){
        this.setState({ showErrorForm: false });
        if( _.isEqual(this.state.typeView, "success", false) ){
            const {functionClose} = this.props;
            functionClose(OPEN_EDIT_MODAL);
        }

    }

    render() {
        const { fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness },
            handleSubmit, filterContactsReducer, selectsReducer, functionClose, reducerGlobal } = this.props;
        return (
            <div className="modalBt4-dialog modalBt4-lg">
                <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Editar relación cliente-contacto</h4>
                        <button type="button" onClick={() => { functionClose(OPEN_EDIT_MODAL) }} className="close" data-dismiss="modal" role="close">
                            <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(this._handlerSubmitRelationship)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
                            <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Clasificación del contacto</span></dt>
                            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <Row>
                                    <Col xs={12} md={12} lg={12}>
                                        <dt><span>Tipo de contacto (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                        <dd>
                                            <ComboBox
                                                name="contactTypeOfContact"
                                                labelInput="Seleccione"
                                                {...contactTypeOfContact}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                                            />
                                        </dd>
                                    </Col>
                                    <Col xs={12} md={12} lg={12}>
                                        <dt><span>Entidad/Línea de negocio</span></dt>
                                        <dd>
                                            <MultipleSelect
                                                name="contactLineOfBusiness"
                                                labelInput="Seleccione"
                                                {...contactLineOfBusiness}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                                            />
                                        </dd>
                                    </Col>
                                    <Col xs={12} md={12} lg={12}>
                                        <dt><span>Función (<span style={{ color: 'red' }}>*</span>)</span></dt>
                                        <dd>
                                            <MultipleSelect
                                                name="contactFunctions"
                                                labelInput="Seleccione"
                                                {...contactFunctions}
                                                valueProp={'id'}
                                                textProp={'value'}
                                                data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                                            />
                                        </dd>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="modalBt4-footer modal-footer">
                            <button
                                type="submit"
                                className="btn btn-primary modal-button-edit"
                            >{'Guardar'}</button>
                        </div>
                    </form>
                </div>
                <SweetAlert
                    type={this.state.typeView}
                    show={this.state.showErrorForm}
                    title={this.state.title}
                    text={this.state.message}
                    onConfirm={this._closeAlertInformation}
                />
            </div>
        )
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateRelationshipClientcontact,
        changeValueOpenModal,
        changeStateSaveData,
        getContactDetails
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, reducerGlobal, contactDetail, selectsReducer }, { ownerProps }) {
    const entityClientContact = filterContactsReducer.get('entityClientContact');
    const valuesLineOfBuisness = _.join(_.map(entityClientContact.listLineOfBusiness, 'key'), '","');
    const valuesFunctions = _.join(_.map(entityClientContact.listFunction, 'key'), '","');
    return {
        filterContactsReducer,
        reducerGlobal,
        contactDetail,
        selectsReducer,
        initialValues: {
            contactTypeOfContact: entityClientContact.idTypeContact,
            contactLineOfBusiness: JSON.parse('["' + valuesLineOfBuisness + '"]'),
            contactFunctions: JSON.parse('["' + valuesFunctions + '"]')
        }
    };
}

export default reduxForm({
    form: 'validationRelationship',
    fields,
    validate,
    onSubmitFail: errors => {
        thisForm.setState({
            showErrorForm: true,
            typeView: "error",
            title: "Campos obligatorios",
            message: "Señor usuario, para editar la relación cliente-contacto debe ingresar los campos obligatorios."
        });
    }
}, mapStateToProps, mapDispatchToProps)(ModalEditRelationship);