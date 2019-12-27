import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ToolTip from "../toolTip/toolTipComponent";
import ToolTipComponent from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";

/** La funcion updateElements debe recibirse como propiedad por parte del 
    componente padre, se le envia la lista de objetos, para luego 
    guardar los datos en el componente padre (redux-context-state) para 
    comunicacion con el back - BD
*/
import "./AñadirListaObjetos";


export class AñadirListaObjetos extends Component {
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
    switchGuardarEditar: false
  };

  abrirCampoObjeto = event => {
    this.setState({
      campoObjeto: true
    });
  };

  cerrarCampoObjeto = () => {
    const { texto } = this.state.objeto;
    this.setState({
      campoObjeto: false,
      campoVacio: false,
      switchGuardarEditar: false
    });
    if (texto !== "") {
      this.setState({
        objeto: {
          id: "",
          texto: ""
        }
      });
    }
  };

  mostrarModalEliminar = id => {
    this.setState({
      idObjetoEliminar: id,
      modalEliminar: true
    });
  };

  editarObjeto = elemento => {
    const { id, texto } = elemento;
    this.setState({
      objeto: {
        id,
        texto
      },
      campoObjeto: true,
      switchGuardarEditar: true
    });
  };

  modificarObjeto = () => {
    const { objeto } = this.state;
    const listaObjetos = this.state.objetos;
    const campoVacio = this.state.objeto.texto;
    // const { updateElements } = this.props;

    if (campoVacio !== "") {
      listaObjetos.map((elemento, index) => {
        if (elemento.id === objeto.id) {
          listaObjetos[index].texto = objeto.texto;
        }
      });
      // updateElements(listaObjetos);
      this.setState({
        objeto: {
          id: "",
          texto: ""
        },
        objetos: listaObjetos,
        campoVacio: false,
        campoObjeto: false,
        switchGuardarEditar: false
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
    // const { updateElements } = this.props;
    objeto.id = id;
    const campoVacio = this.state.objeto.texto;

    if (campoVacio !== "") {
      const objetos = [...this.state.objetos, objeto];
      // updateElements(objetos);
      this.cerrarCampoObjeto();
      this.setState({
        objeto: {
          id: "",
          texto: ""
        },
        objetos
      });
    } else {
      this.setState({
        campoVacio: true
      });
    }
  };

  eliminarObjeto = id => {
    // const { updateElements } = this.props;
    const objetos = this.state.objetos.filter(elemento => elemento.id !== id);
    // updateElements(objetos);
    this.setState({
      modalEliminar: false
    });
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
    const { titulo } = this.props;
    const {
      objetos,
      campoObjeto,  
      campoVacio, 
      idObjetoEliminar,
      modalEliminar,
      switchGuardarEditar
    } = this.state;
    const textButon = switchGuardarEditar ? "Modificar" : "Agregar";
    const functionButton = switchGuardarEditar
      ? this.modificarObjeto
      : this.agregarObjetoLista;

    const helpObjetos = "En este campo debe agregar los/las " + titulo;

    return (
      <div style={{ width: "100%" }}>
        <Row style={{ padding: "20px 23px 20px 20px" }}>
          <Col xs={12} md={12} lg={12}>
            <div className="header-component">
              <div className="line-topComponent"/>
              <div className="container-titleHelpPlus">
                <div>
                  <i className="book icon"/>
                  <span className="title-component">
                    {`${titulo}`}(<span className="icon-obligatoriedad">*</span>)
                  </span>
                  <ToolTip text={helpObjetos}>
                    <i className="help circle icon blue"/>
                  </ToolTip>
                </div>
                <button
                  type="button"
                  className="button-openField"
                  onClick={this.abrirCampoObjeto}>
                  <ToolTipComponent text={`Agregar ${titulo}`}>
                    <i className="plus white icon"/>
                  </ToolTipComponent>
                </button>
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
                  placeholder={`${titulo}...`}
                  value={this.state.objeto.texto}
                />
                <div className="container-buttons">
                  <button
                    className="button-add"
                    title={`${textButon} ${titulo}`}
                    type="button"
                    onClick={functionButton}>
                    {textButon}
                  </button>
                  <button  
                    className="button-cancel"
                    type="button"
                    onClick={this.cerrarCampoObjeto}>
                    Cancelar
                  </button>
                </div>
              </div>
              {campoVacio ? (
                switchGuardarEditar ? (
                  <div className="ui pointing red basic label">
                    {`Para modificar debe ingresar ${titulo}`}
                  </div>
                ) : (
                  <div className="ui pointing red basic label">
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
                      <td className="collapsing">
                        <i
                          className="edit icon"
                          title={`Editar ${titulo}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => this.editarObjeto(elemento)}
                        />
                      </td>
                      <td>{elemento.texto}</td>
                      <td className="collapsing">
                        <i
                          className="trash icon"
                          title={`Eliminar ${titulo}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => this.mostrarModalEliminar(elemento.id)}
                        />
                      </td>
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
                  <tr
                    style={{
                      height: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ textAlign: "center" }}>
                      {`Aún no se han adicionado ${titulo}.`}
                    </span>
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

export default AñadirListaObjetos;
