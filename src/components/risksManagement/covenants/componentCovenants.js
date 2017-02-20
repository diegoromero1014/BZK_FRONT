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
