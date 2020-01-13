import React from "react";
import { ListaObjetos } from "../../../../src/components/listaObjetos/ListaObjetos";
import { Row, Col } from "react-flexbox-grid";
import { mount, render, shallow, configure } from "enzyme";
import ToolTip from "../../../../src/components/toolTip/toolTipComponent";
import SweetAlert from "../../../../src/components/sweetalertFocus";

let defaultProps = {
  dispatchUpdateElementFromList: sinon.fake(),
  initialObjects: [{ id: "", texto: "" }],
  titulo: "",
  ayuda: "",
  visual: ""
};

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

  it("should render component", () => {
    itRenders(<ListaObjetos {...defaultProps} />);
  });

  it("should render imports components", () => {
    itRenders(<Row />);
    itRenders(<Col />);
    itRenders(<ToolTip />);
    itRenders(<SweetAlert />);
  });

  it("render the title wrapper listaObjetos", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find(".title-component")).to.have.length(1);
  });

  it("onClick in abrirCampoObjetivo should change campoObjeto state to true", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().abrirCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(true);
  });

  it("onClick in cerrarCampoObjetivo should change campoObjeto state to false", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().cerrarCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(false);
  });

  it("onClick in mostrarModalEliminar should change modalEliminar state to true", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().mostrarModalEliminar();
    expect(wrapper.state().modalEliminar).to.equal(true);
  });

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

  it("onClick in modificarObjeto expect me not to edit the object", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto: { id: 1, texto: "" }
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().campoVacio).to.equal(true);
  });

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

  it("onClick in eliminarObjeto se espera que elimine el objeto", () => {
    const objeto = {
      id: 1,
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().eliminarObjeto(objeto.id);
    expect(wrapper.state().modalEliminar).to.equal(false);
  });

  it("test newObjeto function", () => {
    const event = {
      target: {
        name: "texto",
        value: "texto que describe el objeto"
      }
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().newObjeto(event);
    expect(wrapper.state().objeto.texto).to.equal(
      "texto que describe el objeto"
    );
  });

  // caso de prueba if para redefinir el titulo
  it("test if where the component title is Oportunidades", () => {
    defaultProps.titulo = "Oportunidades";

    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find(".title-component").text()).to.equal(
      "Oportunidades externas"
    );
  });

  it("test if where the component title is Debilidades", () => {
    defaultProps.titulo = "Debilidades";

    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find(".title-component").text()).to.equal(
      "Debilidades internas del cliente"
    );
  });

  it('when visual is false, the "mas" button is not displayed', () => {
    defaultProps.visual = false;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find("button[name='btn-agregar']")).to.have.length(0);
  });

  it('when visual is false, the "mas" button is displayed', () => {
    defaultProps.visual = true;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find("button[name='btn-agregar']")).to.have.length(1);
  });

  // it('when visual is false, the "mas" td is not displayed', () => {
  //   defaultProps.visual = false;
  //   const wrapper = shallow(<ListaObjetos {...defaultProps} />);
  //   expect(wrapper.find("td[name='td-edit']")).to.have.length(0);
  // });

  // it('when visual is false, the "mas" td is displayed', () => {
  //   defaultProps.visual = true;
  //   const wrapper = shallow(<ListaObjetos {...defaultProps} />);
  //   expect(wrapper.find("td[name='td-edit']")).to.have.length(1);
  // });

  // it("when campoVacio is true and switchGuardarEditar is true, render error message modificar", () => {
  //   const wrapper = shallow(<ListaObjetos {...defaultProps} />);
  //   wrapper.setState({
  //     objeto : {
  //       id : 1215,
  //       texto : ""
  //     }
  //     switchGuardarEditar: true
  //   });
  //   wrapper.instance().
  //   expect(wrapper.find("div[name='msjErrorModificar']")).to.have.length(1);
  // });

  // it("", () => {});
});
