import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ListaObjetos from "../listaObjetos/ListaObjetos";

import styleListaobjetos from "../listaObjetos/styleListaObjetos.scss";

class SectionOpportunitiesWeaknesses extends Component {
  render() {
    const { visual } = this.props;
    const ayudaOportunidades = `En el campo que le aparecera al darle click en el icono de + debera ingresar las oportunidades externas con el fin ...`;
    const ayudaDebilidades = `En el campo que le aparecera al darle click en el icono de + debera ingresar las debilidades internas del cliente con el fin ...`;

    return (
      <div>
        {visual && (
          <Row style={{ padding: "0px 10px 10px 20px" }}>
            <Col xs={12} md={12} lg={12}>
              <div className="header-component">
                <div className="line-topComponent" />
                <i className="lightbulb icon" style={{ fontSize: "25px" }} />
                <span className="title-middle">
                  Oportunidades y debilidades
                </span>
              </div>
            </Col>
          </Row>
        )}
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "50%" }}>
            <ListaObjetos
              titulo="Oportunidades"
              ayuda={ayudaOportunidades}
              visual={visual}
            />
          </div>
          <div style={{ width: "50%" }}>
            <ListaObjetos
              titulo="Debilidades"
              ayuda={ayudaDebilidades}
              visual={visual}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SectionOpportunitiesWeaknesses;
