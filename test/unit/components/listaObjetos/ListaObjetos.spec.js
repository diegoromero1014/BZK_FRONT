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

  // caso de prueba : que se renderize el componente
  it("should render component", () => {
    itRenders(<ListaObjetos {...defaultProps} />);
  });

  // caso de prueba que renderize los componentes que se importan
  it("should render imports components", () => {
    itRenders(<Row />);
    itRenders(<Col />);
    itRenders(<ToolTip />);
    itRenders(<SweetAlert />);
  });

  // caso de prueba para validar que si se renderice el titulo del componente
  it("render the title wrapper listaObjetos", () => {
    const wrapper = shallow(<ListaObjetos />);
    expect(wrapper.find(".title-component")).to.have.length(1);
  });

  // tercer caso de prueba que se rendericen elementos dependiendo de las props que se le inyecten
  // cuarto caso de prueba que se rendericen elementos dependiendo del valor de las variables del state

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

  // caso de prueba para el metodo modificarObjeto, cuando entra en el if
  it("onClick in modificarObjeto expect me to edit the object", () => {
    const objeto = {
      id: 1,
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const listaObjetos = [
      {
        id: 1,
        texto: "Lorem ipsum dolor sit amet, consectetur "
      }
    ];
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      objetos: listaObjetos
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().campoVacio).to.equal(false);
    expect(wrapper.state().campoObjeto).to.equal(false);
    expect(wrapper.state().switchGuardarEditar).to.equal(false);
    expect(wrapper.state().stylePlus).to.equal(false);
  });

  // caso de prueba para el metodo modificarObjeto, cuando no entra al else.
  it("onClick in modificarObjeto expect me not to edit the object", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto: { id: 1, texto: "" }
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().campoVacio).to.equal(true);
  });

  // caso de pruebas para el metodo agregarObjetoLista
  it("onClick in agregarObjetoLista agregue un objeto", () => {
    const id = (Math.random() * 10000).toFixed();
    const objeto = {
      id: "",
      texto: "test agregar objeto"
    };
    objeto.id = id;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      campoVacio
    });
    wrapper.instance().agregarObjetoLista();
    wrapper.instance().cerrarCampoObjeto();
    // expect(wrapper.state().objetos).to.have([
    //   ...wrapper.state().objetos,
    //   objeto
    // ]);
    expect(wrapper.state().campoObjeto).to.equal(false);
  });

  it("onClick in agregarObjetoLista con un objeto vacio", () => {
    const id = (Math.random() * 10000).toFixed();
    const objeto = {
      id: "",
      texto: ""
    };
    objeto.id = id;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().agregarObjetoLista();
    expect(wrapper.state().campoVacio).to.equal(true);
  });

  // caso de prueba para el metodo eliminarObjeto
  it("onClick in eliminarObjeto se espera que elimine el objeto", () => {
    const objeto = {
      id: 1,
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().eliminarObjeto(objeto.id);
    expect(wrapper.state().modalEliminar).to.equal(false);
  });

  // caso de prueba para la funcion newObject
  it("test newObjeto function", () => {
    const event = {
      target: {
        name: "texto",
        value: "texto que describe el objeto"
      }
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().newObjeto(event);
  });

  // caso de prueba if para redefinir el titulo
  // it("test if where the component title is Oportunidades", () => {
  //   defaultProps.titulo = "Oportunidades";
  //   const wrapper = shallow(<ListaObjetos {...defaultProps} />);
  //   console.log(wrapper.props().titulo);

  //   expect(wrapper.props().titulo).to.equal("Oportunidades");
  // });
});
