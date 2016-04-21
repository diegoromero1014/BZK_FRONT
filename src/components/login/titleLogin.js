import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';

class TitleLogin extends Component{
  render(){
    return(
      <Col lg={8}>
        <h2 className="welcome-title" style={{width:'80%'}}>
  					El viaje de mil millas comienza con un solo paso
  			</h2>
      </Col>
    );
  }
}

export default TitleLogin;
