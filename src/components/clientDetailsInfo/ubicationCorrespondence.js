import React, {Component, PropTypes} from 'react';

class UbicationCorrespondence extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {infoClient} = this.props;
    var {addresses} = infoClient;
    if(addresses === null || addresses === undefined){
      addresses = [];
    } else {
      addresses = addresses[0];
    }
    return(
      <div className="tab-content-row" style={{marginTop: "40px",borderTop: "1px dotted #cea70b"}}>
        <table>
          <tbody>
            <tr>
              <td>
                <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "10px", marginBottom: "5px"}}>
                  <i className="browser icon" style={{fontSize: "25px"}}></i>
                  <span className="title-middle"> Información de ubicación y correspondencia</span>
                </dl>
              </td>
            </tr>
          </tbody>
        </table>
        <h3 style={{borderBottom: "solid 1px", marginTop: "10px"}}>Dirección sede principal</h3>
        <table style={{width: "100%"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Dirección</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>País</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Departamento</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ciudad</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.address}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.countryKey}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.provinceKey}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.cityKey}</td>
              </tr>
            </tbody>
          </table>

          <table style={{width: "100%", marginTop: "15px"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>¿Desea recibir su reporte de costos consolidado de forma virtual?</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Teléfono</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.isPrincipalAddress ? 'Si': 'No'}</td>
                <td style={{width: "25%", verticalAlign: "initial"}}>{addresses.phoneNumber}</td>
              </tr>
            </tbody>
          </table>

          <table style={{width: "100%", margin  Top: "15px"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>¿Desea consultar sus extractos de forma virtual?</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2" style={{width: "25%", verticalAlign: "initial"}}>{infoClient.isVirtualStatement  ? 'Si': 'No'}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

UbicationCorrespondence.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default UbicationCorrespondence;
