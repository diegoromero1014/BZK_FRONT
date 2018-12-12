import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import _ from 'lodash';

import { deleteBusiness } from './ducks';
import BtnCreateBusiness from '../btnCreateBusiness';
import SweetAlert from '../../sweetalertFocus';
import BtnEditBusiness from '../btnEditBusiness';

import { shorterStringValue } from '../../../actionsGlobal';

import { PRODUCTS_MASK, PIPELINE_BUSINESS, PIPELINE_STATUS } from '../../selectsComponent/constants';

var idBusinessSeleted = null;

class ListBusiness extends Component {
    state = {
        showConfirmDeleteBusiness: false,
        actions: {},
        modalIsOpen: false
    };

    static propTypes = {};

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    _confirmDeleteBusiness = (idBusiness) => {
        idBusinessSeleted = idBusiness;
        this.setState({
            showConfirmDeleteBusiness: true
        });
    };

    _deleteBusiness = () => {
        const { deleteBusiness } = this.props;
        deleteBusiness(idBusinessSeleted);
        this.setState({
            showConfirmDeleteBusiness: false
        });
        idBusinessSeleted = null;
    };

    _mapValuesBusiness = (businessData, idx) => {
        const { selectsReducer, disabled } = this.props;
        const products = selectsReducer.get(PRODUCTS_MASK);
        const business = selectsReducer.get(PIPELINE_BUSINESS);
        const states = selectsReducer.get(PIPELINE_STATUS);
        const { uuid, product, businessStatus } = businessData;
        let nameProduct, nameBusiness, nameState;

        if (product !== null && product !== '' && product !== undefined) {
            nameProduct = _.get(_.filter(products, ['id', parseInt(product)]), '[0].value');
        }

        nameState = _.get(_.filter(states, ['id', parseInt(businessStatus)]), '[0].value');

        return <tr key={idx}>
            <td className="collapsing">
                <BtnEditBusiness pipelineBusiness={businessData} disabled={disabled} />
            </td>
            <td>{shorterStringValue(nameProduct, 50)}</td>
            <td>{shorterStringValue(nameState, 30)}</td>
            <td className="collapsing">
                <i className="remove icon" title="Eliminar negocio"
                    onClick={this._confirmDeleteBusiness.bind(this, businessData.uuid)}
                    style={disabled ? { cursor: "pointer" } : { display: 'none' }} />
            </td>
        </tr>
    }

    render() {
        let disabledButtonCreate = '';
        const { disabled, businessList } = this.props;
        if (businessList.size === 10) {
            disabledButtonCreate = 'disabled';
        } else {
            disabledButtonCreate = '';
        }
        
        const modalTitle = 'Negocio detalle';

        return (
            <div className="tab-content break-word" style={{
                zIndex: 0,
                border: '1px solid #cecece',
                padding: '16px',
                borderRadius: '3px',
                overflow: 'initial',
                marginTop: "10px"
            }}>
                {disabled && <BtnCreateBusiness disabled={disabledButtonCreate} />}

                {businessList.size > 0 ?
                    <Row style={disabled ? { marginTop: '20px' } : {}}>
                        <Col xs>
                            <table className="ui striped table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Producto</th>
                                        <th>Estado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {businessList.map(this._mapValuesBusiness)}
                                </tbody>
                            </table>
                        </Col>
                    </Row> :
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <span className="form-item">Aún no se han adicionado negocios</span>
                            </div>
                        </Col>
                    </Row>
                }
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDeleteBusiness}
                    title="Eliminación negocio"
                    text="¿Señor usuario, está seguro que desea eliminar el negocio?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDeleteBusiness: false })}
                    onConfirm={this._deleteBusiness} />
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteBusiness
    }, dispatch);
}

function mapStateToProps({ pipelineBusinessReducer, selectsReducer }) {
    return {
        businessList: pipelineBusinessReducer.toList(),
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusiness);