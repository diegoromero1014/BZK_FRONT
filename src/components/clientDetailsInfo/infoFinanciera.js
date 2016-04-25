import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import numeral from 'numeral';

class InfoFinanciera extends Component{

  constructor(props){
    super(props);
  }

  formatCurrency(value) {
    if (isNaN(value)) {
    return '';
    }
    return numeral(value).format('0,000');
  }

  render(){
    const {infoClient} = this.props;
    var salesActualizationDateString = "";
    if( infoClient !== null && infoClient !== undefined ){
      if( infoClient.salesUpadateDate !== null && infoClient.salesUpadateDate !== "" &&
          infoClient.salesUpadateDate !== undefined ){
          var salesActualizationDate = moment(infoClient.salesUpadateDate).locale('es');
          salesActualizationDateString = salesActualizationDate.format("DD") + " " + salesActualizationDate.format("MMM") + " " + salesActualizationDate.format("YYYY");
      }
    }
    return(
      <div className="tab-content-row" style={{marginTop: "30px",borderTop: "1px dotted #cea70b"}}>
        <table>
        <tbody>
          <tr>
            <td>
              <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                <i className="suitcase icon" style={{fontSize: "25px"}}></i>
                <span className="title-middle"> Información financiera</span>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{width: "100%"}}>
          <thead>
            <tr>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ventas anuales</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Activos</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Pasivos</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ingresos operacionales</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.annualSales)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.assets)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.liabilities)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.operatingIncome)}</td>
            </tr>
          </tbody>
        </table>

        <table style={{width: "100%", marginTop: "15px"}}>
          <thead>
          <tr>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ingresos no operacionales</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Egresos</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Fecha de ventas anuales</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}></span></th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.nonOperatingIncome)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{this.formatCurrency(infoClient.expenses)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{salesActualizationDateString}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}></td>
            </tr>
          </tbody>
        </table>
    </div>
    );
  }
}

InfoFinanciera.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default InfoFinanciera;
