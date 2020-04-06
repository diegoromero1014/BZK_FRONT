import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import moment from 'moment';
import _ from 'lodash';
import numeral from 'numeral';

import Textarea from '../../ui/textarea/textareaComponent';
import SweetAlert from '../sweetalertFocus';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import { redirectUrl } from '../globalComponents/actions';
import DateTimePickerUi from '../../ui/dateTimePicker/dateTimePickerComponent';

import { createProspect } from './actions';
import { changeStateSaveData } from '../main/actions';
import { getMasterDataFields, consultListByCatalogType } from '../selectsComponent/actions';
import {
    consultDataSelect,
    consultList,
    consultListWithParameter,
    consultListWithParameterUbication
} from '../selectsComponent/actions';

import * as constants from '../selectsComponent/constants';
import { SEGMENTS, SUBSEGMENTS } from '../selectsComponent/constants';
import {
    MESSAGE_SAVE_DATA
} from '../../constantsGlobal';
import * as constantsPropect from './constants';

import { fields, validations as validate } from './fieldsAndRules';

const valuesYesNo = [
    { 'id': true, 'value': "Si" },
    { 'id': false, 'value': "No" }
]
let titleDescription = "Diligencie está sección respondiendo a la pregunta ¿Qué debería conocer el Grupo Bancolombia de este cliente? (quién es, qué hace, cuáles son sus principales líneas de negocio, productos y servicios que ofrece, sector donde se encuentra, estrategia, países en los que tiene presencia, participación de mercado).";
let messageConfirm = "Recuerde que una vez creado el prospecto sólo podrá ser modificado por el gerente de cuenta Bancolombia o su asistente ¿está seguro de guardar la información?";
let titleConfirm = "Confirmación creación";
let typeConfirm = "create";

let isNature = false;

export class FormCreateProspect extends Component {
    constructor(props) {
        super(props);
        momentLocalizer(moment);
        this.state = {
            show: false,
            showEx: false,
            showEr: false
        };
        this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);
        this._onChangeCIIU = this._onChangeCIIU.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._closeWindow = this._closeWindow.bind(this);
        this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);

        this._closeError = this._closeError.bind(this);
        this._closeSuccess = this._closeSuccess.bind(this);
        this._onConfirmCreate = this._onConfirmCreate.bind(this);
        this._changeSegment = this._changeSegment.bind(this);

    }

    _closeWindow() {
        messageConfirm = "¿Está seguro que desea salir de la pantalla de creación de prospecto?";
        titleConfirm = "Confirmación salida";
        typeConfirm = "close";
        this.setState({ show: true });
    }

    _redirectClients() {
        redirectUrl("/dashboard/clients");
    }

    _closeError() {
        this.setState({ show: false, showEx: false, showEr: false });
    }

    _closeSuccess() {
        this.setState({ show: false, showEx: false, showEr: false });
        redirectUrl("/dashboard/clients");
    }


    _handleBlurValueNumber(typeValidation, valuReduxForm, val) {
        var pattern;
        //Elimino los caracteres no validos
        for (var i = 0, output = '', validos = "-0123456789"; i < val.length; i++) {
            if (validos.indexOf(val.charAt(i)) !== -1) {
                output += val.charAt(i)
            }
        }
        val = output;

        /* Si typeValidation = 2 es por que el valor puede ser negativo
         Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
         */
        if (typeValidation === 2) { //Realizo simplemente el formateo
            pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
            }
            valuReduxForm.onChange(val);
        } else { //Valido si el valor es negativo o positivo
            var value = numeral(val).format('0');
            if (value >= 0) {
                pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(val)) {
                    val = val.replace(pattern, "$1,$2");
                }
                valuReduxForm.onChange(val);
            } else {
                valuReduxForm.onChange("");
            }
        }
    }

    _onConfirmCreate() {
        this.setState({ show: false });
        if (typeConfirm === "create") {
            const {
                fields: {
                    razonSocial, descriptionCompany, reportVirtual, extractsVirtual, idCIIU, idSubCIIU,
                    address, telephone, district, country, city, province, annualSales, assets, liabilities, operatingIncome,
                    nonOperatingIncome, expenses, dateSalesAnnuals, idCelula, segment, subSegment,
                }, idTupeDocument, numberDocument, changeStateSaveData, clientType
            } = this.props;

            var jsonCreateProspect = {
                "clientIdNumber": numberDocument,
                "clientName": razonSocial.value,
                "clientStatus": "",
                "riskRating": null,
                "isProspect": true,
                "ciiu": idCIIU.value,
                "idCiiu": idCIIU.value,
                "celulaId": idCelula.value,
                "commercialRelationshipType": "",
                "countryOfOrigin": "",
                "isDecisionCenter": null,
                "economicGroup": null,
                "internalRating": "",
                "isic": "",
                "ratingHistory": "",
                "registrationKey": null,
                "riskGroup": "",
                "segment": segment.value,
                "subCiiu": idSubCIIU.value,
                "subSegment": subSegment.value,
                "countryOfFirstLevelManagement": "",
                "countryOfMainMarket": "",
                "relationshipStatus": 23,
                "typeOfClient": "",
                "status": 0,
                "isCreditNeeded": null,
                "annualSales": (annualSales.value === undefined || annualSales.value === null || annualSales.value === "") ? null : numeral(annualSales.value).format('0'),
                "salesUpadateDate": dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined && dateSalesAnnuals.value ? moment(dateSalesAnnuals.value, "DD/MM/YYYY").format('x') : null,
                "assets": (assets.value === undefined || assets.value === null || assets.value === "") ? null : numeral(assets.value).format('0'),
                "liabilities": (liabilities.value === undefined || liabilities.value === null || liabilities.value === "") ? null : numeral(liabilities.value).format('0'),
                "operatingIncome": (operatingIncome.value === undefined || operatingIncome.value === null || operatingIncome.value === "") ? null : numeral(operatingIncome.value).format('0'),
                "nonOperatingIncome": (nonOperatingIncome.value === undefined || nonOperatingIncome.value === null || nonOperatingIncome.value === "") ? null : numeral(nonOperatingIncome.value).format('0'),
                "expenses": (expenses.value === undefined || expenses.value === null || expenses.value === "") ? null : numeral(expenses.value).format('0'),
                "localMarket": "",
                "marketLeader": "",
                "territory": "",
                "actualizationDate": null,
                "justificationForNoRM": "",
                "justificationForLostClient": "",
                "justificationForCreditNeed": "",
                "isVirtualStatement": extractsVirtual.value,
                "lineOfBusiness": [],
                "isManagedByRm": null,
                "addresses": [
                    {
                        "typeOfAddress": 41,
                        "address": address.value,
                        "country": country.value,
                        "province": province.value,
                        "city": city.value,
                        "neighborhood": district.value,
                        "isPrincipalAddress": reportVirtual.value,
                        "phoneNumber": telephone.value,
                        "postalCode": "",
                    }],
                "notes": [],
                "description": descriptionCompany.value,
                "clientIdType": idTupeDocument,
                "clientType": clientType.id,
                "saveMethod": "prospecto"
            };
            const { createProspect } = this.props;
            changeStateSaveData(true, MESSAGE_SAVE_DATA);
            createProspect(jsonCreateProspect)
                .then((data) => {
                    changeStateSaveData(false, "");
                    if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === "false") {
                        redirectUrl("/login");
                    } else {
                        if (_.get(data, 'payload.data.status') === 200) {
                            this.setState({ showEx: true });
                        } else {
                            this.setState({ showEr: true });
                        }
                    }
                }, () => {
                    changeStateSaveData(false, "");
                    this.setState({ showEr: true });
                });
        } else {
            this._redirectClients();
        }
    }


    _changeSegment(idSegment) {
        const { fields: { segment, subSegment }, consultListByCatalogType } = this.props;
        segment.onChange(idSegment);

        consultListByCatalogType(SUBSEGMENTS, idSegment, SUBSEGMENTS);
        subSegment.onChange('');
    }

    componentWillMount() {
        const { consultList, consultDataSelect, getMasterDataFields } = this.props;
        getMasterDataFields([SEGMENTS]);
        consultList(constants.TEAM_FOR_EMPLOYEE);
        consultList(constants.CIIU);
        consultDataSelect(constants.FILTER_COUNTRY);
    }

    _onChangeCIIU(val) {
        const { fields: { idCIIU, idSubCIIU } } = this.props;

        idCIIU.onChange(val);
        const { consultListWithParameter } = this.props;
        consultListWithParameter(constants.SUB_CIIU, val);
        idSubCIIU.onChange('');
    }

    _onChangeCountry(val) {
        const { fields: { country, province, city } } = this.props;
        country.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
        province.onChange('');
        city.onChange('');
    }

    _onChangeProvince(val) {
        const { fields: { province, city } } = this.props;
        province.onChange(val);
        const { consultListWithParameterUbication } = this.props;
        consultListWithParameterUbication(constants.FILTER_CITY, province.value);
        city.onChange('');
    }

    _submitFormCreateProspect() {
        messageConfirm = "Recuerde que una vez creado el prospecto sólo podrá ser modificado por el gerente de cuenta Bancolombia o su asistente ¿está seguro de guardar la información?";
        titleConfirm = "Confirmación creación";
        typeConfirm = "create";
        this.setState({ show: true });
    };


    render() {
        const {
            fields: {
                razonSocial, descriptionCompany, reportVirtual, extractsVirtual, idCIIU, idSubCIIU,
                address, telephone, district, country, city, province, annualSales, assets, liabilities, operatingIncome,
                nonOperatingIncome, expenses, dateSalesAnnuals, idCelula, segment, subSegment },
            handleSubmit, selectsReducer, clientType
        } = this.props;

        isNature = clientType ? clientType.key == constantsPropect.NATURE_PERSON : false;

        return (
            <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
                <Row style={{
                    height: "100%",
                    marginTop: "3px",
                    paddingBottom: "15px",
                    marginBottom: "100px",
                    backgroundColor: "#F0F0F0"
                }}>
                    <Col xs={12} md={12} lg={6} style={{ marginTop: "20px", paddingRight: "35px" }}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Razón social (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <Input
                                name="razonSocial"
                                type="text"
                                max="50"
                                placeholder="Ingrese la razón social del prospecto"
                                {...razonSocial}
                            />
                        </div>
                    </Col>


                    <Col xs={8} md={6} lg={6} style={{ marginTop: "20px", paddingRight: "35px" }}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Célula (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <ComboBox
                                name="Célula"
                                labelInput="Célula"
                                valueProp={'id'}
                                textProp={'description'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get('teamValueObjects')}
                                {...idCelula}
                            />
                        </div>
                    </Col>

                    <Col xs={12} md={6} lg={6} style={{ marginTop: "20px", paddingRight: "35px" }}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Segmento (</span><span style={{ color: "red" }}>*</span>)</dt>
                            <ComboBox
                                name="segment"
                                labelInput="Segmento"
                                valueProp={'id'}
                                textProp={'value'}
                                style={{ marginBottom: '0px !important' }}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(SEGMENTS)}
                                {...segment}
                                onChange={(val) => this._changeSegment(val)}
                                onBlur={segment.onBlur}
                            />
                        </div>
                    </Col>


                    <Col xs={12} md={4} lg={4} style={{ marginTop: "20px", paddingRight: "35px" }}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Subsegmento</span></dt>
                            <ComboBox
                                name="subSegment"
                                labelInput="Sebsegmento"
                                valueProp={'id'}
                                textProp={'value'}
                                parentId="dashboardComponentScroll"
                                data={selectsReducer.get(SUBSEGMENTS)}
                                {...subSegment}
                                showEmptyObject={true}
                            />
                        </div>
                    </Col>


                    <Col xs={12} md={12} lg={12} style={{ marginTop: "20px", paddingRight: "35px" }}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt>
                                <span>Breve descripción de la empresa</span>
                                <i className="help circle icon blue"
                                    style={{ fontSize: "15px", cursor: "pointer", marginLeft: "2px" }}
                                    title={titleDescription} />
                            </dt>
                            <Textarea
                                name="description"
                                type="text"
                                style={{ width: "100%" }}
                                maxLength="250"
                                rows="4"
                                {...descriptionCompany}
                            />
                        </div>
                    </Col>

                    <Col xs={12} md={12} lg={12} style={{ marginTop: "20px", marginLeft: "20px" }}>
                        <dl style={{
                            fontSize: "25px",
                            color: "#CEA70B",
                            margin: "5px 30px 5px 0",
                            borderTop: "1px dotted #cea70b"
                        }}>
                            <div style={{ marginTop: "10px" }}>
                                <i className="payment icon" style={{ fontSize: "25px" }}></i>
                                <span className="title-middle"> Actividad económica</span>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <dt><span>CIIU</span></dt>
                            <ComboBox
                                name="ciiu"
                                labelInput="CIIU"
                                onChange={val => this._onChangeCIIU(val)}
                                value={idCIIU.value}
                                onBlur={idCIIU.onBlur}
                                valueProp={'id'}
                                textProp={'ciiu'}
                                data={selectsReducer.get('dataCIIU')}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Descripción Ciiu</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial", paddingTop: "5px" }}>
                                {idCIIU.value && _.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)])[0].description}
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Sector</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial", paddingTop: "5px" }}>
                                {idCIIU.value && _.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)])[0].economicSector}
                            </span>
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                            <dt><span>SubCIIU</span></dt>
                            <ComboBox
                                name="subCiiu"
                                labelInput="SubCIIU"
                                {...idSubCIIU}
                                valueProp={'id'}
                                textProp={'subCiiu'}
                                data={selectsReducer.get('dataSubCIIU')}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "35px", marginTop: "10px" }}>
                            <dt style={{ paddingBottom: "10px" }}><span>Subsector</span></dt>
                            <span style={{ width: "25%", verticalAlign: "initial" }}>
                                {idSubCIIU.value && _.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)])[0].economicSubSector}
                            </span>
                        </div>
                    </Col>

                    <Col xs={12} md={12} lg={12} style={{ marginTop: "30px", marginLeft: "20px" }}>
                        <dl style={{
                            fontSize: "25px",
                            color: "#CEA70B",
                            margin: "5px 30px 5px 0",
                            borderTop: "1px dotted #cea70b"
                        }}>
                            <div style={{ marginTop: "10px" }}>
                                <i className="browser icon" style={{ fontSize: "25px" }}></i>
                                <span className="title-middle"> Información de ubicación y correspondencia</span>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{ marginLeft: "20px", marginTop: "10px" }}>
                        <h3 className="sub-header" style={{ borderBottom: "solid 1px" }}>Dirección sede principal</h3>
                    </Col>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "43px" }}>
                        <div style={{ paddingLeft: "20px", marginTop: "10px" }}>
                            <dt><span>Dirección</span></dt>
                            <Input
                                name="address"
                                type="text"
                                max="60"
                                placeholder="Ingrese la dirección del prospecto"
                                {...address}
                            />
                        </div>
                    </Col>
                    <Row style={{ width: '100%', marginLeft: '0px', marginRight: '26px' }}>
                        <Col xs>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                                <dt><span>País</span></dt>
                                <ComboBox
                                    name="country"
                                    labelInput="Pais"
                                    onChange={val => this._onChangeCountry(val)}
                                    value={country.value}
                                    onBlur={country.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeCountry')}
                                />
                            </div>
                        </Col>
                        <Col xs>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                                <dt><span>Departamento/Provincia</span></dt>
                                <ComboBox
                                    name="province"
                                    labelInput="Departamento/Provincia"
                                    onChange={val => this._onChangeProvince(val)}
                                    value={province.value}
                                    onBlur={province.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeProvince')}
                                />
                            </div>
                        </Col>
                        <Col xs>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px", marginTop: "10px" }}>
                                <dt><span>Ciudad</span></dt>
                                <ComboBox
                                    name="city"
                                    labelInput="Ciudad"
                                    {...city}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeCity')}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ width: '100%', marginLeft: '0px', marginRight: '26px' }}>
                        <Col xs={12} md={8} lg={8}>
                            <div style={{ paddingLeft: "20px", paddingRight: "11px", paddingTop: "10px" }}>
                                <dt><span>Barrio</span></dt>
                                <Input
                                    name="district"
                                    type="text"
                                    max="40"
                                    placeholder="Ingrese el barrio del prospecto"
                                    {...district}
                                />
                            </div>
                        </Col>
                        <Col xs>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px", paddingTop: "10px" }}>
                                <dt><span>Teléfono</span></dt>
                                <Input
                                    name="telephone"
                                    type="text"
                                    max="30"
                                    placeholder="Ingrese el teléfono del prospecto"
                                    {...telephone}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ width: '100%', marginLeft: '11px', marginRight: '26px' }}>
                        <Col xs>
                            <div style={{ paddingLeft: "10px", paddingRight: "10px", paddingTop: "15px" }}>
                                <dt><span>¿Desea consultar sus extractos de forma virtual?</span></dt>
                                <ComboBox
                                    name="extractVirtual"
                                    labelInput="Seleccione una opción"
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={valuesYesNo}
                                    {...extractsVirtual}
                                />
                            </div>
                        </Col>
                        <Col xs>
                            <div style={{ paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px" }}>
                                <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span></dt>
                                <ComboBox
                                    name="reportVirtual"
                                    labelInput="Seleccione una opción"
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={valuesYesNo}
                                    {...reportVirtual}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Col xs={12} md={12} lg={12} style={{ marginTop: "30px", marginLeft: "20px" }}>
                        <dl style={{
                            fontSize: "25px",
                            color: "#CEA70B",
                            margin: "5px 30px 5px 0",
                            borderTop: "1px dotted #cea70b"
                        }}>
                            <div style={{ marginTop: "10px" }}>
                                <i className="suitcase icon" style={{ fontSize: "25px" }}></i>
                                <span className="title-middle"> Información financiera</span>
                            </div>
                        </dl>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Ventas anuales</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese las ventas anuales"
                                type="text"
                                min={0}
                                {...annualSales}
                                onBlur={val => this._handleBlurValueNumber(1, annualSales, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Activos</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese los activos"
                                type="text"
                                min={0}
                                {...assets}
                                onBlur={val => this._handleBlurValueNumber(1, assets, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px" }}>
                            <dt><span>Pasivos</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese los pasivos"
                                type="text"
                                min={0}
                                {...liabilities}
                                onBlur={val => this._handleBlurValueNumber(1, liabilities, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "35px" }}>
                            <dt><span>Ingresos operacionales</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese los ingresos operacionales"
                                type="text"
                                {...operatingIncome}
                                onBlur={val => this._handleBlurValueNumber(1, operatingIncome, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px" }}>
                            <dt><span>Ingresos no operacionales</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese los ingresos no operacionales"
                                type="text"
                                {...nonOperatingIncome}
                                onBlur={val => this._handleBlurValueNumber(1, nonOperatingIncome, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px" }}>
                            <dt><span>Egresos</span></dt>
                            <Input
                                style={{ width: "100%", textAlign: "right" }}
                                placeholder="Ingrese los egresos"
                                name="expenses"
                                type="text"
                                {...expenses}
                                onBlur={val => this._handleBlurValueNumber(1, expenses, val)}
                                touched={true}
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={3} lg={3}>
                        <div style={{ paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px" }}>
                            <dt><span>Fecha de ventas anuales - DD/MM/YYYY</span></dt>
                            <DateTimePickerUi
                                {...dateSalesAnnuals}
                                format={"DD/MM/YYYY"}
                                time={false}
                                placeholder="Seleccione una fecha"
                                culture='es'
                            />
                        </div>
                    </Col>
                </Row>
                <div style={{
                    position: "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: "100%",
                    backgroundColor: "#F8F8F8",
                    height: "50px",
                    background: "rgba(255,255,255,0.75)"
                }}>
                    <div style={{ width: "300px", height: "100%", position: "fixed", right: "0px" }}>
                        <button className="btn" style={{ float: "right", margin: "8px 0px 0px 8px", position: "fixed" }}
                            type="submit">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Crear prospecto</span>
                        </button>
                        <button className="btn btn-secondary modal-button-edit"
                            onClick={this._closeWindow}
                            style={{
                                float: "right",
                                margin: "8px 0px 0px 180px",
                                position: "fixed",
                                backgroundColor: "#C1C1C1"
                            }}
                            type="button">
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </div>
                </div>
                <SweetAlert
                    type="warning"
                    show={this.state.show}
                    title={titleConfirm}
                    text={messageConfirm}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ show: false })}
                    onConfirm={() => this._onConfirmCreate()} />
                <SweetAlert
                    type="success"
                    show={this.state.showEx}
                    title="Creación de prospecto"
                    text="Señor usuario, el prospecto se creó de forma exitosa."
                    onConfirm={() => this._closeSuccess()}
                />
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error creando prospecto"
                    text="Señor usuario, ocurrió un error creando el prospecto."
                    onConfirm={() => this._closeError()}
                />
            </form>
        );
    }
}

FormCreateProspect.PropTypes = {
    idTupeDocument: PropTypes.string.isRequired,
    numberDocument: PropTypes.string.isRequired
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createProspect,
        consultDataSelect,
        consultList,
        consultListWithParameter,
        consultListWithParameterUbication,
        changeStateSaveData,
        getMasterDataFields,
        consultListByCatalogType
    }, dispatch);
}

function mapStateToProps({ propspectReducer, selectsReducer, reducerGlobal, notes, navBar }, ownerProps) {
    return {
        propspectReducer,
        selectsReducer,
        reducerGlobal,
        notes,
        navBar
    };
}

export default reduxForm({
    form: 'submitValidation',
    fields,
    validate,
    onSubmitFail: () => {
        thisForm.setState({ showEr: true });
    }
}, mapStateToProps, mapDispatchToProps)(FormCreateProspect);