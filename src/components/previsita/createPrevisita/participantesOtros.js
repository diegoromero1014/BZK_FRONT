import React, {Component} from 'react';
import ListParticipantesOtros from './listParticipantesOtros';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import _ from 'lodash';

class ParticipantesCliente extends Component{

  render(){
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={5.5} lg={5.5} style={{paddingRight: "20px"}}>
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
          <Col xs={12} md={5.5} lg={5.5}>
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
          <Col xs={1} md={1} lg={1}>
            <button className="btn btn-primary" type="button" title="Adicionar participante" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs>
            <ListParticipantesOtros />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ParticipantesCliente;
