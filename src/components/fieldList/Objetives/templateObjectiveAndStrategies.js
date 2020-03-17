import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import {helpText} from './utils';
import Title from '../../clientEdit/sections/title';

export default function TemplateObjectiveAndStrategies({buttons, objetivo, strategies}) {

    return (
        <Row className="row-element" style={{ margin: "5px" }}>
                    <Col xs={12} style={{}}>
                        <div className="element-buttons" style={{
                            height: "100%",
                            width: "50px",
                            backgroundColor: "#E6E6E6",
                            borderRadius: "3px",
                            float: "left",
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            {buttons}
                        </div><div style={{ display: "block" }}>
                            <Row>
                                <Col md={12} sm={12}>
                                    <Row>
                                        <Col md={6} sm={12}>
                                            <Title
                                                text="Objetivo"
                                                isSection={false}
                                                helpText={helpText}
                                            />
                                        </Col>
                                        <Col md={6} sm={12}>
                                            <Title
                                                text="Estrategias"
                                                isSection={false}
                                                helpText="¿Que estrategias esta implementando el cliente para cumplir sus objetivos?"
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <div className="section-list-divider" style={{}} >
                                                <Row>
                                                    <Col md={6} sm={12} style={{ padding: "10px", marginTop: "10px" }} >
                                                        <div>
                                                            <Row>

                                                                <Col md={12} className="add-line-break">
                                                                    {objetivo.value}
                                                                </Col>

                                                            </Row>
                                                        </div>
                                                    </Col>
                                                    <Col md={6} sm={12}>
                                                        <div style={{ padding: "10px" }} className="section-list-parent">

                                                            {(!strategies || !strategies.length) && <div className="elements-not-found">
                                                                <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px", padding: "5px", border: "1px solid #ECECEC" }}>
                                                                    <span className="form-item">No se han adicionado Estrategias.</span>
                                                                </div>
                                                            </div>}

                                                            {strategies && strategies.map((strategy) => (
                                                                <Row className="section-list-divider">
                                                                    <div style={{ margin: "10px 0 10px 0" }}>
                                                                        <Col md={12} className="add-line-break">
                                                                            {strategy.value}
                                                                        </Col>
                                                                    </div>
                                                                </Row>
                                                            ))}
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>

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
    )

}