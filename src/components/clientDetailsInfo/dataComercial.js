import React, {Component, PropTypes} from 'react';

class DataComercial extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {infoClient} = this.props;
    return(
      <div className="tab-content-row" style={{marginTop: "30px", borderTop: "1px dotted #cea70b"}}>
        <table>
        <tbody>
          <tr>
            <td>
              <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <i className="book icon" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Datos de conocimiento comercial</span>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Marca gerenciamiento</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Justificación no gerenciamiento</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Grupo económico/Relación</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>NIT principal</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.isManagedByRm ? 'Si' : 'No'}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.justificationForNoRMKey}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.economicGroupKey}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.nitPrincipal}</td>
          </tr>
        </tbody>
        </table>

        <table style={{width: "100%", marginTop: "15px"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>¿Necesita LME?</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Justificación no necesita LME</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Centro de decisión</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Justificación excliente</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.isCreditNeeded ? 'Si' : 'No'}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.justificationForCreditNeedKey}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.isDecisionCenter ? 'Si' : 'No'}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.justificationForLostClientKey}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

DataComercial.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default DataComercial;
