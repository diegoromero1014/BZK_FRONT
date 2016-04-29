import React, {Component} from 'react';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import {consultDataSelect, consultList, consultListWithParameter, consultListWithParameterUbication, getMasterDataFields} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import NumberInput from '../../ui/numberInput/numberInputComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {reduxForm} from 'redux-form';
import {DateTimePicker} from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import NotesClient from '../notes/notesClient';
import {setNotes, crearNotes} from '../notes/actions';
import {createProspect} from '../propspect/actions';
import _ from 'lodash';

const valuesYesNo = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
];

const fields = ["description", "idCIIU", "idSubCIIU", "address", "country", "city", "province",
    "district", "telephone", "reportVirtual", "extractsVirtual", "annualSales", "dateSalesAnnuals",
    "liabilities", "assets", "operatingIncome", "nonOperatingIncome", "expenses", "marcGeren",
    "centroDecision", "necesitaLME", "groupEconomic", "justifyNoGeren", "justifyNoLME", "justifyExClient"];

var isProspect = false;

const validate = values => {
    const errors = {}

    if (!values.idCIIU) {
      errors.idCIIU = "Debe seleccionar una opción";
    } else {
      errors.idCIIU = null;
    }
    if (!values.idSubCIIU) {
      errors.idSubCIIU = "Debe seleccionar una opción";
    } else {
      errors.idSubCIIU = null;
    }
    /*if (!values.address) {
      errors.address = "Debe ingresar un valor";
    } else {
      errors.address = null;
    }*/
    if (!values.telephone) {
      errors.telephone = "Debe ingresar un valor";
    } else {
      errors.telephone = null;
    }
    if (!values.annualSales) {
      errors.annualSales = "Debe ingresar un valor";
    } else {
      errors.annualSales = null;
    }
    if (!values.country) {
      errors.country = "Debe seleccionar un valor";
    } else {
      errors.country = null;
    }
    if (!values.province) {
      errors.province = "Debe seleccionar un valor";
    } else {
      errors.province = null;
    }
    if (!values.city) {
      errors.city = "Debe ingresar un valor";
    } else {
      errors.city = null;
    }
    /*if (!values.dateSalesAnnuals) {
      errors.dateSalesAnnuals = "Debe seleccionar un día";
    } else {
      errors.dateSalesAnnuals = null;
    }*/
    if (!values.liabilities) {
      errors.liabilities = "Debe ingresar un valor";
    } else {
      errors.liabilities = null;
    }
    if (!values.assets) {
      errors.assets = "Debe ingresar un valor";
    } else {
      errors.assets = null;
    }
    if (!values.operatingIncome) {
      errors.operatingIncome = "Debe ingresar un valor";
    } else {
      errors.operatingIncome = null;
    }
    if (!values.nonOperatingIncome) {
      errors.nonOperatingIncome = "Debe ingresar un valor";
    } else {
      errors.nonOperatingIncome = null;
    }
    if (!values.expenses) {
      errors.expenses = "Debe ingresar un valor";
    } else {
      errors.expenses = null;
    }
    if (!values.marcGeren && !isProspect) {
      errors.marcGeren = "Debe seleccionar un valor";
    } else {
      errors.marcGeren = null;
    }
    if (values.marcGeren && !values.justifyNoGeren) {
      errors.justifyNoGeren = "Debe seleccionar un valor";
    } else {
      errors.justifyNoGeren = null;
    }
    if (!values.centroDecision && !isProspect) {
      errors.centroDecision = "Debe seleccionar un valor";
    } else {
      errors.centroDecision = null;
    }
    if (values.centroDecision && !values.justifyExClient) {
      errors.justifyExClient = "Debe seleccionar un valor";
    } else {
      errors.justifyExClient = null;
    }
    if (!values.necesitaLME && !isProspect) {
      errors.necesitaLME = "Debe seleccionar un valor";
    } else {
      errors.necesitaLME = null;
    }
    if (values.necesitaLME && !values.justifyNoLME) {
      errors.justifyNoLME = "Debe seleccionar un valor";
    } else {
      errors.justifyNoLME = null;
    }
    if (!values.reportVirtual) {
      errors.reportVirtual = "Debe seleccionar un valor";
    } else {
      errors.reportVirtual = null;
    }
    if (!values.extractsVirtual) {
      errors.extractsVirtual = "Debe seleccionar un valor";
    } else {
      errors.extractsVirtual = null;
    }
    return errors
};

function SelectsJustificacion(props) {
  if(props.visible === "false"){
    return <Col xs={12} md={4} lg={4}>
      <dt>
        <span>{props.title} (</span><span style={{color: "red"}}>*</span>)
      </dt>
      <dt>
        <ComboBox
          labelInput={props.labelInput}
          value={props.value}
          onBlur={props.onBlur}
          valueProp={props.valueProp}
          textProp={props.textProp}
          {...props.justify}
          data={props.data}
          defaultValue={props.defaultValue}
        />
      </dt>
    </Col>;
  }else{
    return <div></div>;
  }
}

class clientEdit extends Component{
  constructor(props) {
    super(props);
    momentLocalizer(moment);
    this.state = {
      show: false
    }
    this._submitEditClient = this._submitEditClient.bind(this);
    this._onChangeCIIU = this._onChangeCIIU.bind(this);
    this._onChangeCountry = this._onChangeCountry.bind(this);
    this._onChangeProvince = this._onChangeProvince.bind(this);
    this._closeWindow = this._closeWindow.bind(this);
    this._onConfirmExit = this._onConfirmExit.bind(this);
  }

  _closeWindow(){
    this.setState({show: true});
  }

  _onConfirmExit(){
    this.setState({show: false });
    redirectUrl("/dashboard/clientInformation");
  }

  componentWillMount(){
    const {clientInformacion, setNotes, crearNotes} = this.props;
    crearNotes();
    var infoClient = clientInformacion.get('responseClientInfo');
    if( infoClient !== null && infoClient.notes !== null && infoClient.notes.length > 0 ){
      const {setNotes} = this.props;
      setNotes(infoClient.notes);
    }
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      }else{
        const {selectsReducer, consultList, consultDataSelect, clientInformacion, consultListWithParameterUbication, getMasterDataFields} = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        getMasterDataFields([constants.FILTER_COUNTRY, constants.JUSTIFICATION_CREDIT_NEED, constants.JUSTIFICATION_LOST_CLIENT, constants.JUSTIFICATION_NO_RM, constants.TYPE_NOTES])
        .then((data) => {
          if(infoClient.addresses !== null && infoClient.addresses !== '' && infoClient.addresses !== null){
            consultListWithParameterUbication(constants.FILTER_PROVINCE, infoClient.addresses[0].country);
            consultListWithParameterUbication(constants.FILTER_CITY, infoClient.addresses[0].province);
          }
          }, (reason) => {
            this.setState({showEx: true});
        });
        consultList(constants.CIIU);
        //consultList(constants.ECONOMIC_GROUP);
      }
    }
  }

  _onChangeCIIU(val){
    const {fields: {idCIIU, idSubCIIU}} = this.props;
    idCIIU.onChange(val);
    const {consultListWithParameter} = this.props;
    consultListWithParameter(constants.SUB_CIIU, val);
    idSubCIIU.onChange('');
  }

  _onChangeCountry(val){
    const {fields: {country, province, city}} = this.props;
    country.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
    province.onChange('');
    city.onChange('');
  }

  _onChangeProvince(val){
    const {fields: {country, province, city}} = this.props;
    province.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_CITY, province.value);
    city.onChange('');
  }

  _submitEditClient(){
    const {
    fields: {description, idCIIU, idSubCIIU, address, country, city, province,
      district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals,
      liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren,
      centroDecision, necesitaLME, groupEconomic, justifyNoGeren, justifyNoLME, justifyExClient},
      error, handleSubmit, selectsReducer, clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    var jsonCreateProspect= {
      "id": infoClient.id,
      "clientIdNumber": infoClient.clientIdNumber,
      "clientName": infoClient.clientName,
      "clientStatus": infoClient.clientStatus,
      "riskRating": null,
      "isProspect": infoClient.isProspect,
      "ciiu": idCIIU.value,
      "commercialRelationshipType": "",
      "countryOfOrigin": "",
      "isDecisionCenter": centroDecision.value,
      "economicGroup": groupEconomic.value,
      "internalRating": "",
      "isic": "",
      "ratingHistory": "",
      "registrationKey": null,
      "riskGroup": "",
      "segment": infoClient.segment,
      "subCiiu": idSubCIIU.value,
      "subSegment": "",
      "countryOfFirstLevelManagement": "",
      "countryOfMainMarket": "",
      "relationshipStatus": infoClient.relationshipStatus,
      "typeOfClient":"",
      "status":infoClient.status,
      "isCreditNeeded":necesitaLME.value,
      "annualSales": annualSales.value === undefined ? infoClient.annualSales : numeral(annualSales.value).format('0'),
      "salesUpadateDate": null,
      "assets": assets.value === undefined ? infoClient.assets : numeral(assets.value).format('0'),
      "liabilities": liabilities.value === undefined ? infoClient.liabilities : numeral(liabilities.value).format('0'),
      "operatingIncome": operatingIncome.value === undefined ? infoClient.operatingIncome : numeral(operatingIncome.value).format('0'),
      "nonOperatingIncome": nonOperatingIncome.value === undefined ? infoClient.nonOperatingIncome : numeral(nonOperatingIncome.value).format('0'),
      "expenses": expenses.value === undefined ? infoClient.expenses : numeral(expenses.value).format('0'),
      "localMarket":"",
      "marketLeader":"",
      "territory":"",
      "actualizationDate": null,
      "justificationForNoRM": justifyNoGeren.value,
      "justificationForLostClient": justifyExClient.value,
      "justificationForCreditNeed": justifyNoLME.value,
      "isVirtualStatement": extractsVirtual.value,
      "lineOfBusiness": infoClient.lineOfBusiness,
      "isManagedByRm": marcGeren.value,
      "addresses":[
        {
          "typeOfAddress": 41,
          "address":address.value,
          "country":country.value,
          "province":province.value,
          "city":city.value,
          "neighborhood":district.value,
          "isPrincipalAddress": reportVirtual.value,
          "phoneNumber":telephone.value,
          "postalCode":"",
        }],
      "notes":infoClient.notes,
      "description": description.value,
      "clientIdType": infoClient.clientIdType
   }
   const {createProspect} = this.props;
   createProspect(jsonCreateProspect)
   .then((data) => {
     if((_.get(data, 'payload.data.responseCreateProspect') === "create")){
         this.setState({showEx: true});
       } else {
         this.setState({showEr: true});
     }
     }, (reason) => {
       this.setState({showEr: true});
   });
  };

  render(){
    const {
    fields: {description, idCIIU, idSubCIIU, address, country, city, province,
      district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals,
      liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren,
      centroDecision, necesitaLME, groupEconomic, justifyNoGeren, justifyNoLME, justifyExClient},
      error, handleSubmit, selectsReducer, clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    isProspect = infoClient.isProspect;
    console.log("isProspect render", isProspect);
    console.log(infoClient);
    return(
        <form onSubmit={handleSubmit(this._submitEditClient)}>
          <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          <Row style={{padding: "10px 10px 10px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Razón social</span></dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {infoClient.clientName}
                </p>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Tipo de documento</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {infoClient.clientNameType}
                </p>
              </dt>
            </Col>
            <Col xs={10} md={4} lg={4}>
              <dt>
                <span>Número de documento</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {infoClient.clientIdNumber}
                </p>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <dt>
                <span>Breve descripción de la empresa</span>
              </dt>
              <dt>
                <Textarea
                  name="descripcion"
                  type="text"
                  style={{width: '100%', height: '100%'}}
                  onChange={val => this._onchangeValue("descripcion", val)}
                  placeholder="Ingrese la descripción"
                  defaultValue={description.value === undefined ? infoClient.description : description.value}
                  {...description}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                <i className="payment icon" style={{fontSize: "25px"}}/>
                <span className="title-middle"> Actividad económica</span>
              </div>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 0px"}}>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", marginTop: "10px"}}>
              <dt><span>CIIU (</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name="ciiu"
                labelInput="Seleccione CIIU..."
                {...idCIIU}
                onChange={val => this._onChangeCIIU(val)}
                value={idCIIU.value}
                onBlur={idCIIU.onBlur}
                valueProp={'id'}
                textProp={'ciiu'}
                data={selectsReducer.get('dataCIIU')}
                defaultValue={infoClient.ciiu}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>
                {idCIIU.value && _.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)] )[0].economicSector}
              </span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>SubCIIU (</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name="subCiiu"
                labelInput="Seleccione subCIIU..."
                {...idSubCIIU}
                value={idSubCIIU.value}
                valueProp={'id'}
                textProp={'subCiiu'}
                data={selectsReducer.get('dataSubCIIU')}
                defaultValue={idSubCIIU.value === undefined ? infoClient.subCiiu : idSubCIIU.value}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", marginTop: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>
                {idSubCIIU.value && _.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)] )[0].economicSubSector}
              </span>
            </div>
          </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                <i className="browser icon" style={{fontSize: "25px"}}/>
                <span className="title-middle"> Información de ubicación y correspondencia</span>
              </div>
            </Col>
          </Row>
          <Row style={{padding: "0px 5px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
                        <span className="section-title">Dirección sede principal</span>
                      </dl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%"}}></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={12} lg={12} style={{paddingRight: "20px"}}>
              <dt>
                <span>Dirección (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Textarea
                  name="direccion"
                  type="text"
                  style={{width: '100%', height: '100%'}}
                  {...address}
                  onChange={val => this._onchangeValue("address", val)}
                  placeholder="Ingrese la dirección"
                  defaultValue={address.value === undefined ? infoClient.addresses[0].address : address.value}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 0px"}}>
            <Col xs={12} md={4} lg={4} >
              <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
                <dt><span>País (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="country"
                  labelInput="Seleccione país..."
                  {...country}
                  onChange={val => this._onChangeCountry(val)}
                  value={country.value}
                  onBlur={country.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get(constants.FILTER_COUNTRY) || []}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].country}
                  />
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
                <dt><span>Departamento (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="province"
                  labelInput="Seleccione departamento..."
                  {...province}
                  onChange={val => this._onChangeProvince(val)}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeProvince') || []}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].province}
                />
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div style={{paddingLeft: "20px", paddingRight: "15px", marginTop: "10px"}}>
                <dt><span>Ciudad (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="city"
                  labelInput="Seleccione ciudad..."
                  {...city}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeCity') || []}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].city}
                />
              </div>
            </Col>
          </Row>
          <Row style={{padding: "10px 30px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Barrio</span></dt>
              <dt style={{marginRight:"17px"}}>
                <Input
                  name="txtBarrio"
                  type="text"
                  placeholder="Ingrese el barrio"
                  defaultValue={infoClient.neighborhood}
                />
              </dt>
            </Col>
            <Col xs={10} md={4} lg={4} style={{marginLeft:"10px"}}>
              <dt>
                <span>Teléfono (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt style={{marginRight:"15px"}}>
                <Input
                  name="txtTelefono"
                  type="number"
                  placeholder="Ingrese el teléfono"
                  defaultValue={infoClient.phoneNumber}
                  {...telephone}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "10px 40px 20px 20px"}}>
            <Col xs={12} md={8} lg={8}>
              <dt>
                <span>¿Desea recibir su reporte de costos consolidado de forma virtual? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <ComboBox
                  name="reportVirtual"
                  labelInput="Seleccione..."
                  {...reportVirtual}
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  defaultValue={reportVirtual.value === undefined ? infoClient.addresses[0].isPrincipalAddress : reportVirtual.value}
                />
              </dt>
            </Col>
            <Col xs={12} md={8} lg={8} style={{paddingTop:"20px", marginTop:"5px"}}>
              <dt>
                <span>¿Desea consultar sus extractos de forma virtual? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <ComboBox
                  name="extractsVirtual"
                  labelInput="Seleccione..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...extractsVirtual}
                  defaultValue={infoClient.isVirtualStatement === undefined ? '' : infoClient.isVirtualStatement}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                <i className="suitcase icon" style={{fontSize: "25px"}}/>
                <span className="title-middle"> Información financiera</span>
              </div>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Ventas anuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("annualSales", val)}
                  placeholder="Ingrese las ventas anuales"
                  value={parseInt(infoClient.annualSales)}
                  style={{width: "100%", textAlign:"right"}}
                  {...annualSales}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Fecha de ventas anuales - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <DateTimePicker
                  {...dateSalesAnnuals}
                  defaultValue={new Date(infoClient.salesUpadateDate)}
                  time={false}
                  placeholder="Seleccione una fecha"
                  culture='es'
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Activos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("assets", val)}
                  placeholder="Ingrese los activos"
                  value={parseInt(infoClient.assets)}
                  {...assets}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Pasivos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("liabilities", val)}
                  value={parseInt(infoClient.liabilities)}
                  placeholder="Ingrese los pasivos"
                  {...liabilities}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Ingresos operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("operatingIncome", val)}
                  value={parseInt(infoClient.operatingIncome)}
                  placeholder="Ingrese los ingresos operacionales"
                  {...operatingIncome}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Ingresos no operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                  value={parseInt(infoClient.nonOperatingIncome)}
                  placeholder="Ingrese los ingresos no operacionales"
                  {...nonOperatingIncome}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Egresos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("expenses", val)}
                  value={parseInt(infoClient.expenses)}
                  placeholder="Ingrese los egresos"
                  {...expenses}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                <i className="book icon" style={{fontSize: "25px"}}/>
                <span className="title-middle"> Datos de conocimiento comercial</span>
              </div>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "10px"}}>
              <dt>
                <span>Marca gerenciamiento </span> {!infoClient.isProspect && <div style={{display:"inline"}}>(<span style={{color: "red"}}>*</span>)</div> }
              </dt>
              <dt>
                <ComboBox
                  name="marcGeren"
                  labelInput="Seleccione marca..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...marcGeren}
                  defaultValue={infoClient.isManagedByRm === undefined ? '' : infoClient.isManagedByRm}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Centro de decisión </span> {!infoClient.isProspect && <div style={{display:"inline"}}>(<span style={{color: "red"}}>*</span>)</div> }
              </dt>
              <dt>
                <ComboBox
                  name="centroDecision"
                  labelInput="Seleccione..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...centroDecision}
                  defaultValue={centroDecision.value === undefined ? infoClient.isDecisionCenter : centroDecision.value}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "25px"}}>
              <dt>
                <span>¿Necesita LME? </span> {!infoClient.isProspect && <div style={{display:"inline"}}>(<span style={{color: "red"}}>*</span>)</div> }
              </dt>
              <dt>
                <ComboBox
                  labelInput="Seleccione..."
                  {...necesitaLME}
                  value={necesitaLME.value}
                  onBlur={necesitaLME.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  defaultValue={infoClient.isCreditNeeded}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px", display:"none"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Grupo económico/relación</span>
              </dt>
              <dt>
                <ComboBox
                  labelInput="Seleccione..."
                  {...groupEconomic}
                  value={groupEconomic.value}
                  onBlur={groupEconomic.onBlur}
                  valueProp={'id'}
                  textProp={'group'}
                  data={selectsReducer.get('dataEconomicGroup')}
                  defaultValue={infoClient.economicGroup}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Nit principal</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {groupEconomic.value && _.filter(selectsReducer.get('dataEconomicGroup'), ['id', parseInt(groupEconomic.value)] )[0].nitPrincipal}
                </p>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <SelectsJustificacion
              visible={marcGeren.value}
              title="Justificación no gerenciamiento"
              labelInput="Seleccione..."
              value={justifyNoGeren.value}
              onBlur={justifyNoGeren.onBlur}
              valueProp={"id"}
              textProp={"value"}
              justify={justifyNoGeren}
              data={selectsReducer.get(constants.JUSTIFICATION_NO_RM) || []}
              defaultValue={justifyNoGeren.value === undefined ? '' : infoClient.justificationForNoRM}
            />
            <SelectsJustificacion
              visible={centroDecision.value}
              title="Justificación excliente"
              labelInput="Seleccione..."
              value={justifyExClient.value}
              onBlur={justifyExClient.onBlur}
              valueProp={"id"}
              textProp={"value"}
              justify={justifyExClient}
              data={selectsReducer.get(constants.JUSTIFICATION_LOST_CLIENT) || []}
              defaultValue={justifyExClient.value === undefined ? '' : infoClient.justificationForLostClient}
            />
            <SelectsJustificacion
              visible={necesitaLME.value}
              title="Justificación no necesita LME"
              labelInput="Seleccione..."
              value={justifyNoLME.value}
              onBlur={justifyNoLME.onBlur}
              valueProp={"id"}
              textProp={"value"}
              justify={justifyNoLME}
              data={selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED) || []}
              defaultValue={justifyNoLME.value === undefined ? '' : infoClient.justificationForCreditNeed}
            />
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                <i className="file outline icon" style={{fontSize: "25px"}}/>
                <span className="title-middle"> Notas</span>
              </div>
            </Col>
          </Row>
          <NotesClient />
          <Row>
            <Col xs={12} md={12} lg={12} style={{paddingTop: "50px"}}>
              <div style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0", width:"100%", marginBottom: "0", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
                <button className="btn"
                    style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}}
                    type="submit">
                  <span style={{color: "#FFFFFF", padding:"10px"}}>Actualizar</span>
                </button>
                <button className="btn btn-secondary modal-button-edit"
                  onClick={this._closeWindow}
                  style={{float:"right", margin:"8px 0px 0px 150px", position:"fixed", backgroundColor: "#C1C1C1"}}
                  type="button">
                  <span style={{color: "#FFFFFF", padding:"10px"}}>Cancelar</span>
                </button>
              </div>
            </Col>
          </Row>
          <SweetAlert
            type= "warning"
            show={this.state.show}
            title="Confirmación salida"
            confirmButtonColor= '#DD6B55'
            confirmButtonText= 'Sí, estoy seguro!'
            cancelButtonText = "Cancelar"
            text="¿Está seguro que desea salir de la vista de edición de un cliente?"
            showCancelButton= {true}
            onCancel= {() => this.setState({show: false })}
            onConfirm={() => this._onConfirmExit()}/>
        </form>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultDataSelect,
    consultList,
    consultListWithParameter,
    consultListWithParameterUbication,
    getMasterDataFields,
    setNotes,
    crearNotes,
    createProspect
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, notes},ownerProps) {
  return {
    clientInformacion,
    selectsReducer,
    notes
  };
}
export default reduxForm({
  form: 'submitValidation',
  fields,
  validate,
  //initialValues: {province: 10262}
}, mapStateToProps, mapDispatchToProps)(clientEdit);
