import moment from "moment";
import { reduxForm } from "redux-form";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import momentLocalizer from "react-widgets/lib/localizers/moment";
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import { PRODUCTS_MASK } from "../../selectsComponent/constants";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import { getClientNeeds, getMasterDataFields, consultListWithParameterUbication, consultDataSelect } from "../../selectsComponent/actions";
import { IMPLEMENTATION_TIMELINE, PRODUCTS, STATUS_NEED, PRODUCT_FAMILY } from "./constants";
import { addNeed, editNeed } from "./actions";
import _ from "lodash";
import $ from "jquery";
import RichText from "../../richText/richTextComponent";
import { htmlToText, shorterStringValue, xssValidation } from "../../../actionsGlobal";
import { MESSAGE_ERROR, VALUE_XSS_INVALID, REGEX_SIMPLE_XSS_TITLE, REGEX_SIMPLE_XSS_MESAGE } from '../../../constantsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';


const fields = ["idEmployee", "needType", "descriptionNeed", "productFamily", "needProduct", "needImplementation", "needTask", "needBenefits", "needResponsable", "needDate", "statusNeed"];
const errors = {};
let usersBanco = [];
let idUsuario, nameUsuario;
let thisForm;

const validate = (values) => {
    if (!values.needType) {
        errors.needType = "Debe seleccionar una opción";
    }  else {
        errors.needType = null;
    }

    if (!values.descriptionNeed || _.isEmpty(htmlToText(values.descriptionNeed))) {
        errors.descriptionNeed = "Debe ingresar un valor";
    } else if (xssValidation(values.descriptionNeed, true)) {
        errors.descriptionNeed = VALUE_XSS_INVALID;
    } else {
        errors.descriptionNeed = null;
    }

    if (!values.needProduct) {
        errors.needProduct = "Debe seleccionar una opción";
    } else {
        errors.needProduct = null;
    }
    if (!values.needImplementation) {
        errors.needImplementation = "Debe seleccionar una opción";
    } else {
        errors.needImplementation = null;
    }

    if (!values.needTask || _.isEmpty(htmlToText(values.needTask))) {
        errors.needTask = "Debe ingresar un valor";
    } else if (xssValidation(values.needTask, true)) {
        errors.needTask = VALUE_XSS_INVALID;
    } else {
        errors.needTask = null;
    }

    if (!values.needBenefits || _.isEmpty(htmlToText(values.needBenefits))) {
        errors.needBenefits = "Debe ingresar un valor";
    } else if (xssValidation(values.needBenefits, true)) {
        errors.needBenefits = VALUE_XSS_INVALID;
    } else {
        errors.needBenefits = null;
    }

    if (!values.needResponsable) {
        errors.needResponsable = "Debe ingresar un valor";
    } else if(!values.idEmployee){
        errors.needResponsable = "Seleccione un empleado";        
    }else {
        errors.needResponsable = null;
    }

    if (!values.needDate) {
        errors.needDate = "Debe seleccionar una fecha";
    } else if (xssValidation(values.needDate, true)) {
        errors.needDate = VALUE_XSS_INVALID;
    } else if(!moment(values.needDate, 'DD/MM/YYYY').isValid()){
        errors.needDate = "Debe seleccionar una fecha";
    } else {
        errors.needDate = null;
    }

    if (!values.statusNeed) {
        errors.statusNeed = "Debe seleccionar una opción";
    }  else {
        errors.statusNeed = null;
    }
    if (!values.productFamily) {
        errors.productFamily = "Debeseleccionar una opción";
    }  else {
        errors.productFamily = null;
    }
    
    return errors;
};

class ModalNeed extends Component {

    constructor(props) {
        super(props);
        this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
        this._updateValue = this._updateValue.bind(this);
        this._handleCreateNeed = this._handleCreateNeed.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._onClickDate = this._onClickDate.bind(this);
        this._scroll = this._scroll.bind(this);
        this._changeProductFamily = this._changeProductFamily.bind(this);
        this.state = {
            showSuccessAdd: false,
            showSuccessEdit: false,
            showEr: false,
            prueba: [],
            showErrorYa: false
        }
        momentLocalizer(moment);
        thisForm = this;
    }

    _scroll() {
        let element = document.getElementById("fecha")
        let alignWithTop = true;
        element.scrollIntoView(alignWithTop);
    }

    _onClickDate() {
        setTimeout(function () {
            document.getElementById('modalComponentScrollNeed').scrollTop = 1000;
        }, 100);
    }

    componentDidMount() {
        const { fields: { idEmployee, needType, descriptionNeed, productFamily, needProduct, needImplementation, needTask, needBenefits, needResponsable, needDate, statusNeed }, needEdit } = this.props;
        if (needEdit !== undefined) {
            needType.onChange(needEdit.needIdType);
            descriptionNeed.onChange(needEdit.descriptionNeed);
            productFamily.onChange(needEdit.productFamilyId);
            needProduct.onChange(needEdit.needIdProduct);            
            needImplementation.onChange(needEdit.needIdImplementation);
            needTask.onChange(needEdit.needTask);
            needBenefits.onChange(needEdit.needBenefits);
            idEmployee.onChange(needEdit.needIdResponsable);
            needResponsable.onChange(needEdit.needResponsable);
            statusNeed.onChange(needEdit.statusIdNeed);
            needDate.onChange(moment(needEdit.needFormat, 'DD/MM/YYYY'));
        } else {
            this._changeProductFamily(null);
        }
    }

    _closeCreate() {
        const { isOpen, needEdit } = this.props;
        if (needEdit !== undefined) {
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

    _changeProductFamily(currencyValue) {
        const { selectsReducer, fields: { needProduct }, consultListWithParameterUbication } = this.props;        
        if (!currencyValue || currencyValue == null) {
            needProduct.onChange('');
        }
        consultListWithParameterUbication(PRODUCTS, currencyValue);  
        needProduct.onChange('');
      }

    _handleCreateNeed() {
        const { fields: { needType, idEmployee, descriptionNeed, productFamily, needProduct, needImplementation, needTask, needBenefits, needResponsable, needDate, statusNeed }, selectsReducer, handleSubmit, error, addNeed, editNeed, needEdit, swtShowMessage } = this.props;
        let status = _.get(_.filter(selectsReducer.get(STATUS_NEED), ['id', parseInt(statusNeed.value)]), '[0].value');
        let implementation = _.get(_.filter(selectsReducer.get(IMPLEMENTATION_TIMELINE), ['id', parseInt(needImplementation.value)]), '[0].value');
        let needC = _.get(_.filter(selectsReducer.get('pipelineClientNeeds'), ['id', parseInt(needType.value)]), '[0].need');
        let productF = _.get(_.filter(selectsReducer.get(PRODUCT_FAMILY), ['id', parseInt(productFamily.value)]), '[0].value');
        let productC = _.get(_.filter(selectsReducer.get(PRODUCTS), ['id', parseInt(needProduct.value)]), '[0].value');
        
        if (needResponsable.value !== nameUsuario) {
            nameUsuario = needResponsable.value;
            idUsuario = idEmployee.value !== undefined && idEmployee.value !== null && idEmployee.value !== '' ? idEmployee.value : null;
        }
        
            if (needEdit !== undefined) {
                needEdit.needIdType = needType.value;
                needEdit.needType = needC;
                needEdit.descriptionNeed = descriptionNeed.value;
                needEdit.descriptionNeedText = shorterStringValue(htmlToText(descriptionNeed.value), 120);
                needEdit.productFamilyId = productFamily.value;
                needEdit.productFamily = productF;
                needEdit.needIdProduct = needProduct.value;
                needEdit.needProduct = productC;                
                needEdit.needIdImplementation = needImplementation.value;
                needEdit.needImplementation = implementation;
                needEdit.needTask = needTask.value;
                needEdit.needBenefits = needBenefits.value;
                needEdit.needIdResponsable = idUsuario;
                needEdit.needResponsable = nameUsuario;
                needEdit.needDate = needDate.value;
                needEdit.needFormat = needDate.value;
                needEdit.statusIdNeed = statusNeed.value;
                needEdit.statusNeed = status;
                editNeed(needEdit);
                
                swtShowMessage('success',"Necesidad editada exitosamente","Señor usuario, recuerde guardar el plan de negocio. De no ser así las necesidades editadas se perderán.",{onConfirmCallback: this._closeCreate});

            } else {
                const uuid = _.uniqueId('need_');
                let need = {
                    uuid,
                    needIdType: needType.value,
                    needType: needC,
                    descriptionNeed: descriptionNeed.value,
                    descriptionNeedText: shorterStringValue(htmlToText(descriptionNeed.value), 120),
                    productFamilyId: productFamily.value,
                    productFamily: productF,
                    needIdProduct: needProduct.value,
                    needProduct: productC,                    
                    needIdImplementation: needImplementation.value,
                    needImplementation: implementation,
                    needTask: needTask.value,
                    needBenefits: needBenefits.value,
                    needIdResponsable: idUsuario,
                    needResponsable: nameUsuario,
                    needDate: needDate.value,
                    needFormat: needDate.value,
                    statusIdNeed: statusNeed.value,
                    statusNeed: status
                };
                addNeed(need);
                swtShowMessage('success',"Necesidad agregada exitosamente","Señor usuario, recuerde guardar el plan de negocio. De no ser así las necesidades agregadas se perderán.",{onConfirmCallback: this._closeCreate});
            }
        
    }

    updateKeyValueUsersBanco(e) {
        const { fields: { needResponsable, idEmployee }, filterUsersBanco, swtShowMessage } = this.props;
        let self = this;
        
        const selector = $('.ui.search.needResponsable');
        if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
            e.consultclick ? "" : e.preventDefault();
            if (needResponsable.value !== "" && needResponsable.value !== null && needResponsable.value !== undefined) {
                if(needResponsable.value.length < 3) {
                    swtShowMessage('error','Error','Señor usuario, para realizar la busqueda es necesario ingresar mas de 3 caracteres');
                    return;
                }
               
                selector.toggleClass('loading');
                filterUsersBanco(needResponsable.value).then((data) => {
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
                            needResponsable.onChange(event.title);
                            idEmployee.onChange(event.idUsuario);
                            
                            return 'default';
                        }
                    });
                    selector.toggleClass('loading');
                    selector.search('search local', needResponsable.value);
                    setTimeout(function () {
                        $('#inputParticipantBanc').focus();
                    }, 150);
                });
            }
        }
    }

    _updateValue(value) {
        const { fields: { needResponsable } } = this.props;
        needResponsable.onChange(value);
    }

    componentWillMount() {
        const { getClientNeeds, getMasterDataFields, selectsReducer, consultDataSelect } = this.props;
        getClientNeeds();
        consultDataSelect(PRODUCTS, PRODUCTS_MASK);        
        getMasterDataFields([IMPLEMENTATION_TIMELINE, STATUS_NEED, PRODUCT_FAMILY]);        
    }

    render() {
        const { initialValues, selectsReducer, disabled, handleSubmit, error,
            fields: { needType, descriptionNeed, productFamily, needProduct, needImplementation, needTask, needBenefits, needResponsable, needDate, statusNeed, idEmployee} } = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreateNeed)}>
                <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                    id="modalComponentScrollNeed">
                    <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Adicionar necesidad al plan de negocio</span>
                    </dt>
                    <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '30px' }}>
                        <p style={{ paddingTop: "10px", marginBottom: "0px" }}>Los campos marcados con asterisco (<span
                            style={{ color: "red" }}>*</span>) son obligatorios.</p>
                        <Row>
                            <Col xs>
                                <dt><span>Necesidad (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox
                                        name="needType"
                                        {...needType}
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'need'}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get('pipelineClientNeeds') || []}
                                        disabled={disabled}
                                    />
                                </dt>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Descripción de la necesidad (<span style={{ color: "red" }}>*</span>)</span>
                                </dt>
                                <RichText
                                    name="descriptionNeed"
                                    style={{ width: '100%', height: '180px' }}
                                    {...descriptionNeed}
                                    disabled={disabled}
                                    readOnly={_.isEqual(disabled, 'disabled')}
                                />
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '20px' }}>
                            <Col xs={6} md={3} lg={3}>
                                <dt><span>Familia de productos (<span
                                    style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox
                                        name='productFamily'
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        {...productFamily}                                        
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(PRODUCT_FAMILY) || []}
                                        onChange={val => this._changeProductFamily(val)}
                                        disabled={disabled}
                                    />
                                </dt>
                            </Col>
                            <Col xs>
                                <dt><span>Producto(s) que satisface(n) la necesidad (<span
                                    style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox
                                        name="needProduct"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        {...needProduct}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(PRODUCTS) || []}
                                        disabled={disabled}
                                    />
                                </dt>
                            </Col>
                            <Col xs>
                                <dt><span>Implementación  (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBox
                                        name="needImplementation"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        {...needImplementation}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(IMPLEMENTATION_TIMELINE) || []}
                                        disabled={disabled}
                                    />
                                </dt>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Plan de Acción / Cómo le voy a llevar el producto y/o servicio (<span
                                    style={{ color: "red" }}>*</span>)</span></dt>
                                <RichText
                                    name="needTask"
                                    style={{ width: '100%', height: '180px' }}
                                    {...needTask}
                                    disabled={disabled}
                                    readOnly={_.isEqual(disabled, 'disabled')}
                                />
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '20px' }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Resultados y/o Beneficios esperados  (<span
                                    style={{ color: "red" }}>*</span>)</span></dt>
                                <RichText
                                    name="needBenefits"
                                    style={{ width: '100%', height: '180px' }}
                                    {...needBenefits}
                                    disabled={disabled}
                                    readOnly={_.isEqual(disabled, 'disabled')}
                                />
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: '20px' }}>
                            <Col xs={12} md={12} lg={12}>
                                <dt><span>Responsable  (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }}>
                                    <ComboBoxFilter
                                        name="needResponsable"
                                        {...needResponsable}
                                        value={needResponsable.value}
                                        labelInput="Ingrese un criterio de búsqueda..."
                                        parentId="dashboardComponentScroll"
                                        onChange={(val) => {if (idEmployee.value) { idEmployee.onChange(null) } needResponsable.onChange(val)}}
                                        onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                                        onSelect={val => this._updateValue(val)}
                                        disabled={disabled}
                                    />
                                    
                                </dt>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs>
                                <dt><span>Estado  (<span style={{ color: "red" }}>*</span>)</span></dt>
                                <dt style={{ paddingTop: "0px" }} onClick={this._scroll}>
                                    <ComboBox
                                        name="statusNeed"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        {...statusNeed}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(STATUS_NEED) || []}
                                        disabled={disabled}
                                    />
                                </dt>
                            </Col>
                            <Col xs>
                                <dt><span>Fecha de solución - DD/MM/YYYY (<span style={{ color: "red" }}>*</span>)</span>
                                </dt>
                                <dt style={{ paddingTop: "0px" }} onClick={this._scroll}>
                                    <DateTimePickerUi
                                        id='fecha'
                                        culture='es'
                                        format={"DD/MM/YYYY"}
                                        time={false}
                                        {...needDate}
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
        getClientNeeds,
        getMasterDataFields,
        filterUsersBanco,
        addNeed,
        editNeed,
        swtShowMessage,
        consultDataSelect,
        consultListWithParameterUbication
    }, dispatch);
}

function mapStateToProps({ needs, selectsReducer }, { needEdit }) {
    if (needEdit !== undefined) {
        return {
            needs,
            selectsReducer,
            initialValues: {
                needType: needEdit.needIdType,
                descriptionNeed: needEdit.descriptionNeed,
                productFamily: needEdit.productFamilyId,
                needProduct: needEdit.needIdProduct,                
                needImplementation: needEdit.needIdImplementation,
                needTask: needEdit.needTask,
                needBenefits: needEdit.needBenefits,
                needResponsable: needEdit.needResponsable,
                idEmployee: needEdit.needIdResponsable,
                statusNeed: needEdit.statusIdNeed,
                needDate: needEdit.needFormat
            }

        }
    } else {
        return {
            needs,
            selectsReducer,
            initialValues: {
                needType: '',
                descriptionNeed: '',
                productFamily: '',
                needProduct: '',                
                needImplementation: '',
                needTask: '',
                needBenefits: '',
                needResponsable: '',
                statusNeed: '',
                needDate: ''
            }
        };
    }
}


export default reduxForm({
    form: 'submitValidationNeed',
    fields,
    validate,
    onSubmitFail: errors => {
        document.getElementById('modalComponentScrollNeed').scrollTop = 0;
        const { swtShowMessage } = thisForm.props;

        let numXssValidation = Object.keys(errors).filter(item => errors[item] == VALUE_XSS_INVALID).length;
        
        if (numXssValidation > 0) {
            swtShowMessage(MESSAGE_ERROR, REGEX_SIMPLE_XSS_TITLE, REGEX_SIMPLE_XSS_MESAGE);
        } else {
            swtShowMessage(MESSAGE_ERROR, "Campos obligatorios", "Señor usuario, para agregar una necesidad debe ingresar los campos obligatorios.");
        }

    }
}, mapStateToProps, mapDispatchToProps)(ModalNeed);

