import React, {Component} from 'react';
import ListParticipantesCliente from './listParticipantesCliente';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import _ from 'lodash';

class ParticipantesOtros extends Component{

  render(){
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
              <div className="InputAddOn">
                <input type="text" style={{padding: '0px 11px !important'}} placeholder="Búsqueda por nombre" className="input-lg input InputAddOn-field"/>
                <button id="searchPersona" className="btn" title="Buscar persona" type="button" style={{backgroundColor:"#E0E2E2"}}>
                  <i className="search icon" style={{margin:'0em', fontSize : '1.2em'}} />
                </button>
              </div>
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                max="120"
                placeholder="Cargo de la persona"
              />
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Estilo social</span></dt>
              <ComboBox
                name="estiloSocial"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={12} md={2.9} lg={2.9}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Actitud frente al grupo</span></dt>
              <ComboBox
                name="actitudGrupo"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={1} md={0.1} lg={0.1}>
            <button className="btn btn-primary" type="button" title="Adicionar participante" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs>
            <ListParticipantesCliente />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ParticipantesOtros;
