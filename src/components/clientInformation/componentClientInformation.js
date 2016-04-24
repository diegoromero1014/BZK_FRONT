import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {consultInfoClient} from './actions';
import RaitingInternal from './ratingInternal';
import TabClientInfo from './tabClientInfo';

class ComponentClientInformation extends Component{
  constructor(props) {
      super(props);
      const {consultInfoClient} = this.props;
      consultInfoClient();
  }

  render(){
    const {clientInformacion} = this.props;
    var {aecStatus} = clientInformacion;
    var showAECNoAplica = false;
    var showAECNivel = true;
    if( aecStatus === undefined || aecStatus === null ){
      showAECNoAplica = true;
      showAECNivel = false;
    }
    var infoClient = clientInformacion.get('responseClientInfo');
    return(
      <div>
        <header className="header-client-detail" style={{boxShadow: "-3px 2px 5px 0 rgba(0, 0, 0, 0.2)"}}>
  					<div className="company-detail" style={{marginLeft: "20px", marginRight: "20px"}}>
  						<div>
  							<h3 className="inline title-head">
  								{infoClient.clientName}
  							</h3>
                {infoClient.isProspect &&
                  <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px"}}
                    className="label label-important bounceIn animated prospect" >Prospecto</span>
                }
                {showAECNivel &&
                  <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#ec5f48"}}
                    className="label label-important bounceIn animated aec-status" >Nivel: {aecStatus}</span>
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
                          <dd style={{marginLeft: "0px"}}>{infoClient.description}</dd>
                        </dl>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
  					</div>
  			</header>
        <TabClientInfo infoClient={infoClient}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultInfoClient
  }, dispatch);
}

function mapStateToProps({clientInformacion},ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentClientInformation);
