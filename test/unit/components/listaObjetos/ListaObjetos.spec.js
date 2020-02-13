import React from "react";
import { ListaObjetos } from "../../../../src/components/listaObjetos/ListaObjetos"; 
import { Row, Col } from "react-flexbox-grid";
import { mount, render, shallow, configure } from "enzyme";
import ToolTip from "../../../../src/components/toolTip/toolTipComponent";
import SweetAlert from "../../../../src/components/sweetalertFocus";

let defaultProps = {
  dispatchUpdateElementFromList: sinon.fake(),
  dispatchUpdateActiveFieldObject : spy(sinon.fake()),
  initialObjects: [{ idObject: "", texto: "" }],
  titulo: "",
  ayuda: "",
  visual: ""
};

describe("Unit tests of the listaObjetos.js component", () => {
  
  let defaultState = {
    objeto: {
      idObject: "",
      text: ""
    },
    campoObjeto: false,
    campoVacio: false,
    idObjetoEliminar: "",
    modalEliminar: false,
    switchGuardarEditar: false,
    stylePlus: false,
    maxObjects: false,
    error: ""
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

  it('onClick in abrirCampoOjeto y la lista de objetos tiene 5', () => {
    const listaObjetos = [
      {
        idObject: 1,
        text: "Lorem ipsum dolor sit amet, consectetur "
      },
      {
        idObject: 2,
        text: "Lorem ipsum dolor sit amet, consectetur "
      },
      {
        idObject: 3,
        text: "Lorem ipsum dolor sit amet, consectetur "
      },
      {
        idObject: 4,
        text: "Lorem ipsum dolor sit amet, consectetur "
      },
      {
        idObject: 5,
        text: "Lorem ipsum dolor sit amet, consectetur "
      },
    ];
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objetos: listaObjetos
    });
    wrapper.instance().abrirCampoObjeto();
    expect(wrapper.state().maxObjects).to.equal(true);

  });

  it("onClick in cerrarCampoObjetivo should change campoObjeto state to false", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().cerrarCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(false);
  });

  it("onClick in mostrarModalEliminar should change modalEliminar state to true", () => {
    const objeto = {
      idObject: 1, 
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.instance().mostrarModalEliminar(objeto.idObject);
    expect(wrapper.state().modalEliminar).to.equal(true);
  });

  it("onClick in editarObjeto should change campoObjeto, switchGuardarEditar, stylePlus in the state to true", () => {
    const elemento = {
      idObject: 1343,
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
      idObject: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const listaObjetos = [
      {
        idObject: 1,
        text: "Lorem ipsum dolor sit amet, consectetur "
      }
    ];
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      objetos: listaObjetos
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().error).to.have.string("");
  });

  it("onClick in modificarObjeto expect me to edit the object", () => {
    const objeto = {
      idObject: 1,
      text: "-Lorem ipsum dolor sit amet, consectetur adipiscing"
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().error).to.contain("No se permiten textos que inicien con los siguientes caracteres: = + - @");
  });

  it("when I press click on modify and the object contains an @ after the first position except message alone alphanumeric are enabled", () => {
    const objeto = {
      idObject: 1,
      text: "Lorem ipsum dolor sit amet, @consectetur adipiscing "
    };
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().error).to.contain(`Solo se permiten valores alfanuméricos y ;,.-"!()$%&/¿?°#=¡':´+[]_<>`);
  });

  it("onClick in modificarObjeto expect me not to edit the object", () => {
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto: { idObject: 1, text: "" }
    });
    wrapper.instance().modificarObjeto();
    expect(wrapper.state().error).to.contain("Requiere que especifique un valor");
  });

  it("onClick in agregarObjetoLista agregue un objeto", () => {
    const idObject = (Math.random() * 10000).toFixed();
    const objeto = {
      idObject: "",
      text: "test agregar objeto"
    };
    objeto.idObject = idObject;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      campoVacio
    });
    wrapper.instance().agregarObjetoLista();
    wrapper.instance().cerrarCampoObjeto();
    expect(wrapper.state().campoObjeto).to.equal(false); 
    expect(wrapper.state().error).to.have.string("");
  });

  it("onClick in agregarObjetoLista agregue un objeto", () => {
    const idObject = (Math.random() * 10000).toFixed();
    const objeto = {
      idObject: "",
      text: "@test agregar objeto"
    };
    objeto.idObject = idObject;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      campoVacio
    });
    wrapper.instance().agregarObjetoLista();
    expect(wrapper.state().error).to.contain("No se permiten textos que inicien con los siguientes caracteres: = + - @");
  });

  it("onClick in agregarObjetoLista agregue un objeto", () => {
    const idObject = (Math.random() * 10000).toFixed();
    const objeto = {
      idObject: "",
      text: "test@ agregar objeto"
    };
    objeto.idObject = idObject;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto,
      campoVacio
    });
    wrapper.instance().agregarObjetoLista();
    expect(wrapper.state().error).to.have.string(`Solo se permiten valores alfanuméricos y ;,.-"!()$%&/¿?°#=¡':´+[]_<>`);
  });

  it("onClick in agregarObjetoLista con un objeto vacio", () => {
    const idObject = (Math.random() * 10000).toFixed();
    const objeto = {
      idObject: "",
      texto: ""
    };
    objeto.idObject = idObject;
    const campoVacio = objeto.texto;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objeto : {
        idObjeto : 123,
        text: ""
      }
    });
    wrapper.instance().agregarObjetoLista();
    expect(wrapper.state().error).to.have.string("Requiere que especifique un valor");
  });

  it("onClick in eliminarObjeto se espera que elimine el objeto", () => {
    const objeto = {
      idObject: 1,
      texto: "Lorem ipsum dolor sit amet, consectetur adipiscing "
    };
    const listaObjetos = [
      {
        idObject: 1,
        texto: "Lorem ipsum dolor sit amet, consectetur "
      }
    ]
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    wrapper.setState({
      objetos: listaObjetos
    });
    wrapper.instance().eliminarObjeto(objeto.idObject);
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

  it("test if where the component title is Oportunidades", () => {
    defaultProps.titulo = "Oportunidades";

    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find(".title-component").text()).to.equal(
      "Oportunidades (externas)"
    );
  });

  it("test if where the component title is Debilidades", () => {
    defaultProps.titulo = "Debilidades";

    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find(".title-component").text()).to.equal(
      "Debilidades (internas del cliente)"
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

  it('when visual is false, the "mas" td is not displayed', () => {
    defaultProps.visual = false;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find("td[name='td-edit']")).to.have.length(0);
  });

  it('when visual is false, the "mas" td is displayed', () => {
    defaultProps.visual = true;
    const wrapper = shallow(<ListaObjetos {...defaultProps} />);
    expect(wrapper.find("td[name='td-edit']")).to.have.length(1);
  });
});
