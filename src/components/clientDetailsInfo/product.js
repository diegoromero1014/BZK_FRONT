import React, { Component, PropTypes } from 'react';
import numeral from 'numeral';

class Product extends Component {

  constructor(props) {
    super(props);
  }

  formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    return numeral(value).format('0,000');
  }

  _mapForeignProducts(product, idx) {
    return <tr key={idx}>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{product.name}</td>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{product.typeKey}</td>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{product.number}</td>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{this.formatCurrency(product.averageMontlyAmount)}</td>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{product.coin}</td>
      <td style={{ widtd: "15%", verticalAlign: "initial" }}>{product.countryKey}</td>
      <td style={{ widtd: "10%", verticalAlign: "initial" }}>{product.city}</td>
    </tr>
  }

  render() {
    const { foreignProducts } = this.props;
    return (
      <div>
        <table className='table table-striped' style={{ width: "100%" }}>
          <tr>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Nombre</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Tipo</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Número</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Monto mensual</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Moneda</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>País</span></td>
            <td><span style={{ fontWeight: "bold", color: "#4C5360" }}>Ciudad</span></td>
          </tr>
            {foreignProducts.map(this._mapForeignProducts.bind(this))}
        </table>
      </div>
    );
  }
}

export default Product;
