import React, { Component } from "react";
import ListaObjetos from "../listaObjetos/ListaObjetos";

class SectionOpportunitiesWeaknesses extends Component {
  render() {
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "50%" }}>
          <ListaObjetos titulo="Oportunidades" />
        </div>
        <div style={{ width: "50%" }}>
          <ListaObjetos titulo="Debilidades" />
        </div>
      </div>
    );
  }
}

export default SectionOpportunitiesWeaknesses;