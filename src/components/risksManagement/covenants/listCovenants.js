import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Col} from 'react-flexbox-grid';
import GridComponent from '../../grid/component';
import {redirectUrl} from '../../globalComponents/actions'
import {mapDataGrid} from './covenantsUtilities';
import {get} from 'lodash';
import {showLoading} from '../../loading/actions';
import {clientCovenants} from './actions';
import {GREEN_COLOR, ORANGE_COLOR, RED_COLOR, GRAY_COLOR, MESSAGE_LOAD_DATA, MODULE_COVENANTS} from '../../../constantsGlobal';
import { validatePermissionsByModule } from '../../../actionsGlobal';

class ListCovenantsComponent extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
    }

    componentWillMount() {
        const {clientCovenants, showLoading, validatePermissionsByModule} = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);
        clientCovenants().then((data) => {
            showLoading(false, "");
            if (!get(data, 'payload.data.validateLogin') || get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            }else{
                validatePermissionsByModule(MODULE_COVENANTS).then((data) => {
                    if (!get(data, 'payload.data.validateLogin') || get(data, 'payload.data.validateLogin') === 'false') {
                        redirectUrl("/login");
                    } else {
                        if (!_.get(data, 'payload.data.data.showModule') || get(data, 'payload.data.data.showModule') === 'false') {
                            redirectUrl("/dashboard");
                        }
                    }
                });
            }
        });
    }

    _renderHeaders() {
        return [
            {
                title: "",
                key: "actions"
            },
            {
                title: "Id covenant",
                key: "idCovenant"
            },
            {
                title: "Entidad/Línea de negocio",
                key: "lineOfBusiness"
            },
            {
                title: "Gerente responsable",
                key: "managerAccount"
            },
            {
                title: "Covenant",
                key: "covenant"
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
    }

    _renderCellView(data) {
        return mapDataGrid(data);
    }

    render() {
        const modalTitle = 'Creación de seguimientos';
        const {covenant} = this.props;
        const data = covenant.get('responseCovenant');
        return (
            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                {data.length > 0 ?
                    <div>
                        <Row xs={12} md={12} lg={12} style={{marginBottom: '20px'}}>
                        <Col xs={12} md={4} lg={3} style={{marginTop: "5px", display: '-webkit-inline-box'}}>
                            <div className="traffickLigth-item-covenants" style={{backgroundColor: RED_COLOR,
                                display: "-ms-inline-flexbox"}}/>
                            <span style={{
                                marginLeft: '5px',
                                marginRight: '10px'
                            }}>Covenants con seguimiento pendiente</span>
                        </Col>
                        <Col xs={12} md={4} lg={3} style={{marginTop: "5px", display: '-webkit-inline-box'}}>
                            <div className="traffickLigth-item-covenants" style={{backgroundColor: ORANGE_COLOR,
                                display: "-ms-inline-flexbox"}}/>
                            <span style={{
                                marginLeft: '5px',
                                marginRight: '10px'
                            }}>Covenants con seguimiento próximo mes</span>
                        </Col>
                        <Col xs={12} md={4} lg={3} style={{marginTop: "5px", display: '-webkit-inline-box',
                                display: "-ms-inline-flexbox"}}>
                            <div className="traffickLigth-item-covenants" style={{backgroundColor: GREEN_COLOR}}/>
                            <span style={{
                                marginLeft: '5px',
                                marginRight: '10px'
                            }}>Covenants con revisión posterior</span>
                        </Col>
                        <Col xs={12} md={4} lg={3} style={{marginTop: "5px", display: '-webkit-inline-box'}}>
                            <div className="traffickLigth-item-covenants" style={{backgroundColor: GRAY_COLOR,
                                display: "-ms-inline-flexbox"}}/>
                            <span style={{
                                marginLeft: '5px',
                                marginRight: '10px'
                            }}>Covenants inactivos</span>
                        </Col>
                    </Row>
                        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)}
                                       modalTitle={modalTitle}/>
                    </div> :
                    <div style={{display: 'block', width: "100%"}}>
                        <Row center="xs">
                            <Col xs={12} sm={8} md={12} lg={12} style={{marginTop: '15px'}}>
                                <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientCovenants,
        redirectUrl,
        showLoading,
        validatePermissionsByModule
    }, dispatch);
}

function mapStateToProps({covenant, reducerGlobal}, ownerProps) {
    return {
        covenant,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCovenantsComponent);
