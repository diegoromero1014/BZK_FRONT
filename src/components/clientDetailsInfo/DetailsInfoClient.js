import React, {Component, PropTypes} from 'react';
import ActividadEconomica from './ActividadEconomica';
import UbicationCorrespondence from './UbicationCorrespondence';
import InfoFinanciera from './InfoFinanciera';
import DataComercial from './DataComercial';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Notas from './Notas';
import {connect} from 'react-redux';
import moment from 'moment';

class DetailsInfoClient extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    const {login} = this.props;
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _mapNoteItems(item, idx){
    return <Notas
        typeOfNoteKey={item.typeOfNoteKey}
        note={item.note}
        index={idx+1}
    />
  }

  render(){
    const {infoClient, menuState} = this.props;
    var actualizationDate = moment(infoClient.actualizationDate).locale('es');
    var actualizationDateString = actualizationDate.format("DD") + " " + actualizationDate.format("MMM") + " " + actualizationDate.format("YYYY");
    var {notes} = infoClient;
    if( notes === undefined || notes === null ){
      notes = [];
    }
    return(
      <div style={{width: "100%", marginTop: "10px", marginBottom: "70px"}}>
        <table style={{width: "100%", paddingTop: "10px"}}>
          <thead>
            <tr>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Entidad/Línea de negocio</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Segmento</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Subsegmento</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Grupo de riesgo</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "25%", verticalAlign: "initial"}}>
                <span style={{marginLeft: "0px"}}>{infoClient.lineOfBusinessKeys}</span>
              </td>
              <td style={{width: "25%", verticalAlign: "initial"}}>
                <span style={{marginLeft: "0px"}}>{infoClient.segmentKey}</span>
              </td>
              <td style={{width: "25%", verticalAlign: "initial"}}>
                <dl className="company-detail-dl">
                  <dd style={{marginLeft: "0px"}}>{infoClient.subSegmentKey}</dd>
                </dl>
              </td>
              <td style={{width: "25%", verticalAlign: "initial"}}>
                <span style={{marginLeft: "0px"}}>{infoClient.riskGroup}</span>
              </td>
            </tr>
            <tr>
              <td>
                <dl className="company-detail">
                  <dt><span style={{fontWeight: "bold", color: "#4C5360", marginLeft: "0px"}}>Fecha de actualización</span></dt>
                  <dd style={{marginLeft: "0px"}}>{actualizationDateString}</dd>
                </dl>
              </td>
              <td>
                <dl className="company-detail">
                  <dt><span style={{fontWeight: "bold", color: "#4C5360", marginLeft: "0px"}}>Estado</span></dt>
                  <dd style={{marginLeft: "0px"}}>{infoClient.clientStatusKey}</dd>
                </dl>
              </td>
            </tr>
          </tbody>
        </table>

        <ActividadEconomica infoClient={infoClient}/>
        <UbicationCorrespondence infoClient={infoClient}/>
        <InfoFinanciera infoClient={infoClient}/>
        <DataComercial infoClient={infoClient}/>
        <div className="tab-content-row" style={{marginTop: "30px",borderTop: "1px dotted #cea70b"}}>
          <table>
            <tbody>
              <tr>
                <td>
                  <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                    <i className="icon-address" style={{fontSize: "25px"}}></i>
                    <span className="title-middle"> Notas</span>
                  </dl>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {notes.map(this._mapNoteItems)}
      </div>
    );
  }
}

DetailsInfoClient.PropTypes = {
  infoClient: PropTypes.object.isRequired
}


function mapStateToProps({navBar}){
  return {
    menuState: navBar.get('status')
  };
}

export default connect(mapStateToProps)(DetailsInfoClient);
