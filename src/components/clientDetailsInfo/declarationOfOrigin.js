import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';

class DeclarationOfOrigin extends Component{

  constructor(props){
    super(props);
  }

  render(){
    const {infoClient} = this.props;
    return(
      <div className="tab-content-row" style={{marginTop: "30px", borderTop: "1px dotted #cea70b"}}>
        <Row>
          <Col xs={12} md={12} lg={12} style={{paddingRight: "20px"}}>
            <dl style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <i className="money icon" style={{fontSize: "25px"}}></i>
              <span className="title-middle"> Declaración de origen de bienes y/o fondos</span>
            </dl>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>Origen de bienes</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>¿Cuál?</span>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.originGoodsKeys}</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.otherOriginGoods}</span>
          </Col>
        </Row>
        <Row style={{paddingTop: "10px"}}>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>Origen de recursos</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>¿Cuál?</span>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.originResourcesKeys}</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.otherOriginResource}</span>
          </Col>
        </Row>
        <Row style={{paddingTop: "10px"}}>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>País de origen</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{fontWeight: "bold", color: "#4C5360"}}>Ciudad origen de los recursos</span>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8} lg={8} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.countryOriginKey}</span>
          </Col>
          <Col xs={4} md={4} lg={4} style={{paddingRight: "20px"}}>
            <span style={{width: "25%", verticalAlign: "initial"}}>{infoClient.originCityResource}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

DeclarationOfOrigin.PropTypes = {
  infoClient: PropTypes.object.isRequired
}

export default DeclarationOfOrigin;
