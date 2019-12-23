import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import ToolTip from "../toolTip/toolTipComponent";
import ToolTipComponent from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";

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

  abrirCampoObjetivo = event => {
    this.setState({
      campoObjetivo: true
    });
  };

  cerrarCampoObjetivo = () => {
    const { objetivo } = this.state.objetivo.objetivo;
    this.setState({
      campoObjetivo: false,
      campoVacio: false,
      switchGuardarEditar: false
    });
    if (objetivo !== "") {
      this.setState({
        objetivo: {
          id: "",
          objetivo: ""
        }
      });
    }
  };

  modificarObjetivo = () => {
    const { objetivo } = this.state;
    const listaObjetos = this.state.objetivos;

    listaObjetos.map((elemento, index) => {
      if (elemento.id === objetivo.id) {
        listaObjetos[index].objetivo = objetivo.objetivo;
      }
    });

    this.setState({
      objetivo: {
        id: "",
        objetivo: ""
      },
      objetivos: listaObjetos,
      campoObjetivo: false,
      switchGuardarEditar: false
    });
  };

  agregarObjetivoLista = () => {
    const id = (Math.random() * 10000).toFixed();
    const { objetivo } = this.state;
    objetivo.id = id;
    const campoVacio = this.state.objetivo.objetivo;

    if (campoVacio !== "") {
      const objetivos = [...this.state.objetivos, objetivo];
      this.cerrarCampoObjetivo();
      this.setState({
        objetivo: {
          id: "",
          objetivo: ""
        },
        objetivos
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

  editarObjetivo = elemento => {
    const { id, objetivo } = elemento;
    this.setState({
      objetivo: {
        id,
        objetivo
      },
      campoObjetivo: true,
      switchGuardarEditar: true
    });
  };

  newObjetivo = event => {
    const { name, value } = event.target;
    const { id } = this.state.objetivo;
    this.setState({
      objetivo: {
        id,
        [name]: value
      }
    });
    // NOTA: Debo corregir esta guardando uno despues - alinearlo - ajustarlo
  };

  render() {
    const { titulo } = this.props;
    const {
      objetivos,
      campoObjetivo,
      campoVacio,
      idObjetivoEliminar,
      modalEliminar,
      switchGuardarEditar
    } = this.state;
    const textButon = switchGuardarEditar ? "Modificar" : "Guardar";
    const functionButton = switchGuardarEditar
      ? this.modificarObjetivo
      : this.agregarObjetivoLista;

    const helpObjetivoscliente = "En este campo debe agregar los/las " + titulo + " del cliente.";

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
                    {`${titulo} del cliente`}(
                    <span style={{ color: "red" }}>*</span>)
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
                  <ToolTipComponent text={`"Agregar ${titulo} del cliente"`}>
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
                  placeholder={`${titulo}...`}
                  value={this.state.objetivo.objetivo}
                />
                <div>
                  <button
                    title={`${textButon} ${titulo}`}
                    type="button"
                    onClick={functionButton}
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
                  {`Para guardar debe ingresar ${titulo} del cliente!`}
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
                          title={`Editar ${titulo} del cliente`}
                          style={{ cursor: "pointer" }}
                          onClick={() => this.editarObjetivo(elemento)}
                        />
                      </td>
                      <td>{elemento.objetivo}</td>
                      <td className="collapsing">
                        <i
                          className="trash icon"
                          title={`Eliminar ${titulo} del cliente`}
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
                text={`Señor usuario, ¿Está seguro que desea eliminar el/la ${titulo} del cliente?`}
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
                      {`Aún no se han adicionado ${titulo} por parte del cliente`}
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
