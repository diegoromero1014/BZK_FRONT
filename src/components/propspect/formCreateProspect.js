import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';

var notasProspect = [];

const fields = ["reportVirtual", "extractsVirtual", "marcGeren", "necesitaLME", "idCIIU",
                "idSubCIIU", "address", "telephone", "district", "annualSales", "assets",
                "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];

class FormCreateProspect extends Component{
  constructor( props ) {
    super(props);

    this._submitFormCreateProspect = this._submitFormCreateProspect.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);

    this.state = {
      styleCIIU: {},
      styleSubCIIU: {},
      styleReportVirtual: {},
      styleExtractVirtual: {},
      styleAdress: {},
      styleTelephone: {},
      styleDistrict: {},
      styleAnnualSales: {},
      styleAssets: {},
      styleHabilities: {},
      styleOperationIncome: {},
      styleNonOperationIncome: {},
      styleExpenses: {},
      styleDateSalesAnnuals: {}
    }
  }

  _onchangeValue(type, val){
    switch (type) {
      case "adress":
        var {fields: {address}} = this.props
        address.onChange(val);
        this.setState({ styleAdress: {} });
        break;

      case "telephone":
        var {fields: {telephone}} = this.props
        telephone.onChange(val);
        this.setState({ styleTelephone: {} });
        break;

      case "district":
        var {fields: {district}} = this.props
        district.onChange(val);
        this.setState({ styleDistrict: {} });
        break;

    }
  }

  _onChangeValueList(type, val){
    switch (type) {
      case "ciiu":
        var {fields: {idCIIU}} = this.props
        idCIIU.onChange(val);
        this.setState({ styleCIIU: {} });
        break;

      case "subCiiu":
          var {fields: {idSubCIIU}} = this.props
          idSubCIIU.onChange(val);
          this.setState({ styleSubCIIU: {} });
          break;

      case "reporteVirtual":
        var {fields: {reportVirtual}} = this.props
        reportVirtual.onChange(val);
        this.setState({ styleReportVirtual: {} });
        break;

      case "extractosVirtuales":
        var {fields: {extractsVirtual}} = this.props
        extractsVirtual.onChange(val);
        this.setState({ styleExtractVirtual: {} });
        break;

      default:
        break;
    }
  };

  _submitFormCreateProspect(formData){
    const {reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
             address, telephone, district, annualSales, assets, liabilities, operatingIncome,
           nonOperatingIncome, expenses, dateSalesAnnuals} = formData;
    var styleError = {borderColor: "red"};
    var error = false;
    if( reportVirtual === null || reportVirtual === undefined ){
      error = true;
      this.setState({
        styleReportVirtual: styleError
      })
    }
    if( extractsVirtual === null || extractsVirtual === undefined ){
      error = true;
      this.setState({
        styleExtractVirtual: styleError
      })
    }
    if( idCIIU === null || idCIIU === undefined ){
      error = true;
      this.setState({
        styleCIIU: styleError
      })
    }
    if( idSubCIIU === null || idSubCIIU === undefined ){
      error = true;
      this.setState({
        styleSubCIIU: styleError
      })
    }
    if( address === null || address === undefined ){
      error = true;
      this.setState({
        styleAdress: styleError
      })
    }
    if( telephone === null || telephone === undefined ){
      error = true;
      this.setState({
        styleTelephone: styleError
      })
    }
    if( district === null || district === undefined ){
      error = true;
      this.setState({
        styleDistrict: styleError
      })
    }
    if( annualSales === null || annualSales === undefined ){
      error = true;
      this.setState({
        styleAnnualSales: styleError
      })
    }
    if( assets === null || assets === undefined ){
      error = true;
      this.setState({
        styleAssets: styleError
      })
    }
    if( liabilities === null || liabilities === undefined ){
      error = true;
      this.setState({
        styleLiabilities: styleError
      })
    }
    if( operatingIncome === null || operatingIncome === undefined ){
      error = true;
      this.setState({
        styleOperatingIncome: styleError
      })
    }
    if( nonOperatingIncome === null || nonOperatingIncome === undefined ){
      error = true;
      this.setState({
        styleNonOperatingIncome: styleError
      })
    }
    if( expenses === null || expenses === undefined ){
      error = true;
      this.setState({
        styleExpenses: styleError
      })
    }
    if( dateSalesAnnuals === null || dateSalesAnnuals === undefined ){
      error = true;
      this.setState({
        styleDateSalesAnnuals: styleError
      })
    }
  };


  render(){
    const {
      fields: {reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
         address, telephone, district, annualSales, assets, liabilities, operatingIncome,
         nonOperatingIncome, expenses, dateSalesAnnuals},
      error, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitFormCreateProspect)}>
      <Row style={{height: "100%", marginTop: "3px", paddingBottom: "15px"}}>

          <Col xs={12} md={12} lg={12} style={{marginTop: "10px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-segmen" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Actividad económica</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>CIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectCIIU
                onChange={val => this._onChangeValueList("ciiu", val)}
                store={idCIIU.id}
                styles={this.state.styleCIIU}/>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Sector(</span><span style={{color: "red"}}>*</span>)</dt>
              <span style={{width: "25%", verticalAlign: "initial", paddingTop: "5px"}}>{idCIIU.value === undefined ? "" : idCIIU.value.economicSector}</span>
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>SubCIIU(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt style={{paddingBottom: "10px"}}><span>Subsector(</span><span style={{color: "red"}}>*</span>)</dt>
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
              <dt><span>Dirección(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={address.value}
                onChange={val => this._onchangeValue('adress', val)}
                style={this.state.styleAdress}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3} >
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>País(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Departamento(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ciudad(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea recibir su reporte de costos consolidado de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => this._onChangeValueList("reporteVirtual", val.id)}
                store={reportVirtual.id}
                styles={this.state.styleReportVirtual}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Teléfono(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                onChange={val => this._onchangeValue('telephone', val)}
                value={telephone.value}
                style={this.state.styleTelephone}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px", paddingTop: "15px"}}>
              <dt><span>Barrio(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                onChange={val => this._onchangeValue('district', val)}
                value={district.value}
                style={this.state.styleDistrict}
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>¿Desea consultar sus extractos de forma virtual?(</span><span style={{color: "red"}}>*</span>)</dt>
              <SelectYesNo
                onChange={val => this._onChangeValueList("extractosVirtuales", val.id)}
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
              <dt><span>Ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={annualSales.value}
                style={this.state.styleAnnualSales}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Activos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={assets.value}
                style={this.state.styleAssets}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Pasivos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={liabilities.value}
                style={this.state.styleLiabilities}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Ingresos operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={operatingIncome.value}
                style={this.state.styleOperatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Ingresos no operacionales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={nonOperatingIncome.value}
                style={this.state.styleNonOperatingIncome}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Egresos(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={expenses.value}
                style={this.state.styleExpenses}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px", paddingTop: "15px"}}>
              <dt><span>Fecha de ventas anuales(</span><span style={{color: "red"}}>*</span>)</dt>
              <input
                className="inputDataValue"
                type="text"
                value={dateSalesAnnuals.value}
                style={this.state.styleDateSalesAnnuals}
              />
            </div>
          </Col>

          <Col xs={12} md={12} lg={12} style={{marginTop: "30px", marginLeft: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", margin: "5px 30px 5px 0", borderTop: "1px dotted #cea70b"}}>
              <i className="icon-address" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Datos de conocimiento comercial</span>
            </dl>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Marca gerenciamiento</span></dt>
              <SelectYesNo
                onChange={val => marcGeren.onChange(val.id)}
                store={marcGeren.id}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>¿Necesita LME?</span></dt>
              <SelectYesNo
                onChange={val => necesitaLME.onChange(val.id)}
                store={necesitaLME.id}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Grupo económico/Relación</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>Centro de decisión</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
              />
            </div>
          </Col>
          {!marcGeren.value &&
            <Col xs={12} md={3} lg={3}>
              <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
                <dt><span>Justificación no gerenciamiento</span></dt>
                <textarea
                  style={{width: "100%"}}
                  rows="4"
                />
              </div>
            </Col>
          }
          {!necesitaLME.value == true &&
            <Col xs={12} md={3} lg={3}>
              <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
                <dt><span>Justificación no necesita LME</span></dt>
                <textarea
                  style={{width: "100%"}}
                  rows="4"
                />
              </div>
            </Col>
          }
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "10px"}}>
              <dt><span>Justificación excliente</span></dt>
              <textarea
                style={{width: "100%"}}
                rows="4"
              />
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingLeft: "20px", paddingRight: "35px"}}>
              <dt><span>NIT principal</span></dt>
              <input
                className="inputDataValue"
                type="text"
                style={{}}
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
