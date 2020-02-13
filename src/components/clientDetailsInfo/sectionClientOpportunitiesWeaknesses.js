import React, { Component } from "react";
import { Row, Col } from "react-flexbox-grid";

export class SectionClientOpportunitiesWeaknesses extends Component {

  render() {

    const { infoClient } = this.props;
    const opportunities = infoClient ? infoClient.clientDetailsRequest.opportunities : [];
    const weaknesses = infoClient ? infoClient.clientDetailsRequest.weaknesses : [];

    return (
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "50%" }}>
            <Row style={{ padding: "20px 23px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <div className="header-component">
                        <div className="line-topComponent" />
                            <div className="container-titleHelpPlus">
                            <div><i className='thumbs up outline icon' /><span className="title-component">{`Oportunidades (externas)`}</span></div>
                        </div>
                    </div>
                </Col>
            </Row>
            { opportunities && opportunities.length ? (
                <Row className='list-objects-opportunities' style={{ padding: "5px 23px 5px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }}>
                        <table className="ui striped table">
                            <thead>
                                { opportunities.map(item => (
                                    <tr key={item.id}><td className="add-line-break">{item.text}</td></tr>
                                ))}
                            </thead>
                        </table>
                    </Col>
                </Row>
                ) : (
                <Row style={{ padding: "5px 23px 5px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }} >
                        <table className="ui striped table"><thead><tr className="tr-void"><span>No se han adicionado Oportunidades externas.</span></tr></thead></table>
                    </Col>
                </Row>
            )}
            </div>
          <div style={{ width: "50%" }}>
            <Row style={{ padding: "20px 23px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <div className="header-component">
                        <div className="line-topComponent" />
                        <div className="container-titleHelpPlus">
                        <div><i className='thumbs down outline icon' /><span className="title-component">{`Debilidades (internas del cliente)`}</span></div>
                        </div>
                    </div>
                </Col>
            </Row>
            {weaknesses && weaknesses.length ? (
                <Row className='list-objects-weaknesses' style={{ padding: "5px 23px 5px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }}>
                        <table className="ui striped table">
                            <thead>
                                { weaknesses.map(item => (
                                    <tr key={item.id}><td className="add-line-break">{item.text}</td></tr>
                                ))}
                            </thead>
                        </table>
                    </Col>
                </Row>
                ) : (
                <Row style={{ padding: "5px 23px 5px 20px" }}>
                    <Col xs={12} md={12} lg={12} style={{ paddingRight: "15px", marginTop: "15px" }} >
                    <table className="ui striped table"><thead><tr className="tr-void"><span>No se han adicionado Debilidades internas del cliente.</span></tr></thead></table>
                    </Col>
                </Row>
            )}
            </div>
        </div>
    )}
}

export default SectionClientOpportunitiesWeaknesses;