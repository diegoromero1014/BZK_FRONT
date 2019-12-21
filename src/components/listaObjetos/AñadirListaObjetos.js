import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ToolTip from "../toolTip/toolTipComponent";
import ToolTipComponent from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";

const helpObjetivoscliente =
  "En este campo debe agregar los objetivos del cliente de mira a la previsita.";

export class AñadirListaObjetos extends Component {
  state = {
    objetivo: {
      id: "",
      objetivo: ""
    },
    objetivos: [],
    campoObjetivo: false,
    campoVacio: false,
    idObjetivoEliminar: "",
    modalEliminar: false,
    switchGuardarEditar: false,

    idModifica: ""
  };

  //funcion que me permite abrir el campo para ingresar el objetivo
  abrirCampoObjetivo = event => {
    this.setState({
      campoObjetivo: true
    });
  };

  //funcion que me permite cerrar el campo objetivo.
  cerrarCampoObjetivo = () => {
    const { objetivo } = this.state.objetivo.objetivo;

    this.setState({
      campoObjetivo: false,
      campoVacio: false
    });
    if (objetivo !== "") {
      this.setState({
        objetivo: {
          objetivo: ""
        }
      });
    }
  };

  //funcion que nos permite agregar un objetivo a la lista de objetivos
  agregarObjetivoLista = () => {
    const id = (Math.random() * 10000).toFixed();
    const { objetivo } = this.state;
    objetivo.id = id ; 
    const campoVacio = this.state.objetivo.objetivo;
    const objetivos = [...this.state.objetivos, objetivo];

    if (campoVacio !== "") {
      this.setState({
        objetivos
      });
      this.cerrarCampoObjetivo();
      this.setState({
        objetivo: {
          objetivo: ""
        }
      });
    } else {
      this.setState({
        campoVacio: true
      });
    }
  };

  mostrarModalEliminar = id => {
    this.setState({
      idObjetivoEliminar: id,
      modalEliminar: true
    });
  };

  // funcion que nos permite eliminar el objetivo seleccionado.
  eliminarObjetivo = id => {
    const objetivos = this.state.objetivos.filter(
      elemento => elemento.id !== id
    );
    this.setState({
      modalEliminar: false
    });
    this.setState({
      objetivos
    });
  };

  // funcion que nos permite editar el objetivo del cliente
  editarObjetivo = (id, objetivo) => {
    // se abre el campo objetivo y se cambia el nombre del boton guardar por modificar
    const idModifica = id;
    this.setState({
      campoObjetivo: true,
      switchGuardarEditar: true,
      objetivo: {
        id,
        objetivo
      },
      idModifica
    });
  };

  // funcion para modificar un objetivo de la lista
  // modificarObjetivo = () => {
  //   const {}
  // }

  //funcion que nos permite guardar en el estado el objetivo que se ingresa en el input
  newObjetivo = event => {
    const { name, value } = event.target;
    // const id = (Math.random() * 10000).toFixed();
    this.setState({
      objetivo: {
        // id,
        [name]: value
      }
    });
    // NOTA: Debo corregir esta guardando uno despues - alinearlo - ajustarlo
  };

  render() {
    //destructuring de las propiedades del state
    const {
      objetivos,
      campoObjetivo,
      campoVacio,
      idObjetivoEliminar,
      modalEliminar,
      switchGuardarEditar
    } = this.state;
    const textButon = switchGuardarEditar ? "Modificar" : "Guardar";

    return (
      <div>
        <Row style={{ padding: "20px 23px 20px 20px" }}>
          <Col xs={12} md={12} lg={12}>
            <div
              style={{
                fontSize: "25px",
                color: "#CEA70B",
                marginTop: "5px",
                marginBottom: "0px"
              }}
            >
              <div
                style={{
                  borderTop: "1px dotted #cea70b",
                  width: "100%",
                  marginBottom: "10px"
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <i className="book icon" style={{ fontSize: "18px" }} />
                  <span style={{ fontSize: "20px" }}>
                    {this.props.titulo}(<span style={{ color: "red" }}>*</span>)
                  </span>
                  <ToolTip text={helpObjetivoscliente}>
                    <i
                      className="help circle icon blue"
                      style={{
                        fontSize: "18px",
                        cursor: "pointer",
                        marginLeft: "0px"
                      }}
                    />
                  </ToolTip>
                </div>
                <button
                  type="button"
                  className="btn-abrirCampo"
                  onClick={this.abrirCampoObjetivo}
                  style={{
                    marginRight: "10px",
                    border: "none",
                    backgroundColor: "#2671D7",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "15px",
                    padding: "10px 10px"
                  }}
                >
                  <ToolTipComponent text="Agregar objetivo del cliente">
                    <i
                      className="plus white icon"
                      style={{ padding: "3px 0 0 5px" }}
                    ></i>
                  </ToolTipComponent>
                </button>
              </div>
            </div>
          </Col>
          {campoObjetivo && (
            <Col
              ms={12}
              md={12}
              lg={12}
              style={{ paddingRight: "15px", marginTop: "15px" }}
            >
              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <input
                  type="text"
                  name="objetivo"
                  onChange={this.newObjetivo}
                  style={{ width: "750px" }}
                  placeholder="Objetivo..."
                  // cuando el boton editar se oprimido se debe mostrar en el input el valor del campo a editar
                  value={this.state.objetivo.objetivo}
                />
                <div>
                  <button
                    title="Guardar Objetivo"
                    type="button"
                    onClick={this.agregarObjetivoLista}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      backgroundColor: "#2671D7",
                      color: "white",
                      borderRadius: "3px",
                      fontSize: "16px",
                      cursor: "pointer"
                    }}
                  >
                    {textButon}
                  </button>
                  <button
                    type="button"
                    onClick={this.cerrarCampoObjetivo}
                    style={{
                      marginLeft: "10px",
                      padding: "10px 20px",
                      border: "none",
                      backgroundColor: "#C1C1C1",
                      color: "white",
                      borderRadius: "3px",
                      fontSize: "16px",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              {campoVacio && (
                <div className="ui pointing red basic label">
                  Para guardar debe ingresar un objetivo del cliente!
                </div>
              )}
            </Col>
          )}
        </Row>
        {objetivos.length !== 0 ? (
          <Row style={{ padding: "5px 23px 5px 20px" }}>
            <Col
              xs={12}
              md={12}
              lg={12}
              style={{ paddingRight: "15px", marginTop: "15px" }}
            >
              <table className="ui striped table">
                <thead>
                  {objetivos.map(elemento => (
                    <tr>
                      <td className="collapsing">
                        <i
                          className="zoom icon"
                          title="Editar objetivo del cliente"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            this.editarObjetivo(elemento.id, elemento.objetivo)
                          }
                        />
                      </td>
                      <td>{elemento.id}</td>
                      <td>{elemento.objetivo}</td>
                      <td className="collapsing">
                        <i
                          className="trash icon"
                          title="Eliminar objetivo del cliente"
                          style={{ cursor: "pointer" }}
                          onClick={() => this.mostrarModalEliminar(elemento.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
              {/* Componente que nos permite confirmar borrar un objetivo */}
              {/* El titulo y el texto deben ser dinamicos segun sea Objetivo - Estrategia */}
              <SweetAlert
                type="warning"
                show={modalEliminar}
                title="Confirmar Eliminacion"
                text="Señor usuario, ¿Está seguro que desea eliminar el canal de distribución?"
                confirmButtonColor="#DD6B55"
                confirmButtonText="Sí, estoy seguro!"
                cancelButtonText="Cancelar"
                showCancelButton={true}
                onCancel={() => this.setState({ modalEliminar: false })}
                onConfirm={() => this.eliminarObjetivo(idObjetivoEliminar)}
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
                      height: "40px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <h3 style={{ textAlign: "center" }}>
                      Aún no se han adicionado objetivos por parte del cliente
                    </h3>
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
