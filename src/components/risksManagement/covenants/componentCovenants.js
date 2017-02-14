import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';

class CovenantsComponent extends Component {


    render() {
        const {contactsByClient} = this.props;
        const modalTitle = 'Contacto Detalle';
        const data = contactsByClient.get('contacts');
        return (
            <Grid style={{width: "98%"}}>
                <Row>
                    <Col xs>
                        <ListClientsPendingUpdate />
                        <Pagination/>
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
