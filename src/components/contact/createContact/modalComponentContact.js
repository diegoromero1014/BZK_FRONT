import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {toggleModalContact} from './actions';
import {bindActionCreators} from 'redux';
import * as views from './constants';
import {DateTimePicker} from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

class ModalComponentContact extends Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        momentLocalizer(moment);
    }

    closeModal() {
        this.props.toggleModalContact();
    }

    render() {
        const {modalStatus} = this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
        return (
          <Modal
              isOpen={modalStatus}
              onRequestClose={this.closeModal}
              className="modalBt4-fade modal fade contact-detail-modal in">
              <div className="modalBt4-dialog modalBt4-lg">
                  <div className="modalBt4-content modal-content">
                      <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Contacto</h4>
                      <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                        <span className="sr-only">Close</span>
                      </button>
                      </div>
                      <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
                      <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información básica contacto</span></dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                            <Row>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tipo de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Número de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                <button className="btn btn-primary" style={{marginTop: '35px'}}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="search  icon" ></i></button>
                                </dl>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tratamiento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Género (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Primer nombre (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                                </dl>
                                </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo nombre</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Primer apellido (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo apellido</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Cargo</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Área dependencia</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Fecha nacimiento</span></dt>
                                <dd><DateTimePicker time={false}/></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Estilo social</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Actitud frente al Grupo</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt className="col-md-12 business-title">Información de ubicación y correspondencia</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>País (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Departamento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Ciudad (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Dirección (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><textarea /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Barrio</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Código postal</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Teléfono (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Extensión</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Celular</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Correo electrónico (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt className="col-md-12 business-title">Clasificación de contacto</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Tipo de contacto (<span style={{color: 'red'}}>*</span>)</span></dt>
                            <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                          </dl>
                          </Col>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Entidad /línea de negocio</span></dt>
                            <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                          </dl>
                          </Col>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Función (<span style={{color: 'red'}}>*</span>)</span></dt>
                            <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      <dt className="col-md-12 business-title">Hobbies y Deportes</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Hobbie</span></dt>
                            <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                          </dl>
                          </Col>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Deporte</span></dt>
                            <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      </div>
                        <div className="modalBt4-footer modal-footer">
                        <button type="button" className="btn btn-primary modal-button-edit" onClick={this.closeModal}>Guardar
                        </button>
                            <button type="button" className="btn cancel modal-button-edit" data-dismiss="modal"
                                    onClick={this.closeModal}>Cancelar
                            </button>

                        </div>
                  </div>
              </div>
          </Modal>
        );
    }
}

function mapStateToProps({createContactReducer}) {
    return {
        modalStatus: createContactReducer.get('modalState')
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModalContact
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentContact);
