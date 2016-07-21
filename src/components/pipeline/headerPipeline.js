import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RaitingInternal from '../clientInformation/ratingInternal';
import _ from 'lodash';

class CreatePipeline extends Component {

  render() {
    const {clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    const {aecStatus} = infoClient;
    var showAECNoAplica = false;
    var showAECNivel = true;
    if( aecStatus === undefined || aecStatus === null ) {
      showAECNoAplica = true;
      showAECNivel = false;
    }
    return(
      <div style={{backgroundColor: "#FFFFFF", width: "100%", marginTop: "0px", paddingTop:"10px"}}>
        <header className="header-client-detail" >
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
              <div style={{width: "150px", display: "inline-flex"}}>
                <span style={{marginLeft: "10px"}}><RaitingInternal valueRaiting={infoClient.internalRatingKey} /></span>
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

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePipeline);
