import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import { formatCurrency } from '../../actionsGlobal';

class InfoFinanciera extends Component{

  constructor(props){
    super(props);
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
      <div className="tab-content-row">

      <table style={{width: "100%"}}>
          <thead>
            <tr>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ventas anuales</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Activos</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Pasivos</span></th>
              <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ingresos operacionales mensuales</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.annualSales)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.assets)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.liabilities)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.operatingIncome)}</td>
            </tr>
          </tbody>
        </table>
        <table style={{width: "100%", marginTop: "15px"}}>
          <thead>
          <tr>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ingresos no operacionales mensuales</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Egresos mensuales</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Fecha de ventas anuales</span></th>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}></span></th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.nonOperatingIncome)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{formatCurrency(infoClient.expenses)}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}>{salesActualizationDateString}</td>
              <td style={{width: "25%", verticalAlign: "initial"}}></td>
            </tr>
          </tbody>
        </table>
        <table style={{width: "100%", marginTop: "15px"}}>
          <thead>
          <tr>
            <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Detalle de ingresos no operacionales u originados en actividades diferente a la principal</span></th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{width: "100%", verticalAlign: "initial"}}>{infoClient.detailNonOperatinIncome}</td>
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
