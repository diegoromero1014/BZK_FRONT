import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col } from "react-flexbox-grid";
import ToolTip from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";
import { updateElementFromList, updateActiveFieldObject } from "./actions";
import "./styleListaObjetos.scss";

export class ListaObjetos extends Component {
  state = {
    objeto: {
      id: "",
      texto: ""
    },
    objetos: [],
    campoObjeto: false,
    campoVacio: false,
    idObjetoEliminar: "",
    modalEliminar: false,
    switchGuardarEditar: false,
    stylePlus: false,
    maxObjects: false
  };

  componentDidMount() {
    this.setStateInitialObjects();
  }

  setStateInitialObjects = () => {
    const { initialObjects } = this.props;
    this.setState({
      objetos: initialObjects
    });
  };

  abrirCampoObjeto = () => {
    const { objetos } = this.state;
    const { dispatchUpdateActiveFieldObject, titulo } = this.props;
    dispatchUpdateActiveFieldObject(true, titulo);
    if (objetos.length < 5) {
      this.setState({
        campoObjeto: true,
        stylePlus: true
      });
    } else {
      this.setState({
        maxObjects: true
      });
    }
  };

  cerrarCampoObjeto = () => {
    const { dispatchUpdateActiveFieldObject, titulo } = this.props;
    dispatchUpdateActiveFieldObject(false, titulo);
    this.setState({
      objeto: {
        id: "",
        texto: ""
      },
      campoObjeto: false,
      campoVacio: false,
      switchGuardarEditar: false,
      stylePlus: false
    });
  };

  mostrarModalEliminar = id => {
    this.setState({
      idObjetoEliminar: id,
      modalEliminar: true
    });
  };

  editarObjeto = elemento => {
    const { id, texto } = elemento;
    const { dispatchUpdateActiveFieldObject, titulo } = this.props;

    dispatchUpdateActiveFieldObject(true, titulo);

    this.setState({
      objeto: {
        id,
        texto
      },
      campoObjeto: true,
      switchGuardarEditar: true,
      stylePlus: true
    });
  };

  modificarObjeto = () => {
    const { objeto } = this.state;
    const listaObjetos = this.state.objetos;
    const campoVacio = this.state.objeto.texto;
    const {
      dispatchUpdateElementFromList,
      titulo,
      dispatchUpdateActiveFieldObject
    } = this.props;

    dispatchUpdateActiveFieldObject(false, titulo);

    if (campoVacio !== "") {
      listaObjetos.map((elemento, index) => {
        if (elemento.id === objeto.id) {
          listaObjetos[index].texto = objeto.texto;
        }
      });
      dispatchUpdateElementFromList(titulo, listaObjetos);
      this.setState({
        objeto: {
          id: "",
          texto: ""
        },
        objetos: listaObjetos,
        campoVacio: false,
        campoObjeto: false,
        switchGuardarEditar: false,
        stylePlus: false
      });
    } else {
      this.setState({
        campoVacio: true
      });
    }
  };

  agregarObjetoLista = () => {
    const id = (Math.random() * 10000).toFixed();
    const { objeto } = this.state;
    const {
      dispatchUpdateElementFromList,
      titulo,
      dispatchUpdateActiveFieldObject
    } = this.props;
    objeto.id = id;
    // const terminoNoValido =

    const campoVacio = this.state.objeto.texto;
    dispatchUpdateActiveFieldObject(false, titulo);
    if (campoVacio !== "") {
      // if(campoVacio )
      const objetos = [...this.state.objetos, objeto];
      this.cerrarCampoObjeto();

      dispatchUpdateElementFromList(titulo, objetos);

      this.setState({
        objeto: {
          id: "",
          texto: ""
        },
        objetos,
        stylePlus: false
      });
    } else {
      this.setState({
        campoVacio: true
      });
    }
  };

  eliminarObjeto = id => {
    const { dispatchUpdateElementFromList, titulo } = this.props;
    const objetos = this.state.objetos.filter(elemento => elemento.id !== id);
    this.setState({
      modalEliminar: false
    });
    dispatchUpdateElementFromList(titulo, objetos);
    this.setState({
      objetos
    });
  };

  newObjeto = event => {
    const { name, value } = event.target;
    const { id } = this.state.objeto;
    this.setState({
      objeto: {
        id,
        [name]: value
      }
    });
  };

  render() {
    const { titulo, ayuda, visual, icon } = this.props;

    const {
      objetos,
      campoObjeto,
      campoVacio,
      idObjetoEliminar,
      modalEliminar,
      switchGuardarEditar,
      stylePlus,
      maxObjects
    } = this.state;
    console.log(maxObjects);
    const textButon = switchGuardarEditar ? "Modificar" : "Agregar";

    const functionButton = switchGuardarEditar
      ? this.modificarObjeto
      : this.agregarObjetoLista;

    const styleCheckedPlus = stylePlus
      ? "button-openFieldChecked"
      : "button-openField";

    let tituloCompleto;
    if (titulo === "Oportunidades") {
      tituloCompleto = "Oportunidades externas";
    } else if (titulo === "Debilidades") {
      tituloCompleto = "Debilidades internas del cliente";
    }

    return (
      <div className="container-listaObjetos">
        <SweetAlert
          type="warning"
          show={maxObjects}
          title="Atención"
          text={`Señor usuario, el maximo de ${titulo} son 5`}
          confirmButtonText="OK"
          onConfirm={() => this.setState({ maxObjects: false })}
        />
        <Row style={{ padding: "20px 23px 20px 20px" }}>
          <Col xs={12} md={12} lg={12}>
            <div className="header-component">
              <div className="line-topComponent" />
              <div className="container-titleHelpPlus">
                <div>
                  <i className={icon} />
                  <span className="title-component">{`${tituloCompleto}`}</span>
                  {visual && (
                    <ToolTip text={ayuda}>
                      <i className="help circle icon blue" />
                    </ToolTip>
                  )}
                </div>
                {visual && (
                  <button
                    name="btn-agregar"
                    type="button"
                    className={styleCheckedPlus}
                    onClick={this.abrirCampoObjeto}
                  >
                    <ToolTip text={`Agregar ${titulo}`}>
                      <i className="plus white icon" />
                    </ToolTip>
                  </button>
                )}
              </div>
            </div>
          </Col>
          {campoObjeto && (
            <Col
              ms={12}
              md={12}
              lg={12}
              style={{ paddingRight: "15px", marginTop: "15px" }}
            >
              <div className="container-fieldButtons">
                <textarea
                  className="field-textArea"
                  type="text"
                  name="texto"
                  onChange={this.newObjeto}
                  placeholder={ayuda}
                  value={this.state.objeto.texto}
                  maxLength={700}
                />
                <div className="container-buttons">
                  <button
                    className="button-add"
                    title={`${textButon} ${titulo}`}
                    type="button"
                    onClick={functionButton}
                  >
                    {textButon}
                  </button>
                  <button
                    className="button-cancel"
                    type="button"
                    onClick={this.cerrarCampoObjeto}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              {campoVacio ? (
                switchGuardarEditar ? (
                  <div
                    name="msjErrorModificar"
                    className="ui pointing red basic label"
                  >
                    {`Para modificar debe ingresar ${titulo}`}
                  </div>
                ) : (
                  <div
                    name="msjErrorAgregar"
                    className="ui pointing red basic label"
                  >
                    {`Para agregar debe ingresar ${titulo}`}
                  </div>
                )
              ) : null}
            </Col>
          )}
        </Row>
        {objetos.length !== 0 ? (
          <Row style={{ padding: "5px 23px 5px 20px" }}>
            <Col
              xs={12}
              md={12}
              lg={12}
              style={{ paddingRight: "15px", marginTop: "15px" }}
            >
              <table className="ui striped table">
                <thead>
                  {objetos.map(elemento => (
                    <tr>
                      {visual && (
                        <td name="td-edit" className="collapsing">
                          <i
                            className="edit icon"
                            title={`Editar ${titulo}`}
                            onClick={() => this.editarObjeto(elemento)}
                          />
                        </td>
                      )}
                      <td>{elemento.texto}</td>
                      {visual && (
                        <td className="collapsing">
                          <i
                            className="trash icon"
                            title={`Eliminar ${titulo}`}
                            onClick={() =>
                              this.mostrarModalEliminar(elemento.id)
                            }
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </thead>
              </table>
              <SweetAlert
                type="warning"
                show={modalEliminar}
                title="Confirmar Eliminacion"
                text={`Señor usuario, ¿Está seguro que desea eliminar ${titulo}?`}
                confirmButtonColor="#DD6B55"
                confirmButtonText="Sí, estoy seguro!"
                cancelButtonText="Cancelar"
                showCancelButton={true}
                onCancel={() => this.setState({ modalEliminar: false })}
                onConfirm={() => this.eliminarObjeto(idObjetoEliminar)}
              />
            </Col>
          </Row>
        ) : (
          <Row style={{ padding: "5px 23px 5px 20px" }}>
            <Col
              xs={12}
              md={12}
              lg={12}
              style={{ paddingRight: "15px", marginTop: "15px" }}
            >
              <table className="ui striped table">
                <thead>
                  <tr className="tr-void">
                    <span>{`Aún no se han adicionado ${tituloCompleto}.`}</span>
                  </tr>
                </thead>
              </table>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchUpdateElementFromList: updateElementFromList,
      dispatchUpdateActiveFieldObject: updateActiveFieldObject
    },
    dispatch
  );

const mapStateToProps = (
  { objectListReducer, clientInformation },
  ownerProps
) => ({
  objectListReducer,
  clientInformation
});

export default connect(mapStateToProps, mapDispatchToProps)(ListaObjetos);
