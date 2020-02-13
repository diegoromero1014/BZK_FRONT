import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Row, Col } from "react-flexbox-grid";
import { mapKeys } from 'lodash';

import ToolTip from "../toolTip/toolTipComponent";
import SweetAlert from "../sweetalertFocus";
import Modal from "react-modal";
import { updateElementFromList, updateActiveFieldObject, openLinkModal,
  updateElementoAsociado, saveTemporalChanges, discardTemporalChanges } from "./actions";

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
    error: "",

    modalPrevisit: false,
    objetosAsociados: [],
    alertAsociar: false
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
    const { dispatchUpdateActiveFieldObject, titulo, previsit, dispatchOpenLinkModal } = this.props;

    if (previsit) {
      dispatchOpenLinkModal(titulo);
      this.setState({
        modalPrevisit: true
      })
    } else {
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
    }
  };

  cerrarCampoObjeto = () => {
    const { dispatchUpdateActiveFieldObject, titulo, previsit, dispatchDiscardTemporalChanges } = this.props;
    if (previsit) {
      dispatchDiscardTemporalChanges(titulo);
      this.setState({
        modalPrevisit: false
      })
    }
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

  checkValidations = campoVacio => {
    const fields = { valor: campoVacio.trim() };
    const validations = {
      valor: {
        rules: [checkRequired, checkFirstCharacter, checkPatternClientObjective, checkRegexHtmlInjection]
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

  saveObjetosAsociados = () => {
    const { dispatchSaveTemporalChanges, titulo } = this.props; 
    let [objetosAsociados] = this.getObjectsFromReducer();
    if ( this.filterObjectsByCheckedValue("temporalChecked", objetosAsociados, true).length === 0) {
      this.setState({
        alertAsociar: true
      })
    } else {
      dispatchSaveTemporalChanges(titulo);
      this.setState({
        modalPrevisit: false
      })
    }
  }

  desasociar = (event, idObject) => {
    const { checked } = event.target
    if (!checked) {
      this.setState({
        idObjetoEliminar: idObject,
        modalEliminar: true
      });
    }
  }

  eliminarObjetoAsociado = idObject => {
    const { dispatchUpdateElementoAsociado, titulo } = this.props;
    this.setState({
      modalEliminar: false
    })
    dispatchUpdateElementoAsociado(idObject, titulo, false);
  }

  isCheck = (event, elemento) => {
    const { checked } = event.target;
    const { dispatchUpdateElementoAsociado, titulo } = this.props;
    dispatchUpdateElementoAsociado(elemento.id, titulo, checked);
    
  }

  getObjectsFromReducer = () => {
    const { objectListReducer, titulo } = this.props;

    let objectosAsociados;
    let tituloCompleto;

    if (titulo === "Oportunidades") {
      objectosAsociados = objectListReducer.Oportunidades.elements;
      tituloCompleto = "Oportunidades (externas)";
    } else if (titulo === "Debilidades") {
      objectosAsociados = objectListReducer.Debilidades.elements;
      tituloCompleto = "Debilidades (internas del cliente)";
    }
    
    return [ objectosAsociados, tituloCompleto]

  }

  filterObjectsByCheckedValue(prop, objects, checkedValue) {
    return objects.filter( object => !!object[prop] == checkedValue );
  }

  render() {
    const { titulo, ayuda, visual, icon, previsit } = this.props;

    const {
      objetos,
      campoObjeto,
      idObjetoEliminar,
      modalEliminar,
      switchGuardarEditar,
      stylePlus,
      maxObjects,
      error,
      modalPrevisit,
      alertAsociar
    } = this.state;


    const textButon = switchGuardarEditar ? "Modificar" : "Agregar";

    const functionButton = switchGuardarEditar
      ? this.modificarObjeto
      : this.agregarObjetoLista;

    const styleCheckedPlus = stylePlus
      ? "button-openFieldChecked"
      : "button-openField";
    
    let [objetosAsociados, tituloCompleto] = this.getObjectsFromReducer();

    return (
      <div className="container-listaObjetos">
        {previsit &&
          (<Modal isOpen={modalPrevisit} className="modalBt3-fade modal fade contact-detail-modal in">
            <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                <div className="modalBt4-header modal-header">
                  <h4 className="modal-title" style={{ float: 'left', marginBottom: '0px' }} id="myModalLabel">{`Asociar ${tituloCompleto}`}</h4>
                  <button type="button" onClick={this.cerrarCampoObjeto} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  </button>
                </div>
                <div className="" style={{ background: "white", padding: "10px 10px" }}>
                  <div className="header-component" style={{ margin: "15px 18px" }}>
                    <i className={icon} />
                    <span className="title-component">{`${tituloCompleto}`}</span>
                  </div>
                  {objetosAsociados.length !== 0 ? (
                    <Row style={{ padding: "5px 23px 5px 20px" }}>
                      <Col
                        xs={12}
                        md={12}
                        lg={12}
                        style={{ paddingRight: "15px", marginTop: "15px" }}>
                        <table className="ui striped table">
                          <thead>
                            {objetosAsociados.map(elemento => 
                                (<tr key={elemento.idObject}>
                                  <td name="td-edit" className="collapsing">
                                    <input type="checkbox" onChange={(event) => this.isCheck(event, elemento)} checked={(typeof elemento.temporalChecked == "undefined" && elemento.checked) || elemento.temporalChecked} style={{ marginTop: "4px" }} />
                                  </td>
                                  <td className="add-line-break">{elemento.text}</td>
                                </tr> )
                            )}
                          </thead>
                        </table>
                      </Col>
                    </Row>
                  ) : null}
                </div>
                <div style={{ width: "100%", padding: "15px" }}>
                  <button
                    style={{ marginLeft: "16px" }}
                    className="button-add"
                    onClick={this.saveObjetosAsociados}>
                    Guardar
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    className="button-cancel"
                    type="button"
                    onClick={this.cerrarCampoObjeto}>
                    Cancelar
                  </button>
                  <SweetAlert
                    type="warning"
                    show={alertAsociar}
                    title="Atención"
                    text={`Señor usuario, debe seleccionar al menos una ${tituloCompleto} para guardar.`}
                    confirmButtonText="OK"
                    onConfirm={() => this.setState({ alertAsociar: false })}
                  />
                </div>
              </div>
            </div>
          </Modal>)
        }

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
              style={{ paddingRight: "15px", marginTop: "15px" }}>
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

        {
          !previsit && (objetos.length !== 0 ? (
            <Row style={{ padding: "5px 23px 5px 20px" }}>
              <Col
                xs={12}
                md={12}
                lg={12}
                style={{ paddingRight: "15px", marginTop: "15px" }}>
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
                  text={`Señor usuario, ¿Está seguro que desea eliminar ${tituloCompleto}?`}
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
                  style={{ paddingRight: "15px", marginTop: "15px" }}>
                  <table className="ui striped table">
                    <thead>
                      <tr className="tr-void">
                        <span>{`No se han adicionado ${tituloCompleto}.`}</span>
                      </tr>
                    </thead>
                  </table>
                </Col>
              </Row>
            ))
        }

        {previsit ?
          (this.filterObjectsByCheckedValue("checked", objetosAsociados, true).length === 0 ?
            (<Row style={{ padding: "5px 23px 5px 20px" }}>
              <Col
                xs={12}
                md={12}
                lg={12}
                style={{ paddingRight: "15px", marginTop: "15px" }}>
                <table className="ui striped table">
                  <thead>
                    <tr className="tr-void">
                      <span>{`No se han asociado ${tituloCompleto}.`}</span>
                    </tr>
                  </thead>
                </table>
              </Col>
            </Row>) :
            (<Row style={{ padding: "5px 23px 5px 20px" }}>
              <Col
                xs={12}
                md={12}
                lg={12}
                style={{ paddingRight: "15px", marginTop: "15px" }}>
                <table className="ui striped table">
                  <thead>
                    { this.filterObjectsByCheckedValue("checked", objetosAsociados, true).map(elemento => (
                      <tr key={elemento.idObject}>
                        <td name="td-edit" className="collapsing">
                          <input type="checkbox" checked={elemento.checked} onChange={(event) => this.desasociar(event, elemento.id)} style={{ marginTop: "4px" }} />
                        </td>
                        <td className="add-line-break">{elemento.text}</td>
                      </tr>
                    ))}
                  </thead>
                </table>
                <SweetAlert
                  type="warning"
                  show={modalEliminar}
                  title="Confirmar desasoción"
                  text={` Señor usuario, ¿Esta segura que desea desasociar esta ${tituloCompleto}?`}
                  confirmButtonColor="#DD6B55"
                  confirmButtonText="Sí, estoy seguro!"
                  cancelButtonText="Cancelar"
                  showCancelButton={true}
                  onCancel={() => this.setState({ modalEliminar: false })}
                  onConfirm={() => this.eliminarObjetoAsociado(idObjetoEliminar)}
                />
              </Col>
            </Row>)
          ) :
          null
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      dispatchUpdateElementFromList: updateElementFromList,
      dispatchUpdateActiveFieldObject: updateActiveFieldObject,
      dispatchUpdateElementoAsociado: updateElementoAsociado,
      dispatchSaveTemporalChanges: saveTemporalChanges,
      dispatchDiscardTemporalChanges: discardTemporalChanges,
      dispatchOpenLinkModal: openLinkModal
    },
    dispatch
  );

const mapStateToProps = (
  { objectListReducer, clientInformation }
) => ({
  objectListReducer,
  clientInformation
});

export default connect(mapStateToProps, mapDispatchToProps)(ListaObjetos);