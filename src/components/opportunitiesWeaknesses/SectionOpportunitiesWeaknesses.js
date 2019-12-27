import React, { Component } from "react";
import AñadirListaObjetos from "../listaObjetos/AñadirListaObjetos";

class SectionOpportunitiesWeaknesses extends Component {
  render() {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "50%" }}>
          <AñadirListaObjetos titulo="Oportunidades" />
        </div>
        <div style={{ width: "50%" }}>
          <AñadirListaObjetos titulo="Debilidades" />
        </div>
      </div>
    );
  }
}

export default SectionOpportunitiesWeaknesses;