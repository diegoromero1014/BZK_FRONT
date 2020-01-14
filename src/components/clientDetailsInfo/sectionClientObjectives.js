import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";
import Title from '../clientEdit/sections/title';

export class SectionClientObjectives extends Component {

  setInfo = () => {
    const { infoClient } = this.props;
    return infoClient ? infoClient.clientDetailsRequest.objectives : []
  }

  render() {
    
    const objectives = this.setInfo();

    return (
        <div>
            {objectives.length ? objectives.map((objetive) => (
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
                                                        <div><Row><Col md={12} className='add-line-break'>{objetive.text}</Col></Row></div>
                                                    </Col>
                                                    <Col md={6} sm={12}>
                                                        <div style={{ padding: "10px" }} className="section-list-parent">
                                                            {objetive["relations"].length ? objetive["relations"].map((strategy) => (
                                                                <Row className="section-list-divider row-element-child">
                                                                    <div style={{ margin: "10px 0 10px 0" }}><Col md={12} className='add-line-break'>{strategy.clientDetailRelation.text}</Col></div>
                                                                </Row>
                                                            )) : (
                                                                <Row className='row-no-element-child' style={{ padding: "5px 23px 5px 20px" }}>
                                                                  <Col xs={12}md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }}>
                                                                    <table className="ui striped table">
                                                                      <thead>
                                                                        <tr className="tr-void">
                                                                          <span>No se han adicionado estrategias a este objetivo.</span>
                                                                        </tr>
                                                                      </thead>
                                                                    </table>
                                                                  </Col>
                                                                </Row>
                                                              )}
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
            )) : (
                <Row className='row-no-element-parent' style={{ padding: "5px 23px 5px 20px" }}>
                  <Col xs={12}md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }}>
                    <table className="ui striped table">
                      <thead>
                        <tr className="tr-void">
                          <span>No se han adicionado Objetivos del Cliente.</span>
                        </tr>
                      </thead>
                    </table>
                  </Col>
                </Row>
              )}
        </div>
    )}
}

export default SectionClientObjectives;