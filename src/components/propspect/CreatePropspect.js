import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectTypeDocument from '../selectsComponent/SelectTypeDocument/ComponentTypeDocument';

var typeDocument = [
  { id: 0, name: 'TI'},
  { id: 1, name: 'CC'},
  { id: 2, name: 'NIT'}
];

class CreatePropspect extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      namePropspect: null
    };
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _handleChangeName(){
    this.setState({
      namePropspect: e.target.value
    })
  }

  render(){
    return(
      <Row style={{padding: "10px 10px 20px 10px", boxShadow: "-2px 2px 4px 0 rgba(0, 0, 0, 0.2)"  }}>
        <Col xs={12} md={4} lg={5}>
          <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
          <dd className="input-with-icon  right success-control">
            <SelectTypeDocument />
          </dd>
        </Col>
        <Col xs={10} md={4} lg={5}>
          <dt><span>Número de documento (</span><span style={{color: "red"}}>*</span>)</dt>
            <input type="text" className="form-control" style={{height: "22px !important", minHeight: "22px !important"}}
              placeholder="Ingrese el número de documento del usuario"/>
        </Col>
        <Col xs={2} md={4} lg={2}>
          <button className="btn btn-default" onClick={this._clickButtonCreateProps} type="button" title="Crear prospecto"
            style={{backgroundColor:"#66778d", marginLeft:"30px", marginTop: "20px", paddingTop: "4px !important"}}>
            <i className="icon-search" style={{color: "white"}}></i>
          </button>
        </Col>
      </Row>
    );
  }

}

export default CreatePropspect;
