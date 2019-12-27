import React from "react";
import AñadirListaObjetos from "../listaObjetos/AñadirListaObjetos";

const SectionOpportunitiesWeaknesses = () => {
  
  return (
    <div style={{width: "100%", display: "flex"}}>
      <div style={{width: "50%"}}>
        <AñadirListaObjetos titulo="Oportunidades" />
      </div>
      <div  style={{width: "50%"}}>
        <AñadirListaObjetos titulo="Debilidades"/>
      </div>
    </div>
  );
};

export default SectionOpportunitiesWeaknesses;
