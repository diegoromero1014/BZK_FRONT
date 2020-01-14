import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ListaObjetos from "../listaObjetos/ListaObjetos";

class SectionOpportunitiesWeaknesses extends Component {

  state = {
    opportunities: null,
    weaknesses: null
  }

  componentDidMount() {
    this.setInfo();
  }

  setInfo = () => {
    const { infoClient } = this.props;
    this.setState({
      weaknesses: infoClient ? infoClient.clientDetailsRequest.weaknesses : [],
      opportunities: infoClient ? infoClient.clientDetailsRequest.opportunities : []
    })
  }

  render() {
    const { visual } = this.props;
    const ayudaOportunidades = `Factores externos que representan posibles ingresos para el cliente. Pueden ser: cambios en el sector económico. Normativas, movimiento de la competencia, tendencia de sus consumidores, mercados geográficos. economía, tendencias del mercado, benchmarks. `;
    const ayudaDebilidades = `Aspectos internos negativos del cliente que no le permiten  el crecimiento empresarial o que frenan el cumplimiento de sus objetivos y que debe controlarlos para superarlos. Pueden ser: Localizaciones, marca y reputación, idealización de los clientes, capital humano, tecnologías, canales, liderazgo, calidad del producto, situación financiera.`;

    return (
      <div>
        {visual && (
          <Row className='title-section' style={{ padding: "0px 10px 10px 20px" }}>
            <Col xs={12} md={12} lg={12}>
              <div className="header-component">
                <div className="line-topComponent" />
                <i className="lightbulb icon" style={{ fontSize: "25px" }} />
                <span className="title-middle">
                  Oportunidades y Debilidades
                </span>
              </div>
            </Col>
          </Row>
        )}
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "50%" }}>
            {this.state.opportunities && <ListaObjetos
              className='list-objects-opportunities'
              key="opportunities"
              titulo="Oportunidades"
              ayuda={ayudaOportunidades}
              visual={visual}
              icon="thumbs up outline icon"
              initialObjects={this.state.opportunities}
            />}
          </div>
          <div style={{ width: "50%" }}>
            {this.state.weaknesses && <ListaObjetos
              className='list-objects-weaknesses'
              key="weaknesses"
              titulo="Debilidades"
              ayuda={ayudaDebilidades}
              visual={visual}
              icon="thumbs down outline icon"
              initialObjects={this.state.weaknesses}
            />}
          </div>
        </div>
      </div>
    );
  }
}

export default SectionOpportunitiesWeaknesses;
