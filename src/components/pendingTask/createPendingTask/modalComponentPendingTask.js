import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import {NUMBER_RECORDS} from '../constants';
import _ from 'lodash';


class ModalComponentPendingTask extends Component {


  render(){
    return (
        <form>
          <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
              <Row>
                  <Col xs>
                  <dl style={{width: '100%'}}>
                    <dt><span>Responsable</span></dt>
                    <dd>
                    </dd>
                  </dl>
                  </Col>
                  <Col xs>
                  <dl style={{width: '100%'}}>
                    <dt><span></span></dt>
                    <dd><InputComponent
                      name="numeroDocumento"
                      max="25"
                      type="text"
                    /></dd>
                  </dl>
                  </Col>
                  <Col xs>
                  <dl style={{width: '100%'}}>
                    <dt><span>Número de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                    <dd><InputComponent
                      name="numeroDocumento"
                      max="25"
                      type="text"
                    /></dd>
                  </dl>
                  </Col>
              </Row>
              <Row>
              <Col xs={12} md={12} lg={12}>
                <dt>
                  <div style={{width: "100%", float: "left"}}>
                    <span title="La longitud máxima del campo es de 150 caracteres">Observaciones</span>
                  </div>
                </dt>
                <Textarea
                  name="observaciones"
                  type="text"
                  max="150"
                  title="La longitud máxima de caracteres es de 150"
                  style={{width: '100%', height: '100%'}}
                />
              </Col>
                </Row>
                <Row>
                <Col xs={12} md={12} lg={12}>
                  <dt>
                    <div style={{width: "100%", float: "left"}}>
                      <span title="La longitud máxima del campo es de 150 caracteres">Observaciones</span>
                    </div>
                  </dt>
                  <Textarea
                    name="observaciones"
                    type="text"
                    max="150"
                    title="La longitud máxima de caracteres es de 150"
                    style={{width: '100%', height: '100%'}}
                  />
                </Col>
                  </Row>
            </div>
          </div>
          <div className="modalBt4-footer modal-footer">
              <button type="submit"
                className="btn btn-primary modal-button-edit">Guardar
            </button>
          </div>
        </form>
    );
  }
}




export default (ModalComponentPendingTask);
