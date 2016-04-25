import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectCIIU from '../selectsComponent/selectCIIU/selectCIIU';
import SelectSubCIIU from '../selectsComponent/selectSubCIIU/selectSubCIIU';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {reduxForm} from 'redux-form';

const style = {
  width: "95%"
}

const fields = ["reportVirtual", "extractsVirtual", "marcGeren", "necesitaLME", "idCIIU",
                "idSubCIIU", "adress", "telephone", "district", "annualSales", "assets", "marcGeren",
                "justifyNonGeren", "centroDecision", "necesitaLME", "justifyNonLME", "justifyExClient",
                "liabilities", "operatingIncome", "nonOperatingIncome", "expenses", "dateSalesAnnuals"];


                const propsComboBox = {
                    nameInput: 'Pagina',
                    labelInput: 'Página',
                    data: [
                        {
                            id: 1,
                            value: 't'
                        },
                        {
                            id: 2,
                            value: 'x'
                        }
                    ],
                    textProp: 'value',
                    valueProp: 'id'
                };


class clientEdit extends Component{
  constructor(props) {
    super(props);
    this._onChangeCIIU = this._onChangeCIIU.bind(this);
    this._submitEditClient = this._submitEditClient.bind(this);

    this.state = {
      styleCIIU: {},
      styleSubCIIU: {},
      styleReportVirtual: {},
      styleExtractVirtual: {},
      styleAdress: {},
      styleTelephone: {},
      styleAnnualSales: {},
      styleAssets: {},
      styleHabilities: {},
      styleOperationIncome: {},
      styleNonOperationIncome: {},
      styleExpenses: {},
      styleDateSalesAnnuals: {},
      styleMarcGeren: {},
      styleJustifyNonGeren: {},
      styleCentroDecision: {},
      styleNecesitaLME: {},
      styleJustifyNonLME: {},
    }
  }

  _onchangeValue(type, val){
    switch (type) {
      case "adress":
        var {fields: {adress}} = this.props
        adress.onChange(val);
        this.setState({ styleAdress: {} });
        break;

      case "telephone":
        var {fields: {telephone}} = this.props
        telephone.onChange(val);
        this.setState({ styleTelephone: {} });
        break;

    }
  };

  _onChangeValueList(type, val){
    switch (type) {

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

      case "marcGeren":
        var {fields: {marcGeren}} = this.props
        marcGeren.onChange(val);
        this.setState({ styleMarcGeren: {} });
        break;

      case "justifyNonGeren":
        var {fields: {justifyNonGeren}} = this.props
        justifyNonGeren.onChange(val);
        this.setState({ styleJustifyNonGeren: {} });
        break;

      case "centroDecision":
        var {fields: {centroDecision}} = this.props
        centroDecision.onChange(val);
        this.setState({ centroDecision: {} });
        break;

      case "necesitaLME":
        console.log("val",val);
        var {fields: {necesitaLME}} = this.props
        necesitaLME.onChange(val);
        console.log("necesitaLME",necesitaLME);
        this.setState({ styleNecesitaLME: {} });
        break;

      case "justifyNonLME":
        var {fields: {justifyNonLME}} = this.props
        justifyNonLME.onChange(val);
        this.setState({ styleJustifyNonLME: {} });
        break;

      case "justifyExClient":
        var {fields: {justifyExClient}} = this.props
        justifyExClient.onChange(val);
        break;

      default:
        break;
    }
  };

  componentWillMount(){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      } else {
        var { fields: {reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU,
                 adress, telephone, district, annualSales, assets, liabilities, operatingIncome,
               nonOperatingIncome, expenses, dateSalesAnnuals}
             } = this.props;
        idCIIU.onChange(infoClient.ciiu);
      }
    }
  }

  _submitEditClient(formData){
    const {reportVirtual, extractsVirtual, marcGeren, idCIIU, idSubCIIU,
           adress, telephone, district, annualSales, assets, liabilities, operatingIncome,
           nonOperatingIncome, expenses, dateSalesAnnuals, justifyNonGeren, centroDecision,
           necesitaLME, justifyNonLME, justifyExClient } = formData;
    var styleError = {borderColor: "red"};

    var error = false;
    if( reportVirtual === null || reportVirtual === undefined || _.isEmpty(reportVirtual) ){
      error = true;
      this.setState({
        styleReportVirtual: styleError
      })
    }
    if( extractsVirtual === null || extractsVirtual === undefined || _.isEmpty(extractsVirtual) ){
      error = true;
      this.setState({
        styleExtractVirtual: styleError
      })
    }
    console.log("idCIIU", idCIIU);
    if( idCIIU === null || idCIIU === undefined || _.isEmpty(idCIIU) ){
      error = true;
      this.setState({
        styleCIIU: styleError
      })
    }
    if( idSubCIIU === null || idSubCIIU === undefined || _.isEmpty(idSubCIIU) ){
      error = true;
      this.setState({
        styleSubCIIU: styleError
      })
    }
    console.log("adress", adress);
    if( adress === null || adress === undefined || _.isEmpty(adress) ){
      error = true;
      this.setState({
        styleAdress: styleError
      })
    }
    if( telephone === null || telephone === undefined || _.isEmpty(telephone) ){
      error = true;
      this.setState({
        styleTelephone: styleError
      })
    }
    if( annualSales === null || annualSales === undefined || _.isEmpty(annualSales) ){
      error = true;
      this.setState({
        styleAnnualSales: styleError
      })
    }
    if( assets === null || assets === undefined || _.isEmpty(assets) ){
      error = true;
      this.setState({
        styleAssets: styleError
      })
    }
    if( liabilities === null || liabilities === undefined || _.isEmpty(liabilities) ){
      error = true;
      this.setState({
        styleLiabilities: styleError
      })
    }
    if( operatingIncome === null || operatingIncome === undefined || _.isEmpty(operatingIncome) ){
      error = true;
      this.setState({
        styleOperatingIncome: styleError
      })
    }
    if( nonOperatingIncome === null || nonOperatingIncome === undefined || _.isEmpty(nonOperatingIncome) ){
      error = true;
      this.setState({
        styleNonOperatingIncome: styleError
      })
    }
    if( expenses === null || expenses === undefined || _.isEmpty(expenses)){
      error = true;
      this.setState({
        styleExpenses: styleError
      })
    }
    if( dateSalesAnnuals === null || dateSalesAnnuals === undefined || _.isEmpty(dateSalesAnnuals) ){
      error = true;
      this.setState({
        styleDateSalesAnnuals: styleError
      })
    }
    if( marcGeren === null || marcGeren === undefined || _.isEmpty(marcGeren) ){
      error = true;
      this.setState({
        styleMarcGeren: styleError
      })

      if( justifyNonGeren === null || justifyNonGeren === undefined || _.isEmpty(justifyNonGeren) ){
        error = true;
        this.setState({
          styleJustifyNonGeren: styleError
        })
      }
      if( justifyNonLME === null || justifyNonLME === undefined || _.isEmpty(justifyNonLME) ){
        error = true;
        this.setState({
          styleJustifyNonLME: styleError
        })
      }
    }
    if( justifyExClient === null || justifyExClient === undefined || _.isEmpty(justifyExClient) ){
      error = true;
      this.setState({
        styleJustifyExClient: styleError
      })
    }
  };

  _onChangeCIIU(val){
    var {fields: {idCIIU,idSubCIIU}} = this.props
    idCIIU.onChange(val);
    this.setState({ styleCIIU: {} });
  };

  _onChangeSubCIIU(val){
    var {fields: {idSubCIIU}} = this.props;
    idSubCIIU.onChange(val);
  };

  render(){
    var { fields: {combo, reportVirtual, extractsVirtual, marcGeren, necesitaLME, idCIIU, idSubCIIU, justifyNonLME,
             adress, telephone, district, annualSales, assets, liabilities, operatingIncome, justifyExClient,
           nonOperatingIncome, expenses, dateSalesAnnuals},
           error, handleSubmit, clientInformacion} = this.props
    var infoClient = clientInformacion.get('responseClientInfo');
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
                <textarea
                  type="text"
                  className="form-control"
                  style={{height: "60px !important", minHeight: "26px !important", width:"97%"}}
                  placeholder="Ingrese la descripción"
                  value={infoClient.description}
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
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>CIIU (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <ComboBox {...propsComboBox} {...combo}/>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>Sector</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {idCIIU.value === undefined ? infoClient.sector : idCIIU.value.economicSector}
                </p>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>SUBCIIU (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectSubCIIU
                  onChange={val => this._onChangeSubCIIU(val)}
                  store={idSubCIIU.id}
                  defaultValue={infoClient.subCiiu}
                  styles={style}
                  parentId={idCIIU.value === undefined ? infoClient.ciiu : idCIIU.value.id}/>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>SUBSECTOR</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {idSubCIIU.value === undefined ? infoClient.subSector : idSubCIIU.value.economicSubSector}
                </p>
              </dt>
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
              <dt style={{paddingRight: "30px"}}>
                <textarea
                  type="text"
                  className="form-control textAreaDataValue"
                  onChange={val => this._onchangeValue("adress", val)}
                  style={this.state.styleAdress}
                  placeholder="Ingrese la dirección"
                  />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>País (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Departamento(</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Ciudad(</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "10px 10px 10px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Barrio</span></dt>
              <dt><input
                type="text"
                className="form-control"
                style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                placeholder="Ingrese el barrio"
              /></dt>
            </Col>
            <Col xs={10} md={4} lg={4} style={{paddingRight: "50px"}}>
              <dt>
                <span>Teléfono (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("telephone", val)}
                  style={this.state.styleTelephone}
                  styleTelephone
                  placeholder="Ingrese el teléfono"
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 40px 20px 20px"}}>
            <Col xs={12} md={8} lg={8}>
              <dt>
                <span>¿Desea recibir su reporte de costos consolidado de forma virtual? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectYesNo
                  onChange={val => this._onChangeValueList("reporteVirtual", val)}
                  styles={this.state.styleReportVirtual}
                />
              </dt>
            </Col>
            <Col xs={12} md={8} lg={8}>
              <dt>
                <span>¿Desea consultar sus extractos de forma virtual? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectYesNo
                  onChange={val => this._onChangeValueList("extractsVirtual", val)}
                  styles={this.state.styleExtractVirtual}
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
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Ventas anuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("annualSales", val)}
                  styles={this.state.styleAnnualSales}
                  placeholder="Ingrese las ventas anuales"
                  value={infoClient.annualSales}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Fecha de ventas anuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("dateSalesAnnuals", val)}
                  styles={this.state.styleDateSalesAnnuals}
                  placeholder="Ingrese el nit principal"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Activos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("assets", val)}
                  styles={this.state.styleAssets}
                  placeholder="Ingrese los activos"
                  value={infoClient.assets}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Pasivos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("liabilities", val)}
                  styles={this.state.styleLiabilities}
                  value={infoClient.liabilities}
                  placeholder="Ingrese los pasivos"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Ingresos operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("operatingIncome", val)}
                  styles={this.state.styleOperationIncome}
                  value={infoClient.operatingIncome}
                  placeholder="Ingrese los ingresos operacionales"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Ingresos no operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                  styles={this.state.styleNonOperationIncome}
                  value={infoClient.nonOperatingIncome}
                  placeholder="Ingrese los ingresos no operacionales"
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Egresos (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control inputEditClient"
                  onChange={val => this._onChangeValue("expenses", val)}
                  styles={this.state.styleExpenses}
                  value={infoClient.expenses}
                  placeholder="Ingrese los egresos"
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
                <span>Marca gerenciamiento (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectYesNo
                  onChange={val => this._onChangeValueList("marcGeren", val.id)}
                  styles={this.state.styleMarcGeren}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Centro de decisión (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectYesNo
                  onChange={val => this._onChangeValueList("centroDecision", val.id)}
                  styles={this.state.styleCentroDecision}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "25px"}}>
              <dt>
                <span>¿Necesita LME? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectYesNo
                  onChange={val => this._onChangeValueList("necesitaLME", val.id)}
                  styles={this.state.styleCentroDecision}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Grupo económico/relación</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Nit principal</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  {infoClient.expenses}
                </p>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            {!marcGeren.value &&
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Justificación no gerenciamiento</span>
                </dt>
                <dt>
                  <SelectTypeDocument
                    onChange={val => this._onChangeValueList("justifyNonGeren", val)}
                    styles={this.state.styleJustifyNonGeren}
                  />
                </dt>
              </Col>
            }
            {!necesitaLME.value &&
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Justificación no necesita LME</span>
                </dt>
                <dt>
                  <SelectTypeDocument
                    onChange={val => this._onChangeValueList("justifyNonLME", val)}
                    styles={this.state.styleJustifyNonLME}
                  />
                </dt>
              </Col>
            }
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Justificación excliente</span>
              </dt>
              <dt>
                <SelectTypeDocument
                  onChange={val => this._onChangeValueList("justifyExClient", val)}
                />
              </dt>
            </Col>
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
          <Row style={{padding: "0px 5px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
                        <span className="section-title">Nota 1</span>
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
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Tipo de nota</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={8} lg={8}>
              <dt>
                <span>Descripción de la nota</span>
              </dt>
              <dt>
                <textarea
                  type="text"
                  className="form-control"
                  style={{height: "60px !important", minHeight: "26px !important", width:"95%"}}

                  placeholder="Ingrese la descripción de la nota"
                  />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <dt>
                <button type="button" style={{padding: "8px", border: "1px solid", width: "98.5%", backgroundColor: "#E7ECED",
                color: "#6E6E6E", fontWeight: "bold", borderRadius: "4px"}}>Añadir Nota</button>
              </dt>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12} style={{paddingTop: "50px"}}>
              <div style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0", width:"100%", marginBottom: "0", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
                <button className="btn"
                    style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed"}}
                    type="submit">
                  <span style={{color: "#FFFFFF", padding:"10px"}}>Actualizar</span>
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

function mapStateToProps({clientInformacion},ownerProps) {
  return {
    clientInformacion
  };
}
export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(clientEdit);
