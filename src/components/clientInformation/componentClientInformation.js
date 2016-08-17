import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from './actions';
import RaitingInternal from './ratingInternal';
import TabClientInfo from './tabClientInfo';
import {updateTitleNavBar} from '../navBar/actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import $ from 'jquery';
import ButtonTeamComponent from '../clientTeam/buttonTeamComponent';
import ButtonEconomicgroup from '../clientEconomicGroup/buttonClientEconomicGroup';

class ComponentClientInformation extends Component{
  constructor(props) {
     super(props);
     const {consultInfoClient} = this.props;
     consultInfoClient();
  }

  componentWillMount(){
    $(window).scrollTop(0);
    const {updateTitleNavBar} = this.props;
    updateTitleNavBar("Mis clientes");
  }

  render(){
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    const {aecStatus} = infoClient;
    var showAECNoAplica = false;
    var showAECNivel = true;
    if( aecStatus === undefined || aecStatus === null ){
      showAECNoAplica = true;
      showAECNivel = false;
    }
    return(
      <div>
        <header className="header-client-detail" style={{boxShadow: "-3px 2px 5px 0 rgba(0, 0, 0, 0.2)"}}>
          <Row>
            <Col xs={11} sm={11} md={11} lg={11}>
    					<div className="company-detail" style={{marginLeft: "20px", marginRight: "20px"}}>
    						<div>
    							<h3 style={{wordBreak:'break-all'}} className="inline title-head">
    								{infoClient.clientName}
    							</h3>
                  {infoClient.isProspect &&
                    <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px"}}
                      className="label label-important bounceIn animated prospect" >Prospecto</span>
                  }
                  {showAECNivel &&
                    <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#ec5f48"}}
                      className="label label-important bounceIn animated aec-status" >{aecStatus}</span>
                  }
                  {showAECNoAplica &&
                    <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#3498db"}}
                      className="label label-important bounceIn animated aec-normal" >AEC: No aplica</span>
                  }
    						</div>
                <div style={{width: "100%"}}>
                  <table style={{width: "100%"}}>
                    <thead>
                      <tr>
                        <th style={{fontWeight: "bold", color: "#4C5360"}}>Tipo de documento</th>
                        <th style={{fontWeight: "bold", color: "#4C5360"}}>Número de documento</th>
                        <th style={{fontWeight: "bold", color: "#4C5360"}}>Rol de negocio consolidado</th>
                        <th style={{fontWeight: "bold", color: "#4C5360"}}>Calificación interna</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{width: "25%", verticalAlign: "initial"}}>
            							<span style={{marginLeft: "0px"}}>{infoClient.clientNameType}</span>
                        </td>
                        <td style={{width: "25%", verticalAlign: "initial"}}>
                          <span style={{marginLeft: "0px"}}>{infoClient.clientIdNumber}</span>
                        </td>
                        <td style={{width: "25%", verticalAlign: "initial"}}>
                          <span style={{marginLeft: "0px"}}>{infoClient.relationshipStatusName}</span>
                        </td>
                        <td style={{width: "25%", verticalAlign: "initial"}}>
          								<span style={{marginLeft: "0px"}}><RaitingInternal valueRaiting={infoClient.internalRatingKey}/></span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="4">
                          <dl className="company-detail" style={{paddingTop: "15px"}}>
                            <dt><span style={{fontWeight: "bold", color: "#4C5360", marginLeft: "0px"}}>Breve descripción de la empresa</span></dt>
                            <dd style={{marginLeft: "0px"}}><p style={{wordBreak:'break-all'}}>{infoClient.description}</p></dd>
                          </dl>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
    					</div>
            </Col>
            <Col xs={1} md={1} lg={1}>
              <table style={infoClient.economicGroup !== null ? {height: '100%', width: '50%', float: 'right'} : {height: '50%', width: '50%', float: 'right'}}>
                <tbody>
                  <tr>
                    <td style={{marginTop: "0px", backgroundColor: "#E79C29", borderRadius: "0px"}}>
                      <ButtonTeamComponent />
                    </td>
                  </tr>
                  {infoClient.economicGroup &&
                    <tr>
                      <td style={{marginTop: "0px", backgroundColor: "#2671D7", borderRadius: "0px"}}>
                        <ButtonEconomicgroup />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </Col>
          </Row>
        </header>
        <TabClientInfo infoClient={infoClient}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultInfoClient,
    updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({clientInformacion, navBar},ownerProps) {
  return {
    clientInformacion,
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentClientInformation);
