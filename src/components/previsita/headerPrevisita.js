import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import RaitingInternal from '../clientInformation/ratingInternal';
import SecurityMessageComponent from '../globalComponents/securityMessageComponent';

import { AEC_NO_APLIED } from '../../constantsGlobal';

class CreatePrevisita extends Component {

  render() {
    const { clientInformacion } = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    const { aecStatus } = infoClient;
    var showAECNoAplica = false;
    var showAECNivel = true;
    if (aecStatus === undefined || aecStatus === null || aecStatus === AEC_NO_APLIED) {
      showAECNoAplica = true;
      showAECNivel = false;
    }
    return (
      <div style={{ backgroundColor: "#FFFFFF", width: "100%" }}>
        <SecurityMessageComponent />
        <header className="header-client-detail" style={{ paddingTop: '10px' }}>
          <div className="company-detail" style={{ marginLeft: "20px", marginRight: "20px" }}>
            <div>
              <h3 style={{ wordBreak: 'keep-all' }} className="inline title-head">
                {infoClient.clientName}
              </h3>
              {infoClient.isProspect &&
                <span style={{ borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px" }}
                  className="label label-important bounceIn animated prospect" >Prospecto</span>
              }
              {showAECNivel &&
                <span style={{ borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#ec5f48" }}
                  className="label label-important bounceIn animated aec-status" >{aecStatus}</span>
              }
              {showAECNoAplica &&
                <span style={{ borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#3498db" }}
                  className="label label-important bounceIn animated aec-normal" >AEC: No aplica</span>
              }
              <div style={{ width: "150px", display: "inline-flex" }}>
                <span style={{ marginLeft: "10px" }}><RaitingInternal valueRaiting={infoClient.internalRatingKey} /></span>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({ clientInformacion }, ownerProps) {
  return {
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePrevisita);