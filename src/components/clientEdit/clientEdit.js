import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from '../clientInformation/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import SelectTypeDocument from '../selectsComponent/SelectTypeDocument/ComponentTypeDocument';

const style = {
  width: "95%"
}

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

  render(){
    const {clientInformacion} = this.props;
    var infoClient = clientInformacion.get('responseClientInfo');
    return(
      <div style={{marginTop: "10px"}}>
        <form>
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
              /></dt>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <dt>
                <span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
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
                <SelectTypeDocument styles={style}/>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>Sector</span>
              </dt>
              <dt>
                <p style={{fontWeight: "normal", marginTop: "8px"}}>
                  AGROINDUSTRIA
                </p>
              </dt>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <dt>
                <span>SUBCIIU</span>
              </dt>
              <dt>
                <SelectTypeDocument styles={style}/>
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
                        <i className="icon-segmen" style={{fontSize: "25px"}}></i>
                        <span className="title-middle">Información de ubicación y correspondencia</span>
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
          <Row style={{padding: "0px 10px 20px 30px"}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(clientEdit);
