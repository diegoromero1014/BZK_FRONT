import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {COLOR_RED, COLOR_ORANGE, COLOR_GREEN} from '../../clientInformation/constants';

class CovenantsComponent extends Component {


    render() {
        const {contactsByClient} = this.props;
        return (
            <Grid style={{ width: "98%" }}>
                <Row>
                    <div>
                        <Col xs={12} md={4} lg={3} style={{ marginTop: "5px" }}>
                            <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: COLOR_RED }}></div>
                            <span style={{ marginLeft: '10px' }}> Tarea vencida</span>
                        </Col>
                        <Col xs={12} md={4} lg={3} style={{ marginTop: "5px" }}>
                            <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: COLOR_ORANGE }}></div>
                            <span style={{ marginLeft: '10px' }}> Tarea próxima a vencerse</span>
                        </Col>
                        <Col xs={12} md={4} lg={3} style={{ marginTop: "5px" }}>
                            <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: COLOR_GREEN }}></div>
                            <span style={{ marginLeft: '10px' }}> Tarea con tiempo</span>
                        </Col>

                    </div>
                </Row>
                <Row>
                    <Col>
                        <ListClientsPendingUpdate />
                    </Col>
                </Row>
            </Grid>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        contactsByClientFindServer, clearContactPaginator, orderColumnContact, clearContactOrder
    }, dispatch);
}

function mapStateToProps({contactsByClient, reducerGlobal}, ownerProps) {
    return {
        contactsByClient,
        reducerGlobal
    };
}


function mapStateToProps({navBar}, ownerProps) {
    return {
        navBar
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CovenantsComponent);
