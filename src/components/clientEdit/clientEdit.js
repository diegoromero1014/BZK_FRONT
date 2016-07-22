import React, {Component} from 'react';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import {consultDataSelect, consultList, consultListWithParameter, economicGroupsByKeyword, consultListWithParameterUbication, getMasterDataFields, clearValuesAdressess} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {reduxForm} from 'redux-form';
import DateTimePickerUi from '../../ui/dateTimePicker/dateTimePickerComponent';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import NotesClient from '../notes/notesClient';
import {setNotes, crearNotes} from '../notes/actions';
import {createProspect} from '../propspect/actions';
import numeral from 'numeral';
import _ from 'lodash';

//Data para los select de respuesta "Si" - "No"
const valuesYesNo = [
  {'id': '', 'value': "Seleccione..."},
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
];

const fields = ["description", "idCIIU", "idSubCIIU", "address", "country", "city", "province", "neighborhood",
    "district", "telephone", "reportVirtual", "extractsVirtual", "annualSales", "dateSalesAnnuals",
    "liabilities", "assets", "operatingIncome", "nonOperatingIncome", "expenses", "marcGeren",
    "centroDecision", "necesitaLME", "groupEconomic", "keywordFindEconomicGroup", "justifyNoGeren", "justifyNoLME", "justifyExClient"];

//Establece si el cliente a editar es prospecto o no, para controlar las validaciones de campos
var isProspect = false;
//Controla la validación en las notas
var errorNote = false;

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
    if (!values.address) {
      errors.address = "Debe ingresar un valor";
    } else {
      errors.address = null;
    }
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
    if (!values.dateSalesAnnuals || values.dateSalesAnnuals === '') {
      errors.dateSalesAnnuals = "Debe seleccionar un día";
    } else {
      errors.dateSalesAnnuals = null;
    }
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
    if (values.marcGeren === 'false' && !values.justifyNoGeren) {
      errors.justifyNoGeren = "Debe seleccionar un valor";
    } else {
      errors.justifyNoGeren = null;
    }
    if (!values.centroDecision && !isProspect) {
      errors.centroDecision = "Debe seleccionar un valor";
    } else {
      errors.centroDecision = null;
    }
    if (!values.necesitaLME && !isProspect) {
      errors.necesitaLME = "Debe seleccionar un valor";
    } else {
      errors.necesitaLME = null;
    }
    if (values.necesitaLME === 'false' && !values.justifyNoLME) {
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
    return errors;
};

//Componente genérico para cargar los selects de justificación
function SelectsJustificacion(props) {
  var obligatory;
  if (props.obligatory) {
    obligatory = <span>{props.title} (<span style={{color: "red"}}>*</span>)</span>;
  } else {
    obligatory = <span>{props.title}</span>;
  }
  if(props.visible === "false"){
    return <Col xs={12} md={4} lg={4}>
      <dt>
        {obligatory}
      </dt>
      <dt>
        <ComboBox
          labelInput={props.labelInput}
          onBlur={props.onBlur}
          valueProp={props.valueProp}
          textProp={props.textProp}
          {...props.justify}
          data={props.data}
          parentId="dashboardComponentScroll"
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
      show: false,
      showEx:false,
      showEr:false
    };
    this._submitEditClient = this._submitEditClient.bind(this);
    this._onChangeCIIU = this._onChangeCIIU.bind(this);
    this._onChangeCountry = this._onChangeCountry.bind(this);
    this._onChangeProvince = this._onChangeProvince.bind(this);
    this._closeWindow = this._closeWindow.bind(this);
    this._onConfirmExit = this._onConfirmExit.bind(this);
    this._closeError = this._closeError.bind(this);
    this._closeSuccess = this._closeSuccess.bind(this);
    this._handleGroupEconomicFind = this._handleGroupEconomicFind.bind(this);
    this._onChangeGroupEconomic = this._onChangeGroupEconomic.bind(this);
  }

  _closeWindow(){
    this.setState({show: true});
  }

  _onConfirmExit(){
    this.setState({show: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _closeError(){
    this.setState({show: false, showEx:false, showEr: false});
  }

  _closeSuccess(){
    this.setState({show: false, showEx:false, showEr: false});
    redirectUrl("/dashboard/clientInformation");
  }

  _onChangeGroupEconomic(e){
    const {fields: {keywordFindEconomicGroup, groupEconomic}, economicGroupsByKeyword} = this.props;
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      economicGroupsByKeyword(keywordFindEconomicGroup.value);
      groupEconomic.onChange('')
    } else {
      keywordFindEconomicGroup.onChange(e.target.value);
    }
  }

  _handleGroupEconomicFind(){
    const {fields: {keywordFindEconomicGroup, groupEconomic}, economicGroupsByKeyword} = this.props;
    economicGroupsByKeyword(keywordFindEconomicGroup.value);
    groupEconomic.onChange('')
  }

  _handleBlurValueNumber(typeValidation ,valuReduxForm, val){
    var pattern;
    //Elimino los caracteres no validos
    for (var i=0, output='', validos="-0123456789"; i< (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) !== -1){
        output += val.toString().charAt(i)
      }
    }
    val = output;

    /* Si typeValidation = 2 es por que el valor puede ser negativo
       Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
    */
    if( typeValidation === 2 ){ //Realizo simplemente el formateo
      pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(val)){
        val = val.replace(pattern, "$1,$2");
      }
      valuReduxForm.onChange(val);
    } else { //Valido si el valor es negativo o positivo
      var value = numeral(valuReduxForm.value).format('0');
      if( value >= 0 ){
        pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)){
          val = val.replace(pattern, "$1,$2");
        }
        valuReduxForm.onChange(val);
      } else {
        valuReduxForm.onChange("");
      }
    }
  }

  componentWillMount(){
    errorNote = false;
    const {clientInformacion, clearValuesAdressess, setNotes, crearNotes} = this.props;
    clearValuesAdressess();
    crearNotes();
    var infoClient = clientInformacion.get('responseClientInfo');
    if(infoClient !== null && infoClient.notes !== null && infoClient.notes !== undefined && infoClient.notes !== ''){
      const {setNotes} = this.props;
      setNotes(infoClient.notes);
    }

    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      }else{
        const {economicGroupsByKeyword, selectsReducer, consultList, consultDataSelect, clientInformacion, consultListWithParameterUbication, getMasterDataFields} = this.props;
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

        if(infoClient.economicGroupKey !== null && infoClient.economicGroupKey !== '' && infoClient.economicGroupKey !== undefined && infoClient.economicGroupKey !== "null"){
          economicGroupsByKeyword(infoClient.economicGroupKey);
        }
      }
    }
  }

  //Detecta el cambio en el select de ciiu para ejecutar la consulta de subciiu
  _onChangeCIIU(val){
    const {fields: {idCIIU, idSubCIIU}} = this.props;
    idCIIU.onChange(val);
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    const {consultListWithParameter} = this.props;
    consultListWithParameter(constants.SUB_CIIU, val);
    if(!_.isEqual(infoClient.ciiu, idCIIU.value)){
      idSubCIIU.onChange('');
    }
  }

  //Detecta el cambio en el select de country para ejecutar la consulta de province
  _onChangeCountry(val){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    const {fields: {country, province, city}} = this.props;
    country.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
    if(!_.isEqual(infoClient.addresses[0].country, country.value)){
      province.onChange('');
      city.onChange('');
    }
  }

    //Detecta el cambio en el select de province para ejecutar la consulta de city
  _onChangeProvince(val){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    const {fields: {country, province, city}} = this.props;
    province.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_CITY, province.value);
    if(!_.isEqual(infoClient.addresses[0].province, province.value)){
      city.onChange('');
    }
  }

  //Edita el cliente después de haber validado los campos, solo acá se validan las notas
  _submitEditClient(){
    errorNote = false;
    const {notes} = this.props;
    var notesArray = [];
    notes.map(map => {
      var noteItem = {
        "typeOfNote": map.combo,
        "note": map.body
      }
      notesArray.push(noteItem);
    });

    notesArray.forEach(function(note){
      if(_.isEqual(note.note, "") || _.isEqual(note.typeOfNote, "") || _.isEqual(note.note, null) || _.isEqual(note.typeOfNote, null)){
        errorNote = true;
      }
    });
    if(!errorNote){
      const {
      fields: {description, idCIIU, idSubCIIU, address, country, city, province, neighborhood,
        district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals,
        liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren,
        centroDecision, necesitaLME, groupEconomic, keywordFindEconomicGroup, justifyNoGeren, justifyNoLME, justifyExClient},
        error, handleSubmit, selectsReducer, clientInformacion} = this.props;
      var infoClient = clientInformacion.get('responseClientInfo');
      if(moment(dateSalesAnnuals.value, "DD/MM/YYYY").isValid() && dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined){
        var jsonCreateProspect= {
          "id": infoClient.id,
          "clientIdNumber": infoClient.clientIdNumber,
          "clientName": infoClient.clientName,
          "clientStatus": infoClient.clientStatus,
          "riskRating": infoClient.riskRating,
          "isProspect": infoClient.isProspect,
          "ciiu": idCIIU.value,
          "commercialRelationshipType": infoClient.commercialRelationshipType,
          "countryOfOrigin": infoClient.countryOfOrigin,
          "isDecisionCenter": centroDecision.value,
          "economicGroup": groupEconomic.value,
          "internalRating": infoClient.internalRating,
          "isic": infoClient.isic,
          "ratingHistory": infoClient.ratingHistory,
          "registrationKey": infoClient.registrationKey,
          "riskGroup": infoClient.riskGroup,
          "segment": infoClient.segment,
          "subCiiu": idSubCIIU.value,
          "subSegment": infoClient.subSegment,
          "countryOfFirstLevelManagement": infoClient.countryOfFirstLevelManagement,
          "countryOfMainMarket": infoClient.countryOfMainMarket,
          "relationshipStatus": infoClient.relationshipStatus,
          "typeOfClient":infoClient.typeOfClient,
          "status":infoClient.status,
          "isCreditNeeded":necesitaLME.value,
          "annualSales": annualSales.value === undefined ? infoClient.annualSales : numeral(annualSales.value).format('0'),
          "salesUpadateDate" : dateSalesAnnuals.value !== '' && dateSalesAnnuals.value !== null && dateSalesAnnuals.value !== undefined ? moment(dateSalesAnnuals.value, "DD/MM/YYYY").format('x'): null,
          "assets": assets.value === undefined ? infoClient.assets : numeral(assets.value).format('0'),
          "liabilities": liabilities.value === undefined ? infoClient.liabilities : numeral(liabilities.value).format('0'),
          "operatingIncome": operatingIncome.value === undefined ? infoClient.operatingIncome : numeral(operatingIncome.value).format('0'),
          "nonOperatingIncome": nonOperatingIncome.value === undefined ? infoClient.nonOperatingIncome : numeral(nonOperatingIncome.value).format('0'),
          "expenses": expenses.value === undefined ? infoClient.expenses : numeral(expenses.value).format('0'),
          "localMarket":infoClient.localMarket,
          "marketLeader":infoClient.marketLeader,
          "territory":infoClient.territory,
          "actualizationDate": infoClient.actualizationDate,
          "justificationForNoRM": marcGeren.value === 'false' ? justifyNoGeren.value : '',
          "justificationForLostClient": justifyExClient.value,
          "justificationForCreditNeed": necesitaLME.value === 'false' ? justifyNoLME.value : '',
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
              "neighborhood":neighborhood.value,
              "isPrincipalAddress": reportVirtual.value,
              "phoneNumber":telephone.value,
              "postalCode":infoClient.addresses[0] === null ? "" : infoClient.addresses.postalCoode,
            }],
          "notes":notesArray,
          "description": description.value,
          "clientIdType": infoClient.clientIdType,
          "celulaId": infoClient.celulaId,
          "nitPrincipal": ((!_.isEmpty(groupEconomic.value) && !_.isEmpty(selectsReducer.get('dataEconomicGroup'))) ? _.get(_.filter(selectsReducer.get('dataEconomicGroup'), ['id', parseInt(groupEconomic.value)]), '[0].nitPrincipal') : null)
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
      }
    }
  };

  render(){
    const {
    fields: {description, idCIIU, idSubCIIU, address, country, city, province, neighborhood,
      district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals,
      liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren,
      centroDecision, necesitaLME, groupEconomic, keywordFindEconomicGroup, justifyNoGeren, justifyNoLME, justifyExClient},
      error, handleSubmit, selectsReducer, clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    isProspect = infoClient.isProspect;
    return(
        <form onSubmit={handleSubmit(this._submitEditClient)}>
          <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          <Row style={{padding: "10px 10px 10px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Razón social</span></dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px",wordBreak:'break-all'}}>
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
          <Row style={{padding: "0px 25px 20px 20px"}}>
            <Col xs={12} md={12} lg={12} >
              <dt>
                <span>Breve descripción de la empresa</span>
              </dt>
              <dt>
                <Textarea
                  name="description"
                  type="text"
                  style={{width: '100%', height: '100%'}}
                  onChange={val => this._onchangeValue("description", val)}
                  placeholder="Ingrese la descripción"
                  max="1000"
                  rows={4}
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
                name="idCIIU"
                labelInput="Seleccione CIIU..."
                {...idCIIU}
                onChange={val => this._onChangeCIIU(val)}
                onBlur={idCIIU.onBlur}
                valueProp={'id'}
                textProp={'ciiu'}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get('dataCIIU')}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector</span> </dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>
                {(idCIIU.value !== "" && idCIIU.value !== null && idCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataCIIU'))) ? _.get(_.filter(selectsReducer.get('dataCIIU'), ['id', parseInt(idCIIU.value)]), '[0].economicSector') : ''}
              </span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>SubCIIU (</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name="idSubCIIU"
                labelInput="Seleccione subCIIU..."
                {...idSubCIIU}
                onBlur={idSubCIIU.onBlur}
                valueProp={'id'}
                textProp={'subCiiu'}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get('dataSubCIIU')}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", marginTop: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>
                {(idSubCIIU.value !== "" && idSubCIIU.value !== null && idSubCIIU.value !== undefined && !_.isEmpty(selectsReducer.get('dataSubCIIU'))) ? _.get(_.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)]), '[0].economicSubSector') : ''}
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
                  name="address"
                  type="text"
                  style={{width: '100%', height: '100%'}}
                  max="250"
                  onChange={val => this._onchangeValue("address", val)}
                  placeholder="Ingrese la dirección"
                  {...address}
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
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get(constants.FILTER_COUNTRY) || []}
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
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get('dataTypeProvince') || []}
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
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get('dataTypeCity') || []}
                />
              </div>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={8} lg={8}>
              <dt><span>Barrio</span></dt>
              <dt style={{marginRight:"17px"}}>
                <Input
                  name="txtBarrio"
                  type="text"
                  max="120"
                  placeholder="Ingrese el barrio"
                  {...neighborhood}
                />
              </dt>
            </Col>
            <Col xs style={{marginLeft:"10px"}}>
              <dt>
                <span>Teléfono (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt style={{marginRight:"15px"}}>
                <Input
                  name="txtTelefono"
                  type="text"
                  max="30"
                  placeholder="Ingrese el teléfono"
                  {...telephone}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "10px 0px 20px 20px", width:'100%'}}>
          <Col xs>
            <dt>
              <span>¿Desea consultar sus extractos de forma virtual? (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt style={{marginRight:"17px"}}>
              <ComboBox
                name="extractsVirtual"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
                data={valuesYesNo}
                {...extractsVirtual}
              />
            </dt>
          </Col>
            <Col xs style={{marginLeft:"10px"}}>
              <dt>
                <span>¿Desea recibir su reporte de costos consolidado de forma virtual? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt style={{marginRight:"15px"}}>
                <ComboBox
                  name="reportVirtual"
                  labelInput="Seleccione..."
                  {...reportVirtual}
                  valueProp={'id'}
                  textProp={'value'}
                  parentId="dashboardComponentScroll"
                  data={valuesYesNo}
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
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  type="text"
                  min={0}
                  max="16"
                  onChange={val => this._onChangeValue("annualSales", val)}
                  placeholder="Ingrese las ventas anuales"
                  {...annualSales}
                  value={annualSales.value}
                  onBlur={val => this._handleBlurValueNumber(1, annualSales, annualSales.value)}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Fecha de ventas anuales - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...dateSalesAnnuals}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Activos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  format="0,000"
                  min={0}
                  type="text"
                  max="16"
                  onChange={val => this._onChangeValue("assets", val)}
                  placeholder="Ingrese los activos"
                  {...assets}
                  value={assets.value}
                  onBlur={val => this._handleBlurValueNumber(1, assets, assets.value)}
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
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  format="0,000"
                  min={0}
                  max="16"
                  type="text"
                  onChange={val => this._onChangeValue("liabilities", val)}
                  placeholder="Ingrese los pasivos"
                  {...liabilities}
                  value={liabilities.value}
                  onBlur={val => this._handleBlurValueNumber(1, liabilities, liabilities.value)}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Ingresos operacionales mensuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  format="0,000"
                  onChange={val => this._onChangeValue("operatingIncome", val)}
                  min={0}
                  max="16"
                  type="text"
                  placeholder="Ingrese los ingresos operacionales mensuales"
                  {...operatingIncome}
                  value={operatingIncome.value}
                  onBlur={val => this._handleBlurValueNumber(2, operatingIncome ,operatingIncome.value)}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Ingresos no operacionales mensuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  format="0,000"
                  min={0}
                  max="16"
                  type="text"
                  onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                  placeholder="Ingrese los ingresos no operacionales mensuales"
                  {...nonOperatingIncome}
                  value={nonOperatingIncome.value}
                  onBlur={val => this._handleBlurValueNumber(2, nonOperatingIncome ,nonOperatingIncome.value)}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
              <dt>
                <span>Egresos mensuales(</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Input
                  style={{width: "100%", textAlign: "right"}}
                  format="0,000"
                  min={0}
                  max="16"
                  type="text"
                  onChange={val => this._onChangeValue("expenses", val)}
                  placeholder="Ingrese los egresos mensuales"
                  {...expenses}
                  value={expenses.value}
                  onBlur={val => this._handleBlurValueNumber(1, expenses ,expenses.value)}
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
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Buscar grupo económico</span>
              </dt>
              <dt>
                <div style={{display:"inline-block", width:"85%"}}>
                  <Input
                    name="txtGrupoEconomico"
                    max="50"
                    placeholder="Ingrese el grupo económico a buscar"
                    {...keywordFindEconomicGroup}
                    onKey={this._onChangeGroupEconomic}
                  />
                </div>
                <button id="searchGrupoEconomico" className="btn" title="Buscar grupo económico"
                  type="button" onClick={this._handleGroupEconomicFind}
                  style={{backgroundColor:"#E0E2E2", width:"40px", height:"40px", display:"inline", marginLeft:"8px"}}>
                  <i className="search icon" style={{margin:'0em', fontSize : '1.2em'}}></i>
                </button>
              </dt>
            </Col>
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
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get('dataEconomicGroup')}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Nit principal</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {(!_.isEmpty(groupEconomic.value) && !_.isEmpty(selectsReducer.get('dataEconomicGroup'))) ? _.get(_.filter(selectsReducer.get('dataEconomicGroup'), ['id', parseInt(groupEconomic.value)]), '[0].nitPrincipal') : ''}
                </p>
              </dt>
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
                  parentId="dashboardComponentScroll"
                  data={valuesYesNo}
                  {...marcGeren}
                />
              </dt>
            </Col>
            <SelectsJustificacion
              visible={marcGeren.value}
              title="Justificación no gerenciamiento"
              labelInput="Seleccione..."
              value={justifyNoGeren.value}
              onBlur={justifyNoGeren.onBlur}
              valueProp={"id"}
              textProp={"value"}
              parentId="dashboardComponentScroll"
              justify={justifyNoGeren}
              obligatory={true}
              data={selectsReducer.get(constants.JUSTIFICATION_NO_RM) || []}
            />
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
                  parentId="dashboardComponentScroll"
                  data={valuesYesNo}
                  {...centroDecision}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
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
                  parentId="dashboardComponentScroll"
                  data={valuesYesNo}
                />
              </dt>
            </Col>
            <SelectsJustificacion
              visible={necesitaLME.value}
              title="Justificación no necesita LME"
              labelInput="Seleccione..."
              value={justifyNoLME.value}
              onBlur={justifyNoLME.onBlur}
              valueProp={"id"}
              textProp={"value"}
              justify={justifyNoLME}
              obligatory={true}
              data={selectsReducer.get(constants.JUSTIFICATION_CREDIT_NEED) || []}
            />
            <SelectsJustificacion
              visible={'false'}
              title="Justificación excliente"
              labelInput="Seleccione..."
              value={justifyExClient.value}
              onBlur={justifyExClient.onBlur}
              valueProp={"id"}
              textProp={"value"}
              justify={justifyExClient}
              obligatory={false}
              data={selectsReducer.get(constants.JUSTIFICATION_LOST_CLIENT) || []}
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
          <NotesClient error={errorNote}/>
          <Row>
            <Col xs={12} md={12} lg={12} style={{paddingTop: "50px"}}>
              <div style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
                <button className="btn"
                    style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}}
                    type="submit">
                  <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar</span>
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
            text="Señor usuario, perderá los cambios que no haya guardado. ¿Está seguro que desea salir de la vista de edición?"
            showCancelButton= {true}
            onCancel= {() => this.setState({show: false })}
            onConfirm={() => this._onConfirmExit()}/>
          <SweetAlert
           type= "success"
           show={this.state.showEx}
           title="Edición de cliente"
           text="Señor usuario, el cliente se editó de forma exitosa."
           onConfirm={() => this._closeSuccess()}
         />
         <SweetAlert
          type= "error"
          show={this.state.showEr}
          title="Error editando cliente"
          text="Señor usuario, ocurrió un error editando del cliente."
          onConfirm={() => this._closeError()}
          />
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
    economicGroupsByKeyword,
    getMasterDataFields,
    setNotes,
    crearNotes,
    createProspect,
    clearValuesAdressess
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, notes},ownerProps) {
  const infoClient = clientInformacion.get('responseClientInfo');
  return {
    clientInformacion,
    selectsReducer,
    notes,
    initialValues:{
      description: infoClient.description,
      idCIIU: infoClient.ciiu,
      idSubCIIU: infoClient.subCiiu,
      address: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].address : '',
      country: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].country : '',
      province: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].province : '',
      neighborhood: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].neighborhood : '',
      city: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].city : '',
      telephone: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].phoneNumber : '',
      reportVirtual: infoClient.addresses !== null && infoClient.addresses !== undefined && infoClient.addresses !== '' ? infoClient.addresses[0].isPrincipalAddress : '',
      extractsVirtual: infoClient.isVirtualStatement,
      annualSales: infoClient.annualSales === 0 ? '0' : fomatInitialStateNumber(infoClient.annualSales),
      dateSalesAnnuals: infoClient.salesUpadateDate !== '' && infoClient.salesUpadateDate !== null && infoClient.salesUpadateDate !== undefined ? moment(infoClient.salesUpadateDate).format('DD/MM/YYYY') : null,
      assets: infoClient.assets === 0 ? '0' : fomatInitialStateNumber(infoClient.assets),
      liabilities: infoClient.liabilities === 0 ? '0' : fomatInitialStateNumber(infoClient.liabilities),
      operatingIncome: infoClient.operatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.operatingIncome),
      nonOperatingIncome: infoClient.nonOperatingIncome === 0 ? '0' : fomatInitialStateNumber(infoClient.nonOperatingIncome),
      expenses: infoClient.expenses === 0 ? '0' : fomatInitialStateNumber(infoClient.expenses),
      marcGeren: infoClient.isManagedByRm,
      centroDecision: infoClient.isDecisionCenter,
      necesitaLME: infoClient.isCreditNeeded,
      justifyNoGeren: infoClient.justificationForNoRM,
      justifyExClient: infoClient.justificationForLostClient,
      justifyNoLME: infoClient.justificationForCreditNeed,
      groupEconomic: infoClient.economicGroup
    }
  };
}

function fomatInitialStateNumber(val){
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(val + "")){
      val = val.toString().replace(pattern, "$1,$2");
    }
    return val;
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(clientEdit);
