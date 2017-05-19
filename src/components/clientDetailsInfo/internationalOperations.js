import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';

class InternationalOperations extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {infoClient} = this.props;
    var operationsForeignCurrency = '';
    if(infoClient.operationsForeignCurrency === 1){
      operationsForeignCurrency = 'Si'
    }else{
      if(infoClient.operationsForeignCurrency === 0){
        operationsForeignCurrency = 'No'
      }
    }
    return(
      <div className="tab-content-row" style={{marginTop: "30px", borderTop: "1px dotted #cea70b"}}>
        <Row>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>¿Realiza operaciones en moneda extranjera?</span>
          </Col>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>¿Cuál(es) de las siguientes operaciones realiza en moneda extranjera? </span>
          </Col>
        </Row>
        <Row>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{operationsForeignCurrency}</span>
          </Col>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.operationsForeignsKeys}</span>
          </Col>
        </Row>
        <Row style={{paddingTop: "10px"}}>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>¿Cuál?</span>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.otherOperationsForeign}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

InternationalOperations.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default InternationalOperations;
