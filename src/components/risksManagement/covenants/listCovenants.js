import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import GridComponent from '../../grid/component';
import { redirectUrl } from '../../globalComponents/actions'
import { mapDataGrid } from './covenantsUtilities';
import { get, indexOf, has } from 'lodash';
import { showLoading } from '../../loading/actions';
import { clientCovenants } from './actions';
import {GREEN_COLOR, ORANGE_COLOR, RED_COLOR, GRAY_COLOR}from '../../../constantsGlobal';


class ListCovenantsComponent extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }


    componentWillMount() {
        const {clientCovenants} = this.props;
        clientCovenants().then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }
        });
    }


    _renderHeaders() {

        const headersTable = [
            {
                title: "",
                key: "actions"
            },
            {
                title: "Id covenant",
                key: "idCovenant"
            },
            {
                title: "Negocio/Producto",
                key: "lineOfBusiness"
            },
            {
                title: "Gerente responsable",
                key: "managerAccount"
            },
            {
                title: "Descripción covenant",
                key: "descriptionRecord"
            },
            {
                title: "Acta o contrato",
                key: "agreement"
            },
            {
                title: "",
                key: "trafficLight"
            },
            {
                title: "Fecha próximo seguimiento",
                key: "lastUpdateDate"
            }
        ];

        return headersTable;
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const modalTitle = 'Creación de seguimientos';
        const {covenant} = this.props;
        const data = covenant.get('responseCovenant');

        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'hidden', background: '#fff' }}>
                <Row xs={12} md={12} lg={12} style={{marginBottom: '20px'}}>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{backgroundColor: RED_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}> Covenant vencido</span>
                    </Col>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: ORANGE_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}> Covenant próximo a vencerse</span>
                    </Col>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: GREEN_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}> Covenant con tiempo</span>
                    </Col>
                    <Col xs={12} md={4} lg={3} style={{ marginTop: "5px", display: '-webkit-inline-box' }}>
                        <div className="traffickLigth-item-covenants" style={{ backgroundColor: GRAY_COLOR }}></div>
                        <span style={{ marginLeft: '10px' }}> Covenant inactivo</span>
                    </Col>
                </Row>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientCovenants,
        redirectUrl,
        showLoading
    }, dispatch);
}

function mapStateToProps({covenant, reducerGlobal}, ownerProps) {
    return {
        covenant,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCovenantsComponent);
