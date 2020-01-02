import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ListaObjetos from "../listaObjetos/ListaObjetos";

class SectionOpportunitiesWeaknesses extends Component {
  render() {
    const { visual } = this.props;

    return (
      <div>
        {visual && (
          <Row style={{ padding: "0px 10px 10px 20px" }}>
            <Col xs={12} md={12} lg={12}>
              <div
                style={{
                  fontSize: "25px",
                  color: "#CEA70B",
                  marginTop: "5px",
                  marginBottom: "5px"
                }}
              >
                <div
                  className="tab-content-row"
                  style={{
                    borderTop: "1px dotted #cea70b",
                    width: "99%",
                    marginBottom: "10px"
                  }}
                />
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
            <ListaObjetos titulo="Oportunidades" visual={this.props.visual} />
          </div>
          <div style={{ width: "50%" }}>
            <ListaObjetos titulo="Debilidades" visual={this.props.visual} />
          </div>
        </div>
      </div>
    );
  }
}

export default SectionOpportunitiesWeaknesses;
