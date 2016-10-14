import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';

class Product extends Component{

  constructor(props){
    super(props);
  }

  formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
    return '';
    }
    return numeral(value).format('0,000');
  }

  render(){
    const {name, type, num, averageMontlyAmount, coin, country, city, index} = this.props;
    return(
      <div>
        <h3 className="sub-header" style={{borderBottom: "solid 1px", marginTop: "10px"}}>Producto {index}</h3>
        <table style={{width: "100%"}}>
            <thead>
              <tr>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Nombre</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Tipo</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Número</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Monto mensual</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Moneda</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>País</span></th>
                <th><span style={{fontWeight: "bold", color: "#4C5360"}}>Ciudad</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: "15%", verticalAlign: "initial"}}>{name}</td>
                <td style={{width: "15%", verticalAlign: "initial"}}>{type}</td>
                <td style={{width: "15%", verticalAlign: "initial"}}>{num}</td>
                <td style={{width: "15%", verticalAlign: "initial"}}>{this.formatCurrency(averageMontlyAmount)}</td>
                <td style={{width: "15%", verticalAlign: "initial"}}>{coin}</td>
                <td style={{width: "15%", verticalAlign: "initial"}}>{country}</td>
                <td style={{width: "10%", verticalAlign: "initial"}}>{city}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

export default Product;
