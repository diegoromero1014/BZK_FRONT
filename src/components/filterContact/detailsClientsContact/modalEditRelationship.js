import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SweetAlert from '../../sweetalertFocus';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';

import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ElementsComponent from '../../elements';
import Tooltip from '../../toolTip/toolTipComponent';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

import { changeStateSaveData } from '../../main/actions';
import { getContactDetails } from '../../contact/contactDetail/actions';
import { redirectUrl } from '../../globalComponents/actions';
import { updateRelationshipClientcontact } from '../actions';
import { cleanList, addToList, createList } from '../../elements/actions';
import { formValidateKeyEnter } from '../../../actionsGlobal';

import { FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID } from '../../selectsComponent/constants';
import { OPEN_EDIT_MODAL } from '../constants';
import { OBJECTIVES_PLACEHOLDER, OBJECTIVES, MANDATORY_OBJECTIVES_MSG, OBJECTIVES_OPEN_ERROR_MSG } from '../../participants/constants';
import { OPTION_REQUIRED, MESSAGE_SAVE_DATA } from '../../../constantsGlobal';

import { schema as schemaObjectivesInterlocutor } from '../../participants/schema';

const fields = ["contactTypeOfContact", "contactFunctions", "contactLineOfBusiness"];
var thisForm;
const validate = (values) => {
    const errors = {};
    errors.contactTypeOfContact = !values.contactTypeOfContact ? OPTION_REQUIRED : null;
    errors.contactFunctions = !values.contactFunctions ? OPTION_REQUIRED : null;
    return errors;
}

export class ModalEditRelationship extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrorForm: false,
            updating: true,
            title: "",
            typeView: "success",
            message: ""
        };
        this.handleSubmitRelationship = this.handleSubmitRelationship.bind(this);
        this.closeAlertInformation = this.closeAlertInformation.bind(this);
        thisForm = this;
    }

    componentWillMount() {
        const { filterContactsReducer, dispatchAddToList, dispatchCreateList, dispatchCleanList } = this.props;
        const interlocutorObjs = filterContactsReducer.get('entityClientContact').interlocutorObjsDTOS;

        dispatchCleanList(OBJECTIVES);
        dispatchCreateList(OBJECTIVES);

        if (interlocutorObjs && interlocutorObjs.length) {
            interlocutorObjs.forEach((element, index) => dispatchAddToList({ data: Object.assign({}, element, { order: (index + 1) }), name: OBJECTIVES, old: null }));
        }
    }

    saveData = async (json) => {
        const { dispatchChangeStateSaveData, dispatchUpdateRelationshipClientContact, dispatchGetContactDetails } = this.props;

        dispatchChangeStateSaveData(true, MESSAGE_SAVE_DATA);

        const response = await dispatchUpdateRelationshipClientContact(json);
        dispatchChangeStateSaveData(false, "");
        if (!_.get(response, 'payload.data.validateLogin')) {
            redirectUrl("/login");
        } else {
            if (_.get(response, 'payload.data.status') === 200) {
                this.setState({
                    showErrorForm: true,
                    typeView: "success",
                    title: "Actualizar información",
                    message: "Señor usuario, la relación cliente-contacto ha sido actualizada correctamente."
                });                    
                dispatchGetContactDetails(window.sessionStorage.getItem('idContactSelected'));
            } else {
                this.setState({
                    showErrorForm: true,
                    typeView: "error",
                    title: "Error actualizando información",
                    message: "Señor usuario, ocurrió un error tratando de actualizar la información."
                });
            }
        }
    }

    handleSubmitRelationship = () => {
        const { fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness }, filterContactsReducer, elementsReducer, dispatchSwtShowMessage } = this.props;        
        const data = elementsReducer[OBJECTIVES];

        if (data && data.open) {
            dispatchSwtShowMessage('error', 'Error', OBJECTIVES_OPEN_ERROR_MSG);
            return;
        }

        const entityClientContact = filterContactsReducer.get('entityClientContact');
        const json = {
            "idClientContact": entityClientContact.idClientContact,
            "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
            "function": JSON.parse('[' + ((contactFunctions.value) ? contactFunctions.value : "") + ']'),
            "lineOfBusiness": JSON.parse('[' + ((contactLineOfBusiness.value) ? contactLineOfBusiness.value : "") + ']'),
            "interlocutorObjs": data.elements
        };

        this.saveData(json);
    }

    closeAlertInformation = () => {
        this.setState({ showErrorForm: false });
        if( _.isEqual(this.state.typeView, "success", false) ){
            const {functionClose} = this.props;
            functionClose(OPEN_EDIT_MODAL);
        }
    }

    render() {
        const { fields: { contactTypeOfContact, contactFunctions, contactLineOfBusiness }, handleSubmit, selectsReducer, functionClose, reducerGlobal } = this.props;
        return (
            <div className="modalBt4-dialog modalBt4-lg">
                <div className="modalBt4-content modal-content">
                    <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">Editar relación cliente-contacto</h4>
                        <button name="btnClose" type="button" onClick={() => { functionClose(OPEN_EDIT_MODAL) }} className="close" data-dismiss="modal" role="close">
                            <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(this.handleSubmitRelationship)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
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

                                    <Row style={{ padding: "10px 10px 20px 20px", marginTop: 20, width:'100%' }}>
                                        <Col xs={12} md={12} lg={12}>
                                            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                                                <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                                                <i className="browser icon" style={{ fontSize: "20px" }} />
                                                <span style={{ fontSize: "20px" }}>{`Objetivos del interlocutor`}</span>

                                                <Tooltip text={MANDATORY_OBJECTIVES_MSG}>
                                                    <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
                                                </Tooltip>

                                            </div>
                                        </Col>
                                        <Col style={{ marginTop: '-50px' }} xs={12} md={12} lg={12}>
                                            <ElementsComponent schema={schemaObjectivesInterlocutor} placeholder={OBJECTIVES_PLACEHOLDER} messageButton='Agregar' name={OBJECTIVES} max={3} title={'Objetivos del interlocutor'} isEditable={true} singularTitle={'el objetivo del interlocutor'}/>
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                        </div>
                        <div className="modalBt4-footer modal-footer">
                            <button type="submit" className="btn btn-primary modal-button-edit">Guardar</button>
                        </div>
                    </form>
                </div>
                <SweetAlert
                    type={this.state.typeView}
                    show={this.state.showErrorForm}
                    title={this.state.title}
                    text={this.state.message}
                    onConfirm={this.closeAlertInformation}
                />
            </div>
        )
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchCreateList: createList,
        dispatchCleanList: cleanList,
        dispatchAddToList: addToList,
        dispatchUpdateRelationshipClientContact: updateRelationshipClientcontact,
        dispatchChangeStateSaveData: changeStateSaveData,
        dispatchGetContactDetails: getContactDetails,
        dispatchSwtShowMessage: swtShowMessage,
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer, reducerGlobal, contactDetail, selectsReducer, elementsReducer }, { ownerProps }) {
    const entityClientContact = filterContactsReducer.get('entityClientContact');
    const valuesLineOfBuisness = _.join(_.map(entityClientContact.listLineOfBusiness, 'key'), '","');
    const valuesFunctions = _.join(_.map(entityClientContact.listFunction, 'key'), '","');
    return {
        filterContactsReducer,
        reducerGlobal,
        contactDetail,
        selectsReducer,
        elementsReducer,
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