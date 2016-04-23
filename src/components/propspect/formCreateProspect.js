import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';
import {createProspect} from './actions';

var notasProspect = [];

const fields = ["razonSocial", "descriptionCompany","reportVirtual", "extractsVirtual", "marcGeren", "necesitaLME", "idCIIU",
                "idSubCIIU", "address", "telephone", "district", "annualSales", "assets", "centroDecision",
                "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);

    this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);

    this.state = {
      styleRazonSocial: {},
    }
  }

  _onchangeValue(type, val){
    switch (type) {
      case "razonSocial":
        var {fields: {razonSocial}} = this.props
        razonSocial.onChange(val);
        this.setState({ styleRazonSocial: {} });
        break;

    }
  }

  _onChangeValueList(type, val){
    switch (type) {
      case "razonSocial":
        var {fields: {razonSocial}} = this.props
        razonSocial.onChange(val);
        this.setState({ styleRazonSocial: {} });
        break;

      default:
        break;
    }
  };

  _submitFormCreateProspect(formData){
    const {razonSocial} = formData;
    var styleError = {borderColor: "red"};
    var error = false;
    if( razonSocial === null || razonSocial === undefined ){
      error = true;
      this.setState({
        styleRazonSocial: styleError
      })
    }
    if( error ){
      alert("Señor usuario, debe de ingresar los todos los campos obligatorios (*).");
    }
  };


  render(){
    const {
      fields: {razonSocial, descriptionCompany, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, annualSales, assets, centroDecision, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals},
      error, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
      <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px", backgroundColor: "#F0F0F0"}}>

        <Col xs={12} md={6} lg={6} style={{marginTop: "20px", paddingRight: "35px"}}>
          <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
            <dt><span>Razón social(</span><span style={{color: "red"}}>*</span>)</dt>
            <input
              className="inputDataValue"
              value={razonSocial.value}
              onChange={val => this._onchangeValue("razonSocial", val)}
              type="text"
              style={this.state.styleRazonSocial}
            />
          </div>
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
              <i className="icon-segmen" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Actividad económica</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px"}}>
              <dt><span>CIIU</span></dt>
              <SelectCIIU
                onChange={val => idCIIU.onChange(val)}
                store={idCIIU.id}
                />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>{idCIIU.value === undefined ? "" : idCIIU.value.economicSector}</span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>SubCIIU</span></dt>
              <input
                className="inputDataValue"
                type="text"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector</span></dt>
              <span style={{width: "25%", verticalAlign: "initial"}}>Subsector</span>
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-top-chart-risk" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información de ubicación y correspondencia</span>
            </dl>
          </Col>
          <Col xs={12} md={12} lg={12} style={{marginLeft: "20px"}}>
            <h3 className="sub-header" style={{borderBottom: "solid 1px"}}>Dirección sede principal</h3>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Dirección</span></dt>
              <input
                className="inputDataValue"
                type="text"
                {...address}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>País</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Departamento</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
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
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Información financiera</span>
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
            <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0", width:"100%", marginBottom: "0", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
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
    createProspect
  }, dispatch);
}

function mapStateToProps({propspectReducer, notes},ownerProps) {
  return {
    propspectReducer,
  };
}

export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(FormCreateProspect);
