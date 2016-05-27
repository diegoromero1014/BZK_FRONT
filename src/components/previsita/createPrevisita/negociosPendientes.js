import React, {Component} from 'react';
import ListNegociosPendientes from './listNegociosPendientes';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import _ from 'lodash';

class NegociosPendientes extends Component{

  render(){
    return(
      <div>
        <Row style={{padding: "0px 25px 20px 20px"}}>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Necesidad</span></dt>
              <ComboBox
                name="necesidad"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <dt><span>Descripción</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtDescripcion"
                type="text"
                max="120"
              />
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4}>
            <dt><span>Avance</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtAvance"
                type="text"
                max="120"
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
            <ListNegociosPendientes />
          </Col>
        </Row>
      </div>
    );
  }
}

export default NegociosPendientes;
