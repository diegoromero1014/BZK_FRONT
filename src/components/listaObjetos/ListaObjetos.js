import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col } from "react-flexbox-grid";
import {mapKeys} from 'lodash';

import ToolTip from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";
import { updateElementFromList, updateActiveFieldObject } from "./actions";

import {
  processRules, checkRequired, checkPatternClientObjective, checkRegexHtmlInjection, checkFirstCharacter
} from '../../validationsFields/rulesField.js'

import "./styleListaObjetos.scss";

export class ListaObjetos extends Component {
  state = {
    objeto: {
      idObject: "",
      text: ""
    },
    objetos: [],
    campoObjeto: false, 
    idObjetoEliminar: "",
    modalEliminar: false,
    switchGuardarEditar: false,
    stylePlus: false,
    maxObjects: false,
    error: ""
  };

  componentDidMount() {
    this.setStateInitialObjects();
  }

  setStateInitialObjects = () => {
    const { initialObjects, dispatchUpdateElementFromList, titulo } = this.props;
    dispatchUpdateElementFromList(titulo, initialObjects);
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
      dispatchUpdateActiveFieldObject(false, titulo);
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
        idObject: "",
        text: ""
      },
      campoObjeto: false,
      switchGuardarEditar: false,
      stylePlus: false,
      error: "",
    });
  };

  mostrarModalEliminar = idObject => {
    this.setState({
      idObjetoEliminar: idObject,
      modalEliminar: true
    });
  };

  editarObjeto = elemento => {
    const { idObject, text } = elemento;
    const { dispatchUpdateActiveFieldObject, titulo } = this.props;
    dispatchUpdateActiveFieldObject(true, titulo);
    this.setState({
      objeto: {
        idObject,
        text
      },
      campoObjeto: true,
      switchGuardarEditar: true,
      stylePlus: true
    });
  };

  modificarObjeto = () => {
    this.setState({
      error: ""
    })
    const { objeto } = this.state;
    const listaObjetos = this.state.objetos;
    const {
      dispatchUpdateElementFromList,
      titulo,
      dispatchUpdateActiveFieldObject
    } = this.props;
    
    const campoVacio = this.state.objeto.text;
    const isValid = this.checkValidations(campoVacio);
    if (!isValid) {
      return;
    }
    listaObjetos.map((elemento, index) => {
      if (elemento.idObject === objeto.idObject) {
        listaObjetos[index].text = objeto.text;
      }
    });
    dispatchUpdateElementFromList(titulo, listaObjetos);
    dispatchUpdateActiveFieldObject(false, titulo);
    this.setState({
      objeto: {
        idObject: "",
        text: ""
      },
      objetos: listaObjetos,
      error: "",
      campoObjeto: false,
      switchGuardarEditar: false,
      stylePlus: false
    });
  };

  checkValidations = (value) => {
    const fields = { valor: value};
    const validations = {
      valor: {
        rules: [ checkRequired, checkFirstCharacter, checkPatternClientObjective, checkRegexHtmlInjection ]
      }
    }
    const fieldErrors = processRules(fields, validations);
    let errors = []
    mapKeys(fieldErrors, (value, _) => {
        if (value) {
            errors.push(value);
        }
    })
    const isValid = errors.length === 0;
    if (!isValid) {
        this.setState({
          error: errors[0]
        })
    }
    return isValid;

  }

  agregarObjetoLista = () => {
  
    const {
      dispatchUpdateElementFromList,
      titulo,
      dispatchUpdateActiveFieldObject
    } = this.props;
    const campoVacio = this.state.objeto.text;

    const isValid = this.checkValidations(campoVacio);

    if (!isValid) {
      return;
    }

    const idObject = (Math.random() * 10000).toFixed();
    const { objeto } = this.state;
    objeto.idObject = idObject;
    const objetos = [...this.state.objetos, objeto];
    this.cerrarCampoObjeto();
    dispatchUpdateElementFromList(titulo, objetos);
    dispatchUpdateActiveFieldObject(false, titulo);
    this.setState({
      objeto: {
        idObject: "",
        text: ""
      },
      objetos,
      stylePlus: false,
      error: ""
    });

  };

  eliminarObjeto = idObject => {
    const { dispatchUpdateElementFromList, titulo } = this.props;
    const objetos = this.state.objetos.filter(elemento => elemento.idObject !== idObject);
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
    const { idObject } = this.state.objeto;
    this.setState({
      objeto: {
        idObject,
        [name]: value
      }
    });
  };

  render() {
    const { titulo, ayuda, visual, icon } = this.props;

    const {
      objetos,
      campoObjeto,
      idObjetoEliminar,
      modalEliminar,
      switchGuardarEditar,
      stylePlus,
      maxObjects,
      error
    } = this.state;
    

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
                  name="text"
                  onChange={this.newObjeto}
                  placeholder={ayuda}
                  value={this.state.objeto.text}
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
              {
                error && 
                (<div className="ui pointing red basic label">
                    {error}
                </div>)
              }
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
                    <tr key={elemento.idObject}>
                      {visual && (
                        <td name="td-edit" className="collapsing">
                          <i
                            className="edit icon"
                            title={`Editar ${titulo}`}
                            onClick={() => this.editarObjeto(elemento)}
                          />
                        </td>
                      )}
                      <td className="add-line-break">{elemento.text}</td>
                      {visual && (
                        <td className="collapsing">
                          <i
                            className="trash icon"
                            title={`Eliminar ${titulo}`}
                            onClick={() =>
                              this.mostrarModalEliminar(elemento.idObject)
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
                    <span>{`No se han adicionado ${tituloCompleto}.`}</span>
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
