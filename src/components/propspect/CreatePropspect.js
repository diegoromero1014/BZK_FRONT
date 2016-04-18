import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

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
      <div>
        <Grid style={{marginTop: "15px"}}>
          <Row>
            <Col xs={12} md={4} lg={5}>
              <dt><span>Tipo de documento (</span><span style={{color: "red"}}>*</span>)</dt>
              <dd className="input-with-icon  right success-control">
                <select className="form-control"  style={{border: "1px solid #ccc"}}
                  placeholder="Seleccione el tipo de documento del usuario">
                  <option>Seleccione</option>
                  <option>TI</option>
                  <option>CC</option>
                  <option>NIT</option>
                </select>
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
        </Grid>
      </div>
    );
  }

}

export default CreatePropspect;
