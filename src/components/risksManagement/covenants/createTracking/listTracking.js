import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import SweetAlert from 'sweetalert-react';
import _ from 'lodash';
import moment from 'moment';

var arrayValueTracking = [];

class ListTracking extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {covenant} = this.props;
        return (
            <div>
                { 0 > 0 ?
                    <Row xs={12} md={12} lg={12}>
                        <Col xs={12} md={12} lg={12}>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Fecha seguimiento</th>
                                        <th>Covenant vigente</th>
                                        <th>Cumplimineto del covenant</th>
                                        <th>Valor observado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </Col>
                    </Row> :
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">Aún no se han registrado seguimientos</span>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({covenant}) {
    return {
        covenant
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTracking);