import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';

class AuditFiles extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { visible, createdBy, createdTimestamp, updatedBy, updatedTimestamp } = this.props;
        let showAuditFiles = visible ? 'visible' : 'hidden';
        let fechaModString = '', fechaCreateString = '';
        if (createdTimestamp !== null) {
            let fechaCreateDateMoment = moment(createdTimestamp, "x").locale('es');
            fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
        }
        if (updatedTimestamp !== null) {
            let fechaModDateMoment = moment(updatedTimestamp, "x").locale('es');
            fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
        }
        return (
            <div>
                < Row style={{ margin: "20px 0px 0px 20px", visibility: showAuditFiles }}>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ fontWeight: "bold", color: "#818282" }}>Creado por</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de creación</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null &&
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Modificado por</span>
                        }
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null &&
                            <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de modificación</span>
                        }
                    </Col>
                </Row>
                <Row style={{ margin: "5px 0px 0px 20px", visibility: showAuditFiles }}>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{createdBy}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaCreateString}</span>
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null &&
                            <span style={{ marginLeft: "0px", color: "#818282" }}>{updatedBy}</span>
                        }
                    </Col>
                    <Col xs={6} md={3} lg={3}>
                        {updatedBy !== null &&
                            <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
                        }
                    </Col>
                </Row>
            </div >
        );
    }

}

export default AuditFiles;