import React from "react";
import ListaObjetos from "../../../../src/components/listaObjetos/ListaObjetos";
import { Row, Col } from "react-flexbox-grid";
import { mount, render, shallow, configure } from "enzyme";
import ToolTip from "../../../../src/components/toolTip/toolTipComponent";
import SweetAlert from "../../../../src/components/sweetalertFocus";

describe("Unit tests of the listaObjetos.js component", () => {
  let defaultState = {
    objeto: {
      id: "",
      texto: ""
    },
    campoObjeto: false,
    campoVacio: false,
    idObjetoEliminar: "",
    modalEliminar: false,
    switchGuardarEditar: false,
    stylePlus: false
  };

  let defaultProps = {
    titulo: "",
    ayuda: "",
    visual: ""
  };

  // pimer caso de prueba : que se renderize el componente
  it("should render component", () => {
    itRenders(<ListaObjetos {...defaultProps} />);
  });

  // segundo caso de prueba que renderize los componentes que se importan
  it("should render <Row/> component", () => {
    itRenders(<Row />);
  });

  it("should render <Col/> component", () => {
    itRenders(<Col />);
  });

  it("should render <ToolTip/> component", () => {
    itRenders(<ToolTip />);
  });

  it("should render <SweetAlert/> component", () => {
    itRenders(<SweetAlert />);
  });

  // tercer caso de prueba que se rendericen elementos dependiendo de las props que se le inyecten
  // cuarto caso de prueba que se rendericen elementos dependiendo del valor de las variables del state

  it("render the title wrapper listaObjetos", () => {
    const wrapper = shallow(<ListaObjetos />);
    expect(wrapper.find(".title-component")).to.have.length(1);
  });

  // caso de prueba para metodo abrirCampoObjetivo
  it("onClick in abrirCampoObjetivo should change campoObjeto state to true", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().abrirCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(true);
  });

  //caso de prueba para el metodo cerrarCampoObjetivo
  it("onClick in cerrarCampoObjetivo should change campoObjeto state to false", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().cerrarCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(false);
  });

  // caso de prieba para el medodo mostrarModalEliminar
  it("onClick in mostrarModalEliminar should change modalEliminar state to true", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().mostrarModalEliminar();
    expect(wrapper.state().modalEliminar).to.equal(true);
  });

  // caso de prueba para el metodo editarObjeto, abre campoobjetivo y pone el texto del objetivo en el textarea
  it("onClick in editarObjeto should change campoObjeto, switchGuardarEditar, stylePlus in the state to true", () => {
    const elemento = {
      id: 1343,
      texto: "texto de la oportunidad o debilidad"
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().editarObjeto(elemento);
    expect(wrapper.state().campoObjeto).to.equal(true);
    expect(wrapper.state().switchGuardarEditar).to.equal(true);
    expect(wrapper.state().stylePlus).to.equal(true);
  });

    // caso de prueba para el metodo modificarObjeto
    it("onClick in modificarObjeto se espera que edite el objeto", () => {
        const objeto = {
            id : 1343,
            texto : "texto test oportunidades debilidades",
        };
        const listaObjetos = [
          { id: 1343, texto: "texto test oportunidades debilidades" },
          { id: 1245, texto: "texto test oportunidades debilidades" },
          { id: 1478, texto: "texto test oportunidades debilidades" },
        ];

        const wrapper = shallow(<ListaObjetos {...defaultProps} />);
        wrapper.instance().modificarObjeto();
        expect(wrapper.state()).to.;

    });
});
