import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/selectTypeDocument/componentTypeDocument';
import SelectCIIU from '../selectsComponent/SelectCIIU/SelectCIIU';
import SelectSubCIIU from '../selectsComponent/SelectSubCIIU/SelectSubCIIU';
import {reduxForm} from 'redux-form';

const style = {
  width: "95%"
}

const fields = ["idCIIU", "idSubCIIU"];

class clientEdit extends Component{
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    if(window.localStorage.getItem('sessionToken') === ""){
      redirectUrl("/login");
    }else{
      if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
      }
    }
  }

  _submitEditClient(){

  };

  _onChangeCIIU(val){
    var {fields: {idCIIU}} = this.props
    idCIIU.onChange(val);
  };

  _onChangeSubCIIU(val){
    var {fields: {idSubCIIU}} = this.props
    idSubCIIU.onChange(val);
  };

  render(){
    const { fields: {idCIIU, idSubCIIU}, error, handleSubmit, clientInformacion} = this.props
    var infoClient = clientInformacion.get('responseClientInfo');
    console.log(infoClient);
    return(
      <div style={{marginTop: "10px"}}>
        <form onSubmit={handleSubmit(this._submitEditClient)}>
          <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          <Row style={{padding: "10px 10px 10px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt><span>Razón social (</span><span style={{color: "red"}}>*</span>)</dt>
              <dt><input
                type="text"
                className="form-control"
                style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                required
                placeholder="Ingrese la razón social del usuario"
                value={infoClient.clientName}
              /></dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectTypeDocument
                  styles={style}
                  defaultValue={infoClient.clientIdType}/>
              </dt>
            </Col>
            <Col xs={10} md={4} lg={4}>
              <dt>
                <span>Número de documento (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  placeholder="Ingrese el número de documento del usuario"
                  value={infoClient.clientIdNumber}
                />
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
                  required
                  placeholder="Ingrese la descripción"
                  value={infoClient.description}
                  />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={12} lg={12}>
            <table style={{width:"100%"}}>
              <tbody>
                <tr>
                  <td>
                    <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                      <i className="icon-segmen" style={{fontSize: "25px"}}></i>
                      <span className="title-middle"> Actividad económica</span>
                    </dl>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%"}}></div>
                  </td>
                </tr>
              </tbody>
            </table>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>CIIU</span>
              </dt>
              <dt>
                <SelectCIIU
                  onChange={val => this._onChangeCIIU(val)}
                  store={idCIIU.id}
                  defaultValue={infoClient.ciiu}
                  styles={style}/>
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
                <span>SUBCIIU</span>
              </dt>
              <dt>
                <SelectSubCIIU
                  onChange={val => this._onChangeSubCIIU(val)}
                  store={idSubCIIU.id}
                  defaultValue={infoClient.ciiu}
                  styles={style}
                  parentId={infoClient.ciiu}/>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>SUBSECTOR</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  CARNES FRIAS
                </p>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                        <i className="icon-top-chart-risk" style={{fontSize: "25px"}}></i>
                        <span className="title-middle"> Información de ubicación y correspondencia</span>
                      </dl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%"}}></div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <Col xs={12} md={12} lg={12}>
              <dt>
                <span>Dirección</span>
              </dt>
              <dt>
                <textarea
                  type="text"
                  className="form-control"
                  style={{height: "30px !important", minHeight: "26px !important", width:"97%"}}
                  required
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
                required
                placeholder="Ingrese el barrio"
              /></dt>
            </Col>
            <Col xs={10} md={4} lg={4}>
              <dt>
                <span>Teléfono</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  placeholder="Ingrese el teléfono"
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>¿Desea recibir su reporte de costos consolidado de forma virtual?</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>¿Desea consultar sus extractos de forma virtual?</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                        <i className="icon-address" style={{fontSize: "25px"}}></i>
                        <span className="title-middle"> Información financiera</span>
                      </dl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%"}}></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Ventas anuales</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  placeholder="Ingrese las ventas anuales"
                  value={infoClient.annualSales}
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Fecha de ventas anuales</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  placeholder="Ingrese el nit principal"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Activos</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  placeholder="Ingrese los activos"
                  value={infoClient.assets}
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Pasivos</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  value={infoClient.liabilities}
                  placeholder="Ingrese los pasivos"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Ingresos operacionales</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  value={infoClient.operatingIncome}
                  placeholder="Ingrese los ingresos operacionales"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Ingresos no operacionales</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  value={infoClient.nonOperatingIncome}
                  placeholder="Ingrese los ingresos no operacionales"
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Egresos</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  value={infoClient.expenses}
                  placeholder="Ingrese los egresos"
                />
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                        <i className="icon-address" style={{fontSize: "25px"}}></i>
                        <span className="title-middle"> Datos de conocimiento comercial</span>
                      </dl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%"}}></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Marca gerenciamiento</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Justificación no gerenciamiento</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Grupo económico/relación</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Nit principal</span>
              </dt>
              <dt>
                <input
                  type="text"
                  className="form-control"
                  style={{height: "22px !important", minHeight: "26px !important", width:"90%"}}
                  required
                  value={infoClient.expenses}
                  placeholder="Ingrese el nit principal"
                />
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Centro de decisión</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>¿Necesita LME?</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Justificación no necesita LME</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Justificación excliente</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
          </Row>
          <Row style={{padding: "0px 10px 10px 20px"}}>
            <Col xs={12} md={12} lg={12}>
              <table style={{width:"100%"}}>
                <tbody>
                  <tr>
                    <td>
                      <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                        <i className="icon-address" style={{fontSize: "25px"}}></i>
                        <span className="title-middle"> Notas</span>
                      </dl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%"}}></div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                  required
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
        </form>
      </div>
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
