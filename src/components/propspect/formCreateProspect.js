import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';
import {createProspect} from './actions';
import {consultDataSelect, consultList, consultListWithParameter, consultListWithParameterUbication}
  from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import _ from 'lodash';

const valuesYesNo = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
]
var notasProspect = [];
var ciiuOld = null;
var countryOld = null;

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

const fields = ["razonSocial", "descriptionCompany","reportVirtual", "extractsVirtual", "marcGeren", "necesitaLME", "idCIIU",
      "idSubCIIU", "address", "country", "province", "city", "telephone", "district", "annualSales", "assets", "centroDecision", "idCelula",
      "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);

    this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);
    this._onChangeCIIU = this._onChangeCIIU.bind(this);
    this._onChangeCountry = this._onChangeCountry.bind(this);
    this._onChangeProvince = this._onChangeProvince.bind(this);

    this.state = {
      styleRazonSocial: {},
      styleCelula: {}
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

  };


  render(){
    const {
      fields: {razonSocial, descriptionCompany, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, country, city, province, annualSales, assets, centroDecision, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals, idCelula},
      error, handleSubmit, selectsReducer} = this.props;

    if( country != undefined && countryOld != country ){
      countryOld = country;
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(constants.FILTER_PROVINCE,country.value);
      setTimeout(function(){
         province.onChange('');
      }, 50);
    }
    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
        <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px", backgroundColor: "#F0F0F0"}}>
          <Col xs={12} md={8} lg={8} style={{marginTop: "20px", paddingRight: "35px"}}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Razón social(</span><span style={{color: "red"}}>*</span>)</dt>
              <Input
                name="razonSocial"
                type="text"
                placeholder="Ingrese la razón social del cliente"
                onChange={val => this._onchangeValue("razonSocial", val)}
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
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>Dirección</span></dt>
              <Input
                name="address"
                type="text"
                placeholder="Ingrese la dirección del cliente"
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
                labelInput="departamento"
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
            <div style={{paddingLeft: "20px", paddingRight: "35px", marginTop: "10px"}}>
              <dt><span>Ciudad</span></dt>
              <ComboBox
                name="city"
                labelInput="ciudad"
                {...city}
                valueProp={'id'}
                textProp={'value'}
                data={selectsReducer.get('dataTypeCity')}
                />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span></dt>
              <ComboBox
                name="reportVirtual"
                labelInput="Reporte virtual"
                valueProp={'id'}
                textProp={'value'}
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
                placeholder="Ingrese el teléfono del cliente"
                {...telephone}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", paddingTop: "15px"}}>
              <dt><span>Barrio</span></dt>
              <Input
                name="district"
                type="number"
                placeholder="Ingrese el barrio del cliente"
                {...district}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?</span></dt>
              <ComboBox
                name="extractVirtual"
                labelInput="Extracto virtual"
                valueProp={'id'}
                textProp={'value'}
                data={valuesYesNo}
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
              <Input
                name="annualSales"
                type="number"
                min="0"
                placeholder="Ingrese las ventas anuales"
                {...annualSales}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Activos</span></dt>
              <Input
                name="assets"
                type="number"
                min="0"
                placeholder="Ingrese los activos"
                {...assets}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Pasivos</span></dt>
              <Input
                name="liabilities"
                type="number"
                min="0"
                placeholder="Ingrese los pasivos"
                {...liabilities}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales</span></dt>
              <Input
                name="operatingIncome"
                type="number"
                placeholder="Ingrese los ingresos operacionales"
                {...operatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales</span></dt>
              <Input
                name="nonOperatingIncome"
                type="number"
                placeholder="Ingrese los ingresos no operacionales"
                {...nonOperatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos</span></dt>
              <Input
                name="expenses"
                type="number"
                min="0"
                placeholder="Ingrese los egresos"
                {...expenses}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Fecha de ventas anuales</span></dt>
              <input
                className="inputDataValue"
                type="text"
                {...dateSalesAnnuals}
                style={this.state.styleDateSalesAnnuals}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{paddingTop: "60px"}}>
            <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
              <button className="btn" style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}} type="submit">
                <span style={{color: "#FFFFFF", padding:"10px"}}>Crear prospecto</span>
              </button>
            </div>
          </Col>
      </Row>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createProspect,
    consultDataSelect,
    consultList,
    consultListWithParameter,
    consultListWithParameterUbication
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
