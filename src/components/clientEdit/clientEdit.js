import React, {Component} from 'react';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectYesNo from '../selectsComponent/selectYesNo/selectYesNo';
import {consultDataSelect, consultList, consultListWithParameter, consultListWithParameterUbication} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import NumberInput from 'react-number-input';
import _ from 'lodash';
import {reduxForm} from 'redux-form';

const valuesYesNo = [
  {'id': true, 'value': "Si"},
  {'id': false, 'value': "No"}
]

const fields = ["idCIIU", "idSubCIIU", "address", "country", "city", "province",
    "district", "telephone", "reportVirtual", "extractsVirtual", "annualSales", "dateSalesAnnuals",
    "liabilities", "assets", "operatingIncome", "nonOperatingIncome", "expenses", "marcGeren",
      "centroDecision", "necesitaLME", "groupEconomic", "justifyNonGeren", "justifyNonLME", "justifyExClient"];

class clientEdit extends Component{
  constructor(props) {
    super(props);
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
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      }else{
        const {consultList, consultDataSelect, clientInformacion, consultListWithParameterUbication} = this.props;
        var infoClient = clientInformacion.get('responseClientInfo');
        consultList(constants.CIIU);
        consultDataSelect(constants.FILTER_COUNTRY);
        if(infoClient.addresses !== null && infoClient.addresses !== '' && infoClient.addresses !== null){
          consultListWithParameterUbication(constants.FILTER_PROVINCE, infoClient.addresses[0].country);
          consultListWithParameterUbication(constants.FILTER_CITY, infoClient.addresses[0].province);
        }
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

  _submitEditClient(formData){
  };

  render(){
    const {
    fields: {descriptionCompany, idCIIU, idSubCIIU, address, country, city, province,
      district, telephone, reportVirtual, extractsVirtual, annualSales, dateSalesAnnuals,
      liabilities, assets, operatingIncome, nonOperatingIncome, expenses, marcGeren,
      centroDecision, necesitaLME, groupEconomic, justifyNonGeren, justifyNonLME, justifyExClient},
      error, handleSubmit, selectsReducer, clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
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
          <Row style={{padding: "0px 10px 20px 0px"}}>
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
              <dt><span>SubCIIU</span></dt>
              <ComboBox
                name="subCiiu"
                labelInput="SubCIIU"
                {...idSubCIIU}
                valueProp={'id'}
                textProp={'subCiiu'}
                data={selectsReducer.get('dataSubCIIU')}
                defaultValue={infoClient.subCiiu}
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
              <dt style={{paddingRight: "30px"}}>
                <textarea type="text"
                  style={{height: "30px !important", minHeight: "30px !important", width:"97%"}}
                  onChange={val => this._onchangeValue("adress", val)}
                  placeholder="Ingrese la dirección"
                  value={infoClient.addresses === undefined ? '' : infoClient.addresses[0].address}
                  />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 0px"}}>
            <Col xs={12} md={4} lg={4} >
              <div style={{paddingLeft: "20px", paddingRight: "10px", marginTop: "10px"}}>
                <dt><span>País</span></dt>
                <ComboBox
                  name="country"
                  labelInput="País"
                  onChange={val => this._onChangeCountry(val)}
                  value={country.value}
                  onBlur={country.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeCountry')}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].country}
                  />
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
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
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].province}
                  />
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div style={{paddingLeft: "20px", paddingRight: "15px", marginTop: "10px"}}>
                <dt><span>Ciudad</span></dt>
                <ComboBox
                  name="city"
                  labelInput="Ciudad"
                  {...city}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeCity')}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].city}
                  />
              </div>
            </Col>
          </Row>
          <Row style={{padding: "10px 30px 10px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Barrio</span></dt>
              <dt style={{marginRight:"10px"}}>
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
              <dt>
                <Input
                  name="txtTelefono"
                  type="number"
                  placeholder="Ingrese el teléfono"
                  defaultValue={infoClient.phoneNumber}
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
                <ComboBox
                  name="reportVirtual"
                  labelInput="Seleccione..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...reportVirtual}
                  defaultValue={infoClient.addresses === undefined ? '' : infoClient.addresses[0].isPrincipalAddress}
                />
              </dt>
            </Col>
            <Col xs={12} md={8} lg={8} style={{marginTop:"5px"}}>
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
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
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
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Fecha de ventas anuales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <Input
                  type="text"
                  onChange={val => this._onChangeValue("dateSalesAnnuals", val)}
                  placeholder="Ingrese el nit principal"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
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
                  style={{width: "100%", textAlign:"right"}}
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
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("liabilities", val)}
                  value={parseInt(infoClient.liabilities)}
                  placeholder="Ingrese los pasivos"
                  style={{width: "100%", textAlign:"right"}}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Ingresos operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  onChange={val => this._onChangeValue("operatingIncome", val)}
                  value={parseInt(infoClient.operatingIncome)}
                  placeholder="Ingrese los ingresos operacionales"
                  style={{width: "100%", textAlign:"right"}}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "40px"}}>
              <dt>
                <span>Ingresos no operacionales (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <NumberInput
                  format="0,000"
                  onChange={val => this._onChangeValue("nonOperatingIncome", val)}
                  value={parseInt(infoClient.nonOperatingIncome)}
                  placeholder="Ingrese los ingresos no operacionales"
                  style={{width: "100%", textAlign:"right"}}
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
                <NumberInput
                  format="0,000"
                  min={0}
                  onChange={val => this._onChangeValue("expenses", val)}
                  value={parseInt(infoClient.expenses)}
                  placeholder="Ingrese los egresos"
                  style={{width: "100%", textAlign:"right"}}
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
                <ComboBox
                  name="marcGeren"
                  labelInput="Seleccione..."
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
                <span>Centro de decisión (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <ComboBox
                  name="centroDecision"
                  labelInput="Seleccione..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...centroDecision}
                  defaultValue={infoClient.isDecisionCenter === undefined ? '' : infoClient.isDecisionCenter}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4} style={{paddingRight: "25px"}}>
              <dt>
                <span>¿Necesita LME? (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <ComboBox
                  name="necesitaLME"
                  labelInput="Seleccione..."
                  valueProp={'id'}
                  textProp={'value'}
                  data={valuesYesNo}
                  {...necesitaLME}
                  defaultValue={infoClient.isCreditNeeded === undefined ? '' : infoClient.isCreditNeeded}
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
                <SelectTypeDocument/>
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
                  <span>Justificación no gerenciamiento </span>
                </dt>
                <dt>
                  <SelectTypeDocument
                    onChange={val => this._onChangeValueList("justifyNonGeren", val)}
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
                <SelectTypeDocument/>
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
    consultListWithParameterUbication
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer},ownerProps) {
  return {
    clientInformacion,
    selectsReducer
  };
}
export default reduxForm({
  form: 'submitValidation',
  fields
}, mapStateToProps, mapDispatchToProps)(clientEdit);
