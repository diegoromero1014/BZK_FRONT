import React, {Component, PropTypes} from 'react';

class ActividadEconomica extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {infoClient} = this.props;
    return(
      <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b"}}>
        <table>
        <tbody>
          <tr>
            <td>
              <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <i className="icon-segmen" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Actividad económica</span>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>CIIU</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Sector</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>SubCIIU</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Subsector</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.ciiu}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.sector}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.subCiiu}</td>
            <td style={{width: "25%", verticalAlign: "initial"}}>{infoClient.subSector}</td>
          </tr>
        </tbody>
      </table>
    </div>
    );
  }
}

ActividadEconomica.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default ActividadEconomica;
