import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import Title from '../clientEdit/sections/title';

export class SectionClientObjectives extends Component {

  state = {
      objectives: []
  }

  componentDidMount() {
    this.setInfo();
  }

  setInfo = () => {
    const { infoClient } = this.props;
    this.setState({
      objectives: infoClient ? infoClient.clientDetailsRequest.objectives : []
    })
  }

  render() {
    const { objectives } = this.state;

    return (
        <div>
            {objectives && objectives.map((objetive) => (
                <Row className="row-element row-element-parent" style={{margin: "5px"}}>
                    <Col xs={12}>
                        <div style={{display: "block"}}>
                            <Row>
                                <Col md={12} sm={12}>
                                    <Row>
                                        <Col md={6} sm={12} style={{ display: "flex" }}><Title text="Objetivo" isSection={false}/></Col>
                                        <Col md={6} sm={12}><Title text="Estrategias" isSection={false}/></Col>
                                        <Col md={12}>
                                            <div className="section-list-divider">
                                                <Row>
                                                    <Col md={6} sm={12} style={{ display: "flex", padding: "10px", marginTop: "10px" }} >
                                                        <div><Row><Col md={12}>{objetive.text}</Col></Row></div>
                                                    </Col>
                                                    <Col md={6} sm={12}>
                                                        <div style={{ padding: "10px" }} className="section-list-parent">
                                                            {objetive["relations"] && objetive["relations"].map((strategy) => (
                                                                <Row className="section-list-divider row-element-child">
                                                                    <div style={{ margin: "10px 0 10px 0" }}><Col md={12}>{strategy.clientDetailRelation.text}</Col></div>
                                                                </Row>
                                                            ))}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            ))}
        </div>
    )}
}

export default SectionClientObjectives;