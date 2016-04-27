import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SweetAlert from 'sweetalert-react';
import {createProspect} from './actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import {redirectUrl} from '../globalComponents/actions';
import {DateTimePicker} from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import NumberInput from 'react-number-input';
import _ from 'lodash';
import numeral from 'numeral';
import {consultDataSelect, consultList, consultListWithParameter, consultListWithParameterUbication}
  from '../selectsComponent/actions';

const valuesYesNo = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
]
var messageConfirm = "Recuerde que al crear el prospecto, no podrá modificarlo déspues. ¿Está seguro de guardar la información?";
var titleConfirm = "Confirmación creación";
var typeConfirm = "create";

const stylepaddingRigth = {paddingRight: "25px"}
const stylepaddingRigth2 = {paddingRight: "10px"}

const fields = ["razonSocial", "descriptionCompany","reportVirtual", "extractsVirtual", "marcGeren", "necesitaLME", "idCIIU",
      "idSubCIIU", "address", "country", "province", "city", "telephone", "district", "annualSales", "assets", "centroDecision", "idCelula",
      "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];

const validate = values => {
    const errors = {}
    if (!values.razonSocial) {
        errors.razonSocial = "Debe seleccionar un valor";
    } else {
      errors.razonSocial = null;
    }
    if (!values.idCelula) {
        errors.idCelula = "Debe ingresar un valor";
    } else {
      errors.idCelula = null;
    }
    return errors;
};

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);
    momentLocalizer(moment);
    this.state = {
       show: false,
       showEx:false,
       showEr:false
     };
    this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);
    this._onChangeCIIU = this._onChangeCIIU.bind(this);
    this._onChangeCountry = this._onChangeCountry.bind(this);
    this._onChangeProvince = this._onChangeProvince.bind(this);
    this._closeWindow = this._closeWindow.bind(this);

    this._closeError = this._closeError.bind(this);
    this._closeSuccess = this._closeSuccess.bind(this);
    this._onConfirmCreate = this._onConfirmCreate.bind(this);

  }

  _closeWindow(){
    messageConfirm = "¿Está seguro que desea salir de la pantalla de creación de prospecto?";
    titleConfirm = "Confirmación salida";
    typeConfirm = "close";
    this.setState({show: true});
  }

  _redirectClients(){
    redirectUrl("/dashboard/clients");
  }

  _closeError(){
    this.setState({show: false, showEx:false, showEr: false});
  }

  _closeSuccess(){
    this.setState({show: false, showEx:false, showEr: false});
    redirectUrl("/dashboard/clients");
  }

  _onConfirmCreate(){
    this.setState({show: false});
    if( typeConfirm === "create" ){
      const {fields: {razonSocial, descriptionCompany, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, country, city, province, annualSales, assets, centroDecision, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals, idCelula}, idTupeDocument, numberDocument
       } = this.props;
       console.log("idCelula", idCelula);
       var jsonCreateProspect= {
         "clientIdNumber": numberDocument,
         "clientName": razonSocial.value,
         "clientStatus": "",
         "riskRating": null,
         "isProspect": true,
         "ciiu": idCIIU.value,
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
         "segment": "",
         "subCiiu": idSubCIIU.value,
         "subSegment": "",
         "countryOfFirstLevelManagement": "",
         "countryOfMainMarket": "",
         "relationshipStatus": "",
         "typeOfClient":"",
         "status":0,
         "isCreditNeeded":null,
         "annualSales": numeral(annualSales.value).format('0'),
         "salesUpadateDate": moment(dateSalesAnnuals.value).format("YYYY-MM-DD HH:mm:ss"),
         "assets": numeral(assets.value).format('0'),
         "liabilities": numeral(liabilities.value).format('0'),
         "operatingIncome": numeral(operatingIncome.value).format('0'),
         "nonOperatingIncome": numeral(nonOperatingIncome.value).format('0'),
         "expenses": numeral(expenses.value).format('0'),
         "localMarket":"",
         "marketLeader":"",
         "territory":"",
         "actualizationDate":"2016-04-25 17:22:34",
         "justificationForNoRM":"",
         "justificationForLostClient":"",
         "justificationForCreditNeed":"",
         "isVirtualStatement": extractsVirtual.value,
         "lineOfBusiness":[],
         "isManagedByRm":null,
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
         "notes":[],
         "description": descriptionCompany.value,
         "clientIdType": idTupeDocument
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
    } else {
      this._redirectClients();
    }
  }

  componentWillMount(){
    const {consultList, consultDataSelect} = this.props;
    consultList(constants.TEAM_FOR_EMPLOYEE);
    consultList(constants.CIIU);
    consultDataSelect(constants.FILTER_COUNTRY);
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

  _submitFormCreateProspect(formData){
    this.setState({show: true});
  };


  render(){
    const {
      fields: {razonSocial, descriptionCompany, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, country, city, province, annualSales, assets, centroDecision, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals, idCelula},
      error, handleSubmit, selectsReducer} = this.props;
    const {propspectReducer} = this.props
    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
        <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px", backgroundColor: "#F0F0F0"}}>
          <Col xs={12} md={8} lg={8} style={{marginTop: "20px", paddingRight: "35px"}}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Razón social(</span><span style={{color: "red"}}>*</span>)</dt>
              <Input
                name="razonSocial"
                type="text"
                placeholder="Ingrese la razón social del prospecto"
                {...razonSocial}
              />
            </div>
          </Col>

          <Col xs={10} md={4} lg={4} style={{marginTop: "20px", paddingRight: "20px"}}>
            <dt><span>Célula (</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name="celula"
                labelInput="Célula"
                valueProp={'id'}
                textProp={'description'}
                style={stylepaddingRigth}
                data={selectsReducer.get('teamValueObjects')}
                {...idCelula}
              />
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "20px", paddingRight: "35px"}}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Breve descripción de la empresa</span></dt>
              <textarea
                {...descriptionCompany}
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "20px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <div style={{marginTop: "10px"}}>
                <i className="payment icon" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Actividad económica</span>
              </div>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", marginTop: "10px"}}>
              <dt><span>CIIU</span></dt>
              <ComboBox
                name="ciiu"
                labelInput="CIIU"
                onChange={val => this._onChangeCIIU(val)}
                value={idCIIU.value}
                onBlur={idCIIU.onBlur}
                valueProp={'id'}
                textProp={'ciiu'}
                style={stylepaddingRigth2}
                data={selectsReducer.get('dataCIIU')}
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
            <div style={{paddingLeft: "20px", paddingRight: "35px", marginTop: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>
                {idSubCIIU.value && _.filter(selectsReducer.get('dataSubCIIU'), ['id', parseInt(idSubCIIU.value)] )[0].economicSubSector}
              </span>
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <div style={{marginTop: "10px"}}>
                <i className="browser icon" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Información de ubicación y correspondencia</span>
              </div>
            </dl>
          </Col>
          <Col xs={12} md={12} lg={12} style={{marginLeft: "20px", marginTop: "10px"}}>
            <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Dirección sede principal</h3>
          </Col>
          <Col xs={12} md={12} lg={12} style={{paddingRight: "43px"}} >
            <div style={{paddingLeft: "20px", marginTop: "10px"}}>
              <dt><span>Dirección</span></dt>
              <Input
                name="address"
                type="text"
                placeholder="Ingrese la dirección del prospecto"
                {...address}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
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
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>Departamento</span></dt>
              <ComboBox
                name="province"
                labelInput="Departamento"
                onChange={val => this._onChangeProvince(val)}
                value={province.value}
                onBlur={province.onBlur}
                valueProp={'id'}
                textProp={'value'}
                data={selectsReducer.get('dataTypeProvince')}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
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
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", paddingTop: "10px"}}>
              <dt><span>Barrio</span></dt>
              <Input
                name="district"
                type="number"
                placeholder="Ingrese el barrio del prospecto"
                {...district}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span></dt>
              <ComboBox
                name="reportVirtual"
                labelInput="Seleccione una opción"
                valueProp={'id'}
                textProp={'value'}
                style={stylepaddingRigth2}
                data={valuesYesNo}
                {...reportVirtual}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Teléfono</span></dt>
              <Input
                name="telephone"
                type="number"
                placeholder="Ingrese el teléfono del prospecto"
                {...telephone}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?</span></dt>
              <ComboBox
                name="extractVirtual"
                labelInput="Seleccione una opción"
                valueProp={'id'}
                textProp={'value'}
                data={valuesYesNo}
                style={stylepaddingRigth2}
                {...extractsVirtual}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <div style={{marginTop: "10px"}}>
                <i className="suitcase icon" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Información financiera</span>
              </div>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Ventas anuales</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese las ventas anuales"
                min={0}
                format="0,000"
                {...annualSales}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Activos</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese los activos"
                min={0}
                format="0,000"
                {...assets}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Pasivos</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese los pasivos"
                min={0}
                format="0,000"
                {...liabilities}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese los ingresos operacionales"
                format="0,000"
                {...operatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese los ingresos no operacionales"
                format="0,000"
                {...nonOperatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos</span></dt>
              <NumberInput
                style={{width: "100%", textAlign: "right"}}
                placeholder="Ingrese los egresos"
                min={0}
                format="0,000"
                {...expenses}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Fecha de ventas anuales</span></dt>
              <DateTimePicker
                {...dateSalesAnnuals}
                time={false}
                placeholder="Seleccione una fecha"
                culture='es'
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{paddingTop: "60px"}}>
            <div style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
              <button className="btn" style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}} type="submit">
                <span style={{color: "#FFFFFF", padding:"10px"}}>Crear prospecto</span>
              </button>
              <button className="btn btn-secondary modal-button-edit"
                onClick={this._closeWindow}
                style={{float:"right", margin:"8px 0px 0px 190px", position:"fixed", backgroundColor: "#C1C1C1"}}
                type="button">
                <span style={{color: "#FFFFFF", padding:"10px"}}>Cancelar</span>
              </button>
            </div>
          </Col>
          <SweetAlert
            type= "warning"
            show={this.state.show}
            title={titleConfirm}
            text={messageConfirm}
            confirmButtonColor= '#DD6B55'
            confirmButtonText= 'Sí, estoy seguro!'
            cancelButtonText = "Cancelar"
            showCancelButton= {true}
            onCancel= {() => this.setState({show: false })}
            onConfirm={() => this._onConfirmCreate()}/>
          <SweetAlert
           type= "success"
           show={this.state.showEx}
           title="Prospecto creado"
           text="El prospecto se creó correctamente."
           onConfirm={() => this._closeSuccess()}
           />
           <SweetAlert
            type= "error"
            show={this.state.showEr}
            title="Error"
            text="Se presento un error al realizar la creación del prospecto."
            onConfirm={() => this._closeError()}
            />
      </Row>
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
  }, dispatch);
}

function mapStateToProps({propspectReducer, selectsReducer},ownerProps) {
  return {
    propspectReducer,
    selectsReducer
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormCreateProspect);
