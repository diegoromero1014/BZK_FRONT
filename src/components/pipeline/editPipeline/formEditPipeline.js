import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../../ui/comboBoxFilter/comboBoxFilter';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import {consultDataSelect, consultList, getMasterDataFields, getPipelineCurrencies,
  getClientNeeds} from '../../selectsComponent/actions';
import {PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, PIPELINE_PRODUCTS, FILTER_COUNTRY,
    PIPELINE_BUSINESS, PROBABILITY, LINE_OF_BUSINESS, PRODUCTS} from '../../selectsComponent/constants';
import {SAVE_DRAFT, SAVE_PUBLISHED, OPTION_REQUIRED, VALUE_REQUIERED, DATE_FORMAT, DATETIME_FORMAT, REVIEWED_DATE_FORMAT,
  DATE_START_AFTER, MESSAGE_SAVE_DATA, EDITAR, ONLY_POSITIVE_INTEGER} from '../../../constantsGlobal';
import {PROPUEST_OF_BUSINESS, POSITIVE_INTEGER, INTEGER, REAL, LAST_PIPELINE_REVIEW, CURRENCY_LABEL_COP,
    CURRENCY_COP, CURRENCY_LABEL_OTHER_OPTION, LINE_OF_BUSINESS_LEASING,
    ORIGIN_PIPELIN_BUSINESS} from '../constants';
import {createEditPipeline, getPipelineById, pdfDescarga} from '../actions';
import {consultParameterServer, formValidateKeyEnter, nonValidateEnter,
  handleBlurValueNumber} from '../../../actionsGlobal';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import {changeStateSaveData} from '../../dashboard/actions';
import {MENU_CLOSED} from '../../navBar/constants';
import _ from 'lodash';
import $ from 'jquery';
import numeral from 'numeral';
import HeaderPipeline from '../headerPipeline';
import {editBusiness, addBusiness, clearBusiness} from '../business/ducks';
import Business from '../business/business';

const fields = ["id", "nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths", "businessStatus",
    "businessWeek", "currency", "indexing", "endDate", "need", "observations", "business", "product",
    "priority", "registeredCountry", "startDate", "client", "documentStatus", "reviewedDate",
    "createdBy", "updatedBy", "createdTimestamp", "updatedTimestamp", "createdByName", "updatedByName", "positionCreatedBy",
    "positionUpdatedBy", "probability", "pendingDisburAmount", "amountDisbursed", "estimatedDisburDate", "entity", "contract"];

const validate = values => {
    const errors = {};
    if (!values.businessStatus) {
        errors.businessStatus = OPTION_REQUIRED;
    } else {
        errors.businessStatus = null;
    }
    if (!values.value) {
        errors.value = VALUE_REQUIERED;
    } else {
        errors.value = null;
    }
    if (!values.currency) {
        errors.currency = OPTION_REQUIRED;
    } else {
        errors.currency = null;
    }
    if (!values.need) {
        errors.need = OPTION_REQUIRED;
    } else {
        errors.need = null;
    }
    if (!values.startDate) {
        errors.startDate = VALUE_REQUIERED;
    } else {
        errors.startDate = null;
    }
    if (!values.endDate) {
        errors.endDate = VALUE_REQUIERED;
    } else {
        errors.endDate = null;
    }
    if (values.endDate && values.startDate) {
        var startDate = parseInt(moment(values.startDate, DATE_FORMAT).format('x'));
        var endDate = parseInt(moment(values.endDate, DATE_FORMAT).format('x'));
        if (startDate > endDate) {
            errors.startDate = DATE_START_AFTER;
        } else {
            errors.startDate = null;
        }
    }
    return errors;
};

export default function createFormPipeline(name, origin, pipelineBusiness, functionCloseModal, disabled) {
    var nameBusiness = _.uniqueId('business_');
    var nameProduct = _.uniqueId('product_');
    var nameIndexing = _.uniqueId('indexing_');
    var nameNeed = _.uniqueId('need_');
    var namePriority = _.uniqueId('priority_');
    var nameBusinessStatus = _.uniqueId('businessStatus_');
    var nameRegisteredCountry = _.uniqueId('registeredCountry_');
    var nameBusinessWeek = _.uniqueId('businessWeek_');
    var nameProbability = _.uniqueId('probability_');
    var nameEntity = _.uniqueId('entity_');
    var nameCurrency = _.uniqueId('currency_');
    let typeMessage = "success";
    let titleMessage = "";
    let message = "";
    let typeButtonClick;
    let idCurrencyAux = null;
    let contollerErrorChangeType = false;

    class FormEditPipeline extends Component {

        constructor(props) {
            super(props);
            this.state = {
                showMessageEditPipeline: false,
                isEditable: false,
                showConfirm: false,
                employeeResponsible: false,
                showConfirmChangeCurrency: false,
                errorBusinessPipeline: null,
                labelCurrency: CURRENCY_LABEL_OTHER_OPTION,
                visibleContract: false,
                pendingUpdate: false,
                updateValues: {},
                firstTimeCharging: false
            };

            this._submitEditPipeline = this._submitEditPipeline.bind(this);
            this._closeMessageEditPipeline = this._closeMessageEditPipeline.bind(this);
            this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
            this._updateValue = this._updateValue.bind(this);
            this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
            this._onCloseButton = this._onCloseButton.bind(this);
            this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
            this._changeCurrency = this._changeCurrency.bind(this);
            this._editPipeline = this._editPipeline.bind(this);
            this._onClickPDF = this._onClickPDF.bind(this);
            this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
            this._handleFocusValueNumber = this._handleFocusValueNumber.bind(this);
            this._handleTermInMonths = this._handleTermInMonths.bind(this);
            this._closeConfirmChangeCurrency = this._closeConfirmChangeCurrency.bind(this);
            this._closeCancelConfirmChanCurrency = this._closeCancelConfirmChanCurrency.bind(this);
            this._changeEntity = this._changeEntity.bind(this);
        }

        _closeMessageEditPipeline() {
            this.setState({
                showMessageEditPipeline: false
            });
            if (origin !== ORIGIN_PIPELIN_BUSINESS) {
                if (typeMessage === "success") {
                    redirectUrl("/dashboard/clientInformation");
                }
            } else {
                functionCloseModal();
            }

            if(this.state.pendingUpdate){
                this.props.editBusiness(this.state.updateValues);
            }
        }

        _onClickPDF() {
            const {pdfDescarga, params: {id}} = this.props;
            pdfDescarga(window.localStorage.getItem('idClientSelected'), id);
        }

        _changeCurrency(currencyValue) {
            const {fields: {value}, selectsReducer} = this.props;
            var pipelineCurrencies = selectsReducer.get('pipelineCurrencies');
            var codeCurrency = _.get(_.filter(pipelineCurrencies, ['id', parseInt(currencyValue)]), '[0].code');
            if (codeCurrency === CURRENCY_COP) {
                this.setState({
                    labelCurrency: CURRENCY_LABEL_COP
                });
            } else {
                this.setState({
                    labelCurrency: CURRENCY_LABEL_OTHER_OPTION
                });
            }
            if (idCurrencyAux == null) {
                idCurrencyAux = parseInt(currencyValue);
            }
            if (this.state.isEditable && currencyValue !== undefined && currencyValue !== '' && currencyValue !== null && parseInt(currencyValue) !== parseInt(idCurrencyAux) && !contollerErrorChangeType) {
                contollerErrorChangeType = true;
                if (idCurrencyAux !== null && value.value !== '') {
                    titleMessage = "Tipo de moneda";
                    message = "Señor usuario, sí cambia la “Moneda” la información diligenciada en el “Valor” se borrará. ¿Está seguro que desea cambiar la Moneda?";
                    this.setState({
                        showConfirmChangeCurrency: true
                    });
                } else {
                    idCurrencyAux = parseInt(currencyValue);
                    contollerErrorChangeType = false;
                    this.setState({
                        showConfirmChangeCurrency: false
                    });
                }
            } else {
                idCurrencyAux = parseInt(currencyValue);
                contollerErrorChangeType = false;
                this.setState({
                    showConfirmChangeCurrency: false
                });
            }
            var lugarSelector = $('.valueMillions');
            var input = lugarSelector.find("input");
            input.focus();
        }

        _changeEntity(val) {
            const {fields: {contract}, selectsReducer} = this.props;
            var linesOfBusiness = selectsReducer.get(LINE_OF_BUSINESS)
            var lineOfBusinessSelected = _.get(_.filter(linesOfBusiness, ['id', parseInt(val)]), '[0].key');
            if (lineOfBusinessSelected === LINE_OF_BUSINESS_LEASING) {
                this.setState({
                    visibleContract: true
                });
            } else {
                this.setState({
                    visibleContract: false
                });
                contract.onChange("");
            }
        }


        _handleBlurValueNumber(typeValidation, valuReduxForm, val, allowsDecimal) {
            //Elimino los caracteres no validos
            for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
                if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                    output += val.toString().charAt(i)
                }
            }
            val = output;

            /* Si typeValidation = 2 es por que el valor puede ser negativo
             Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
             */
            var decimal = '';
            if (val.includes(".")) {
                var vectorVal = val.split(".");
                if (allowsDecimal) {
                    val = vectorVal[0] + '.';
                    if (vectorVal.length > 1) {
                        decimal = vectorVal[1].substring(0, 4);
                    }
                } else {
                    val = vectorVal[0];
                }
            }

            if (typeValidation === 2) { //Realizo simplemente el formateo
                var pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1,$2");
                }
                valuReduxForm.onChange(val + decimal);
            } else { //Valido si el valor es negativo o positivo
                var value = numeral(valuReduxForm.value).format('0');
                if (value >= 0) {
                    pattern = /(-?\d+)(\d{3})/;
                    while (pattern.test(val)) {
                        val = val.replace(pattern, "$1,$2");
                    }
                    valuReduxForm.onChange(val + decimal);
                } else {
                    valuReduxForm.onChange("");
                }
            }
        }

        _handleFocusValueNumber(valuReduxForm, val) {
            //Elimino los caracteres no validos
            for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
                if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                    output += val.toString().charAt(i)
                }
            }
            valuReduxForm.onChange(output);
        }

        _handleTermInMonths(valuReduxForm, val) {
            //Elimino los caracteres no validos
            for (var i = 0, output = '', validos = "0123456789"; i < (val + "").length; i++) {
                if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                    output += val.toString().charAt(i)
                }
            }
            valuReduxForm.onChange(output);
        }

        _onCloseButton() {
            message = "¿Está seguro que desea salir de la pantalla de edición de pipeline?";
            titleMessage = "Confirmación salida";
            this.setState({showConfirm: true});
        }

        _closeConfirmClosePipeline() {
            this.setState({showConfirm: false});
            redirectUrl("/dashboard/clientInformation");
        }

        _closeCancelConfirmChanCurrency() {
            this.setState({
                showConfirmChangeCurrency: false
            });
            contollerErrorChangeType = false;
            const {fields: {currency}} = this.props;
            if (idCurrencyAux !== null) {
                currency.onChange(idCurrencyAux);
            }
        }

        _closeConfirmChangeCurrency() {
            this.setState({
                showConfirmChangeCurrency: false
            });
            contollerErrorChangeType = false;
            const {fields: {value, currency}} = this.props;
            if (idCurrencyAux !== null) {
                value.onChange('');
            }
            idCurrencyAux = parseInt(currency.value);
        }

        _submitEditPipeline() {
            const {initialValues, fields: {idUsuario, value, commission, roe, termInMonths, businessStatus,
                businessWeek, currency, indexing, endDate, need, observations, business, product,
                priority, registeredCountry, startDate, client, documentStatus, nameUsuario, probability, pendingDisburAmount, amountDisbursed,
                estimatedDisburDate, entity, contract}, createEditPipeline, changeStateSaveData, pipelineBusinessReducer} = this.props;
            const idPipeline = origin === ORIGIN_PIPELIN_BUSINESS ? null : this.props.params.id;

            if ((nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null) && (idUsuario.value === null || idUsuario.value === '' || idUsuario.value === undefined)) {
                this.setState({
                    employeeResponsible: true
                });
            } else {
                if ((business.value !== "" && business.value !== null && business.value !== undefined) || typeButtonClick === SAVE_DRAFT) {
                    let pipelineJson = {
                        "id": idPipeline,
                        "client": window.localStorage.getItem('idClientSelected'),
                        "documentStatus": typeButtonClick,
                        "product": product.value,
                        "businessStatus": businessStatus.value,
                        "employeeResponsible": nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null ? idUsuario.value : null,
                        "currency": currency.value,
                        "indexing": indexing.value,
                        "commission": commission.value === undefined || commission.value === null || commission.value === '' ? '' : numeral(commission.value).format('0.0000'),
                        "businessWeek": businessWeek.value,
                        "need": need.value,
                        "priority": priority.value,
                        "roe": roe.value === undefined || roe.value === null || roe.value === '' ? '' : numeral(roe.value).format('0.0000'),
                        "registeredCountry": registeredCountry.value,
                        "observations": observations.value,
                        "pipelineBusiness": JSON.parse('[' + ((business.value) ? business.value : "") + ']'),
                        "termInMonths": termInMonths.value,
                        "value": value.value === undefined ? null : (value.value).replace(/,/g, ""),
                        "startDate": parseInt(moment(startDate.value, DATE_FORMAT).format('x')),
                        "endDate": parseInt(moment(endDate.value, DATE_FORMAT).format('x')),
                        "probability": probability.value,
                        "pendingDisburAmount": pendingDisburAmount.value === undefined || pendingDisburAmount.value === null || pendingDisburAmount.value === '' ? null : (pendingDisburAmount.value).replace(/,/g, ""),
                        "amountDisbursed": amountDisbursed.value === undefined || amountDisbursed.value === null || amountDisbursed.value === '' ? null : (amountDisbursed.value).replace(/,/g, ""),
                        "entity": entity.value,
                        "contract": contract.value,
                        "estimatedDisburDate": parseInt(moment(estimatedDisburDate.value, DATE_FORMAT).format('x'))
                    };
                    if (origin === ORIGIN_PIPELIN_BUSINESS) {
                        typeMessage = "success";
                        titleMessage = "Edición de negocio";
                        message = "Señor usuario, el negocio se editó exitosamente.";
                        this.setState({
                            showMessageEditPipeline: true,
                            pendingUpdate: true,
                            updateValues: Object.assign({}, pipelineJson, {uuid: pipelineBusiness.uuid})
                        });
                    } else {
                        var resultPipelineBusines = [];
                        _.map(pipelineBusinessReducer.toArray(),
                          function(pipelineBusiness){
                            resultPipelineBusines.push(_.omit(pipelineBusiness, ['uuid']));
                          }
                        );
                        pipelineJson.listPipelines = resultPipelineBusines;
                        changeStateSaveData(true, MESSAGE_SAVE_DATA);
                        createEditPipeline(pipelineJson).then((data) => {
                            changeStateSaveData(false, "");
                            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                                redirectUrl("/login");
                            } else {
                                if ((_.get(data, 'payload.data.status') === 200)) {
                                    typeMessage = "success";
                                    titleMessage = "Edición pipeline";
                                    message = "Señor usuario, el pipeline se editó exitosamente.";
                                    this.setState({showMessageEditPipeline: true});
                                } else {
                                    typeMessage = "error";
                                    titleMessage = "Edición pipeline";
                                    message = "Señor usuario, ocurrió un error editando el informe de pipeline.";
                                    this.setState({showMessageEditPipeline: true});
                                }
                            }
                        }, (reason) => {
                            changeStateSaveData(false, "");
                            typeMessage = "error";
                            titleMessage = "Edición pipeline";
                            message = "Señor usuario, ocurrió un error editando el informe de pipeline.";
                            this.setState({showMessageEditPipeline: true});
                        });
                    }
                }
            }
        }

        updateKeyValueUsersBanco(e) {
            const {fields: {nameUsuario, idUsuario}, filterUsersBanco} = this.props;
            var self = this;
            idUsuario.onChange('');
            if (e.keyCode === 13 || e.which === 13) {
                e.consultclick ? "" : e.preventDefault();
                if (nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined) {
                    $('.ui.search.participantBanc').toggleClass('loading');
                    filterUsersBanco(nameUsuario.value).then((data) => {
                            let usersBanco = _.get(data, 'payload.data.data');
                            $('.ui.search.participantBanc')
                                .search({
                                    cache: false,
                                    source: usersBanco,
                                    maxResults: 1500,
                                    searchFields: [
                                        'title',
                                        'description',
                                        'idUsuario',
                                        'cargo'
                                    ],
                                    onSelect: function (event) {
                                        nameUsuario.onChange(event.title);
                                        idUsuario.onChange(event.idUsuario);
                                        self.setState({
                                            employeeResponsible: false
                                        });
                                        return 'default';
                                    }
                                });
                            $('.ui.search.participantBanc').toggleClass('loading');
                            setTimeout(function () {
                                $('#inputParticipantBanc').focus();
                            }, 250);
                        }
                    );
                }
            }
        }

        _updateValue(value) {
            const {fields: {idUsuario, nameUsuario, cargoUsuario}, contactsByClient} = this.props;
            var contactClient = contactsByClient.get('contacts');
            var userSelected;
            _.map(contactClient, contact => {
                if (contact.id.toString() === value) {
                    userSelected = contact;
                    return contact;
                }
            });
            if (userSelected !== null && userSelected !== undefined) {
                idUsuario.onChange(userSelected.id);
                nameUsuario.onChange(userSelected.nameComplet);
            }
        }

        _editPipeline() {
            this.setState({
                isEditable: !this.state.isEditable
            });
        }

        componentWillMount() {
          typeButtonClick = null;
          this.setState({
              errorBusinessPipeline: null
          });
          const {clientInformacion, getMasterDataFields, getPipelineCurrencies, getClientNeeds,
              getPipelineById, nonValidateEnter, fields: {nameUsuario, idUsuario, value, commission, roe,
              termInMonths, businessStatus, businessWeek, currency, indexing, endDate, need, observations,
              business, product, priority, registeredCountry, startDate, client, documentStatus}, addBusiness, clearBusiness} = this.props;
          if(origin !== ORIGIN_PIPELIN_BUSINESS){
            clearBusiness();
          }else{
            this.setState({
              isEditable: disabled
            });
          }
          if (pipelineBusiness !== null && pipelineBusiness !== undefined && pipelineBusiness !== '') {
              if (pipelineBusiness.pipelineBusiness.length > 0) {
                  business.onChange(JSON.parse('["' + _.join(pipelineBusiness.pipelineBusiness, '","') + '"]'));
              }
          } else {
            const {params: {id}}= this.props;
            getPipelineById(id).then((result) => {
              var data = result.payload.data.data;
              _.forIn(data.listPipelines, function(pipeline, key) {
                const uuid = _.uniqueId('pipelineBusiness_');
                pipeline.uuid = uuid;
                addBusiness(pipeline);
              });
            });
          }
          nonValidateEnter(true);
          const infoClient = clientInformacion.get('responseClientInfo');
          getPipelineCurrencies();
          getClientNeeds();
          if (_.isEmpty(infoClient)) {
              redirectUrl("/dashboard/clientInformation");
          } else {
              getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY, PIPELINE_BUSINESS,
                  PROBABILITY, LINE_OF_BUSINESS, PRODUCTS]);
          }
        }

        componentWillReceiveProps(nextProps) {
            const {fields: {business}} = this.props;
            if (typeButtonClick === SAVE_PUBLISHED) {
                if (business.value === null || business.value === undefined || business.value === "") {
                    this.setState({
                        errorBusinessPipeline: OPTION_REQUIRED
                    });
                } else {
                    this.setState({
                        errorBusinessPipeline: null
                    });
                }
            } else {
                this.setState({
                    errorBusinessPipeline: null
                });
            }
        }

        componentDidUpdate(prevProps, prevState){
          if(origin === ORIGIN_PIPELIN_BUSINESS && this.state.firstTimeCharging === false){
            this.modalScrollArea.scrollTop = 0;
            this.setState({
              firstTimeCharging: true
            });
          }
        }

        render() {
            const {
                initialValues, fields: {
                nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
                businessWeek, currency, indexing, endDate, need, observations, business, product,
                priority, registeredCountry, startDate, client, documentStatus,
                updatedBy, createdTimestamp, updatedTimestamp, createdByName, updatedByName, reviewedDate, positionCreatedBy,
                positionUpdatedBy, probability, entity, pendingDisburAmount, amountDisbursed, estimatedDisburDate, contract
            },
                clientInformacion, selectsReducer, handleSubmit, pipelineReducer, consultParameterServer, reducerGlobal, navBar
            } = this.props;
            const ownerDraft = pipelineReducer.get('ownerDraft');
            let fechaModString = '';
            if (updatedTimestamp.value !== null) {
                let fechaModDateMoment = moment(updatedTimestamp.value, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }
            let fechaCreateString = '';
            if (createdTimestamp.value !== null) {
                let fechaCreateDateMoment = moment(createdTimestamp.value, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }

            return (
                <div>
                    {origin !== ORIGIN_PIPELIN_BUSINESS && <HeaderPipeline />}
                    <form onSubmit={handleSubmit(this._submitEditPipeline)}
                          onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                          className="my-custom-tab"
                          style={origin === ORIGIN_PIPELIN_BUSINESS ? {} : {
                                  backgroundColor: "#FFFFFF",
                                  paddingTop: "10px",
                                  width: "100%",
                                  paddingBottom: "50px"
                              }}>
                        <div id={origin === ORIGIN_PIPELIN_BUSINESS ? "modalComponentFormEditPipeline" : "formModal"}
                            className={origin === ORIGIN_PIPELIN_BUSINESS ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ""}
                            style={origin === ORIGIN_PIPELIN_BUSINESS ? {
                                    overflowX: "hidden",
                                    paddingBottom: "0px",
                                    marginTop: "10px"
                                } : {}}

                                ref={divArea => this.modalScrollArea = divArea}>
                            <Row style={{padding: "5px 10px 0px 20px"}}>
                                <Col xs={10} sm={10} md={10} lg={10}>
                                    <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
                                </Col>
                                <Col xs={2} sm={2} md={2} lg={2} style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {}}>
                                    {_.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), EDITAR), false) &&
                                    <button type="button" onClick={this._editPipeline}
                                            className={'btn btn-primary modal-button-edit'}
                                            style={{marginRight: '15px', float: 'right', marginTop: '-15px'}}>
                                              Editar
                                            <i className={'icon edit'}/></button>
                                    }
                                </Col>
                            </Row>
                            <Row style={{padding: "10px 10px 20px 20px"}}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                    <div className="tab-content-row" style={{
                                        borderTop: "1px dotted #cea70b",
                                        width: "99%",
                                        marginBottom: "10px"
                                    }}/>
                                      <i className="browser icon" style={{fontSize: "20px"}}/>
                                      <span style={{fontSize: "20px"}}> Datos de pipeline</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={12} md={6} lg={6}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Negocio (</span><span style={{color: "red"}}>*</span>)
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...business}
                                            name={nameBusiness}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PIPELINE_BUSINESS) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                        {this.state.errorBusinessPipeline &&
                                        <div>
                                            <div className="ui pointing red basic label">
                                                {this.state.errorBusinessPipeline}
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Producto</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...product}
                                            name={nameProduct}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PRODUCTS) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Estado (</span><span style={{color: "red"}}>*</span>)
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...businessStatus}
                                            name={nameBusinessStatus}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PIPELINE_STATUS) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Indexación</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...indexing}
                                            name={nameIndexing}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PIPELINE_INDEXING) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Interés / Spread</span>
                                        </dt>
                                        <Input
                                            name="commission"
                                            type="text"
                                            {...commission}
                                            max="10"
                                            parentId="dashboardComponentScroll"
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onBlur={val => this._handleBlurValueNumber(2, commission, commission.value, true)}
                                            onFocus={val => this._handleFocusValueNumber(commission, commission.value)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>ROE</span>
                                        </dt>
                                        <Input
                                            name="roe"
                                            type="text"
                                            {...roe}
                                            max="10"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => this._handleBlurValueNumber(1, roe, roe.value, true)}
                                            onFocus={val => this._handleFocusValueNumber(roe, roe.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Empleado responsable</span>
                                        </dt>
                                        <div className="ui search participantBanc fluid">
                                            <ComboBoxFilter className="prompt" id="inputParticipantBanc"
                                                            style={{borderRadius: "3px"}}
                                                            autoComplete="off"
                                                            type="text"
                                                            {...nameUsuario}
                                                            value={nameUsuario.value}
                                                            onChange={nameUsuario.onChange}
                                                            placeholder="Ingrese un criterio de búsqueda..."
                                                            onKeyPress={this.updateKeyValueUsersBanco}
                                                            onSelect={val => this._updateValue(val)}
                                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            />
                                        </div>
                                        {
                                            this.state.employeeResponsible &&
                                            <div>
                                                <div className="ui pointing red basic label">
                                                    Debe seleccionar un empleado del banco
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Necesidad del cliente (</span><span style={{color: "red"}}>*</span>)
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'need'}
                                            {...need}
                                            name={nameNeed}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get('pipelineClientNeeds') || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Prioridad</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...priority}
                                            name={namePriority}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PIPELINE_PRIORITY) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>País libro</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...registeredCountry}
                                            name={nameRegisteredCountry}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(FILTER_COUNTRY) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Negocio de la semana</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...businessWeek}
                                            name={nameBusinessWeek}
                                            parentId="dashboardComponentScroll"
                                            data={[{id: true, value: 'Si'}, {id: false, value: 'No'}]}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Probabilidad</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...probability}
                                            name={nameProbability}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(PROBABILITY) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
                                    <dt>
                                        <span>Entidad</span>
                                    </dt>
                                    <ComboBox
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        {...entity}
                                        name={nameEntity}
                                        parentId="dashboardComponentScroll"
                                        data={selectsReducer.get(LINE_OF_BUSINESS) || []}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                        onChange={val => this._changeEntity(val)}
                                    />
                                </Col>
                                <Col xs={6} md={3} lg={3} style={this.state.visibleContract ? {
                                        paddingRight: "20px",
                                        display: "block"
                                    } : {display: "none"}}>
                                    <dt>
                                        <span>Contrato</span>
                                    </dt>
                                    <Input
                                        name="txtContract"
                                        type="text"
                                        {...contract}
                                        max="50"
                                        parentId="dashboardComponentScroll"
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                    />
                                </Col>
                            </Row>
                            <Row style={{padding: "20px 23px 20px 20px"}}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <div className="tab-content-row" style={{
                                            borderTop: "1px dotted #cea70b",
                                            width: "100%",
                                            marginBottom: "10px"
                                        }}/>
                                        <i className="book icon" style={{fontSize: "18px"}}/>
                                        <span style={{fontSize: "20px"}}>Detalle de plazo y monto</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Moneda (</span><span style={{color: "red"}}>*</span>)
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'code'}
                                            {...currency}
                                            name={nameCurrency}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get('pipelineCurrencies') || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onChange={val => this._changeCurrency(val)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>{this.state.labelCurrency} (</span><span
                                            style={{color: "red"}}>*</span>)
                                        </dt>
                                        <Input
                                            {...value}
                                            name="valueMillions"
                                            type="text"
                                            max="28"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => this._handleBlurValueNumber(1, value, value.value, false)}
                                            onFocus={val => this._handleFocusValueNumber(value, value.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Plazo en meses</span>
                                        </dt>
                                        <Input
                                            name="termInMonths"
                                            type="text"
                                            {...termInMonths}
                                            max="4"
                                            parentId="dashboardComponentScroll"
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onBlur={val => this._handleTermInMonths(termInMonths, termInMonths.value)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
                                    <dt>
                                        <span>Fecha de inicio - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
                                    </dt>
                                    <DateTimePickerUi
                                        culture='es'
                                        format={DATE_FORMAT}
                                        time={false}
                                        {...startDate}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                    />
                                </Col>
                                <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
                                    <dt>
                                        <span>Fecha de finalización - DD/MM/YYYY (</span><span
                                        style={{color: "red"}}>*</span>)
                                    </dt>
                                    <DateTimePickerUi
                                        {...endDate}
                                        culture='es'
                                        format={DATE_FORMAT}
                                        time={false}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                    />
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Monto pendiente por desembolsar</span>
                                        </dt>
                                        <Input
                                            name="txtPendingDisburAmount"
                                            type="text"
                                            {...pendingDisburAmount}
                                            max="28"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisburAmount, pendingDisburAmount.value, true, 2)}
                                            onFocus={val => this._handleFocusValueNumber(pendingDisburAmount, pendingDisburAmount.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Monto desembolsado</span>
                                        </dt>
                                        <Input
                                            name="txtAmountDisbursed"
                                            type="text"
                                            {...amountDisbursed}
                                            max="28"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, amountDisbursed, amountDisbursed.value, true, 2)}
                                            onFocus={val => this._handleFocusValueNumber(amountDisbursed, amountDisbursed.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Fecha estimada de desembolso - DD/MM/YYYY</span>
                                        </dt>
                                        <DateTimePickerUi
                                            {...estimatedDisburDate}
                                            culture='es'
                                            format={DATE_FORMAT}
                                            time={false}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Business origin={origin} disabled={this.state.isEditable}/>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {padding: "20px 23px 20px 20px"}}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <div className="tab-content-row" style={{
                                            borderTop: "1px dotted #cea70b",
                                            width: "100%",
                                            marginBottom: "10px"
                                        }}/>
                                        <i className="book icon" style={{fontSize: "18px"}}/>
                                        <span style={{fontSize: "20px"}}> Observaciones </span>
                                    </div>
                                </Col>
                            </Row>
                            <Row
                              style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {padding: "0px 23px 20px 20px"}}>
                              <Col xs={12} md={12} lg={12}>
			                          <Textarea
                                  name="observations"
                                  type="text"
                                  max="3500"
                                  {...observations}
                                  title="La longitud máxima de caracteres es de 3500"
                                  style={{width: '100%', height: '178px'}}
                                  disabled={this.state.isEditable ? '' : 'disabled'}
                                />
                              </Col>
                            </Row>
                            <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {}}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        textAlign: "left",
                                        marginTop: "0px",
                                        marginBottom: "20px",
                                        marginLeft: "20px"
                                    }}>
                                        <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato pipeline: </span><span
                                        style={{marginLeft: "0px", color: "#818282"}}>{reviewedDate.value}</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {padding: "10px 10px 0px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{fontWeight: "bold", color: "#818282"}}>Creado por</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{fontWeight: "bold", color: "#818282"}}>Fecha de creación</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null ?
                                        <span style={{fontWeight: "bold", color: "#818282"}}>Modificado por</span>
                                        : ''}
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null ?
                                        <span
                                            style={{fontWeight: "bold", color: "#818282"}}>Fecha de modificación</span>
                                        : ''}
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {padding: "5px 10px 0px 20px"}}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{marginLeft: "0px", color: "#818282"}}>{createdByName.value}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{marginLeft: "0px", color: "#818282"}}>{fechaCreateString}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null ?
                                        <span style={{marginLeft: "0px", color: "#818282"}}>{updatedByName.value}</span>
                                        : ''}
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null ?
                                        <span style={{marginLeft: "0px", color: "#818282"}}>{fechaModString}</span>
                                        : ''}
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? {display: "none"} : {padding: "0px 10px 20px 20px"}}>
                                <Col xs={6} md={6} lg={6}>
                                    <span style={{marginLeft: "0px", color: "#A7ADAD"}}>{positionCreatedBy.value}</span>
                                </Col>
                                <Col xs={6} md={6} lg={6}>
                                    <span style={{marginLeft: "0px", color: "#A7ADAD"}}>{positionUpdatedBy.value}</span>
                                </Col>
                            </Row>
                        </div>
                        <div style={origin !== ORIGIN_PIPELIN_BUSINESS ? {
                                position: "fixed",
                                border: "1px solid #C2C2C2",
                                bottom: "0px",
                                width: "100%",
                                marginBottom: "0px",
                                backgroundColor: "#F8F8F8",
                                height: "50px",
                                background: "rgba(255,255,255,0.75)"
                            } : {display: "none"}}>
                            <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
                                <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT}
                                        style={this.state.isEditable === true && ownerDraft === 0 ? {
                                                float: "right",
                                                margin: "8px 0px 0px -120px",
                                                position: "fixed",
                                                backgroundColor: "#00B5AD"
                                            } : {display: "none"}}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Guardar como borrador</span>
                                </button>
                                <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED}
                                        style={this.state.isEditable === true ? {
                                                float: "right",
                                                margin: "8px 0px 0px 107px",
                                                position: "fixed"
                                            } : {display: "none"}}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Guardar definitivo</span>
                                </button>
                                <button className="btn" type="button" onClick={this._onClickPDF} style={{
                                    float: "right",
                                    margin: "8px 0px 0px 292px",
                                    position: "fixed",
                                    backgroundColor: "#eb984e"
                                }}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Descargar pdf</span>
                                </button>
                                <button className="btn" type="button" onClick={this._onCloseButton} style={{
                                    float: "right",
                                    margin: "8px 0px 0px 450px",
                                    position: "fixed",
                                    backgroundColor: "rgb(193, 193, 193)"
                                }}>
                                    <span style={{color: "#FFFFFF", padding: "10px"}}>Cancelar</span>
                                </button>
                            </div>
                        </div>
                        <SweetAlert
                            type={typeMessage}
                            show={this.state.showMessageEditPipeline}
                            title={titleMessage}
                            text={message}
                            onConfirm={this._closeMessageEditPipeline}
                        />
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirm}
                            title={titleMessage}
                            text={message}
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={() => this.setState({showConfirm: false})}
                            onConfirm={this._closeConfirmClosePipeline}
                        />
                        <SweetAlert
                            type="warning"
                            show={this.state.showConfirmChangeCurrency}
                            title={titleMessage}
                            text={message}
                            confirmButtonColor='#DD6B55'
                            confirmButtonText='Sí, estoy seguro!'
                            cancelButtonText="Cancelar"
                            showCancelButton={true}
                            onCancel={this._closeCancelConfirmChanCurrency}
                            onConfirm={this._closeConfirmChangeCurrency}
                        />
                        <div className="modalBt4-footer modal-footer"
                          style={origin === ORIGIN_PIPELIN_BUSINESS ? {height: "76px"} : {display: "none"}}>
                            <button type="submit" className="btn btn-primary modal-button-edit"
                              style={this.state.isEditable ? {} : {display: "none"}}
                              onClick={() => typeButtonClick = SAVE_PUBLISHED}>
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({
            getMasterDataFields,
            getPipelineCurrencies,
            getClientNeeds,
            createEditPipeline,
            filterUsersBanco,
            getPipelineById,
            changeStateSaveData,
            nonValidateEnter,
            editBusiness,
            addBusiness,
            clearBusiness
        }, dispatch);
    }

    function mapStateToProps({clientInformacion, selectsReducer, contactsByClient, pipelineReducer, reducerGlobal, navBar, pipelineBusinessReducer}, pathParameter) {
        const pipelineResult = pipelineReducer.get('detailPipeline');
        var pipeline;
        if (origin !== ORIGIN_PIPELIN_BUSINESS) {
            pipeline = pipelineResult;
        } else {
            pipeline = pipelineBusiness;
        }
        if (pipeline) {
            return {
                clientInformacion,
                selectsReducer,
                contactsByClient,
                pipelineReducer,
                pdfDescarga,
                consultParameterServer,
                reducerGlobal,
                navBar,
                pipelineBusinessReducer,
                initialValues: {
                    id: pipeline.id,
                    businessStatus: pipeline.businessStatus,
                    businessWeek: pipeline.businessWeek,
                    commission: fomatInitialStateNumber(pipeline.commission),
                    currency: pipeline.currency,
                    idUsuario: pipeline.employeeResponsible,
                    nameUsuario: pipeline.employeeResponsibleName,
                    endDate: moment(pipeline.endDate).format(DATE_FORMAT),
                    indexing: pipeline.indexing,
                    need: pipeline.need,
                    observations: pipeline.observations === null ? '' : pipeline.observations,
                    product: pipeline.product,
                    priority: pipeline.priority,
                    roe: fomatInitialStateNumber(pipeline.roe),
                    registeredCountry: pipeline.registeredCountry,
                    startDate: moment(pipeline.startDate).format(DATE_FORMAT),
                    pipelineStatus: pipeline.pipelineStatus,
                    termInMonths: pipeline.termInMonths,
                    value: fomatInitialStateNumber(pipeline.value),
                    client: pipeline.client,
                    documentStatus: pipeline.documentStatus,
                    createdBy: pipeline.createdBy,
                    updatedBy: pipeline.updatedBy,
                    createdTimestamp: pipeline.createdTimestamp,
                    updatedTimestamp: pipeline.updatedTimestamp,
                    createdByName: pipeline.createdByName,
                    updatedByName: pipeline.updatedByName,
                    positionCreatedBy: pipeline.positionCreatedBy,
                    positionUpdatedBy: pipeline.positionUpdatedBy,
                    reviewedDate: moment(pipeline.reviewedDate, "x").locale('es').format(REVIEWED_DATE_FORMAT),
                    business: pipeline.pipelineBusiness === null || pipeline.pipelineBusiness === undefined ? '' : pipeline.pipelineBusiness[0],
                    probability: pipeline.probability,
                    entity: pipeline.entity,
                    pendingDisburAmount: fomatInitialStateNumber(pipeline.pendingDisburAmount),
                    amountDisbursed: fomatInitialStateNumber(pipeline.amountDisbursed),
                    estimatedDisburDate: pipeline.estimatedDisburDate !== null ? moment(pipeline.estimatedDisburDate).format(DATE_FORMAT) : "",
                    contract: pipeline.contract
                }
            };
        } else {
            return {
                clientInformacion,
                selectsReducer,
                contactsByClient,
                pipelineReducer,
                pdfDescarga,
                consultParameterServer,
                reducerGlobal,
                navBar,
                pipelineBusinessReducer
            };
        }
    }

    function fomatInitialStateNumber(val) {
        var decimal = '';
        if (val !== undefined && val !== null && val !== '') {
            val = val.toString();
            if (val.includes(".")) {
                var vectorVal = val.split(".");
                val = vectorVal[0] + '.';
                if (vectorVal.length > 1) {
                    decimal = vectorVal[1].substring(0, 4);
                }
            }
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val + "")) {
                val = val.toString().replace(pattern, "$1,$2");
            }
            return val + decimal;
        }
        return '';
    }

    return reduxForm({
        form: name || _.uniqueId('business_'),
        fields,
        validate,
        overwriteOnInitialValuesChange: false,

    }, mapStateToProps, mapDispatchToProps)(FormEditPipeline);
}
