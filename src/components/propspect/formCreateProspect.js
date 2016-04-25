import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';
import {createProspect} from './actions';
import {consultList, consultListWithParameter} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import _ from 'lodash';

var notasProspect = [];
var ciiuOld = null;

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
      "idSubCIIU", "address", "telephone", "district", "annualSales", "assets", "centroDecision", "idCelula",
      "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);

    this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);

    this.state = {
      styleRazonSocial: {},
      styleCelula: {}
    }
  }

  componentWillMount(){
    const {consultList} = this.props;
    consultList(constants.TEAM_FOR_EMPLOYEE);
    consultList(constants.CIIU);
  }

  _submitFormCreateProspect(formData){

  };


  render(){
    const {
      fields: {razonSocial, descriptionCompany, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, annualSales, assets, centroDecision, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals, idCelula},
      error, handleSubmit, selectsReducer} = this.props;

    if( idCIIU != undefined && ciiuOld != idCIIU ){
      ciiuOld = idCIIU;
      const {consultListWithParameter} = this.props;
      consultListWithParameter(constants.SUB_CIIU, idCIIU.value);
      setTimeout(function(){
         idSubCIIU.onChange('');
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
                {...idCIIU}
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
              <span style={{width: "25%", verticalAlign: "initial"}}>Subsector</span>
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
              <input
                className="inputDataValue"
                type="text"
                {...address}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>País</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
              <dt><span>Departamento</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", marginTop: "10px"}}>
              <dt><span>Ciudad</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span></dt>
              <SelectYesNo
                onChange={val => reportVirtual.onChange(val.id)}
                store={reportVirtual.id}
                styles={this.state.styleReportVirtual}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Teléfono</span></dt>
              <input
                className="inputDataValue"
                type="text"
                {...telephone}
                style={this.state.styleTelephone}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", paddingTop: "15px"}}>
              <dt><span>Barrio</span></dt>
              <input
                className="inputDataValue"
                type="text"
                {...district}
                style={this.state.styleDistrict}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?</span></dt>
              <SelectYesNo
                onChange={val => extractsVirtual.onChangeValueList(val.id)}
                store={extractsVirtual.id}
                styles={this.state.styleExtractVirtual}
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
              <input
                className="inputDataValue"
                type="number"
                min={0}
                {...annualSales}
                style={this.state.styleAnnualSales}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Activos</span></dt>
              <input
                className="inputDataValue"
                type="number"
                min={0}
                {...assets}
                style={this.state.styleAssets}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Pasivos</span></dt>
              <input
                className="inputDataValue"
                type="number"
                min={0}
                {...liabilities}
                style={this.state.styleLiabilities}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales</span></dt>
              <input
                className="inputDataValue"
                type="number"
                {...operatingIncome}
                style={this.state.styleOperationIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales</span></dt>
              <input
                className="inputDataValue"
                type="number"
                {...nonOperatingIncome}
                style={this.state.styleNonOperationgIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos</span></dt>
              <input
                className="inputDataValue"
                type="number"
                min="0"
                {...expenses}
                style={this.state.styleExpenses}
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
    consultList,
    consultListWithParameter
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
