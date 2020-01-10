import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { modifyClientRelationship } from '../../actions';
import { shorterStringValue } from '../../../../actionsGlobal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SweetAlert from '../../../sweetalertFocus';
import _ from 'lodash';

class ListCreateRelationship extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDelete: false,
            idClientDelete: null
        };
        this._mapValuesCreateClientsContact = this._mapValuesCreateClientsContact.bind(this);
        this._removeClientRelationship = this._removeClientRelationship.bind(this);
        this._showAlertRemoveElement = this._showAlertRemoveElement.bind(this);
    }

    _mapValuesCreateClientsContact(clientRelationship, idx) {
        return <tr key={idx}>
            <td>{clientRelationship.document}</td>
            <td>{shorterStringValue(clientRelationship.nameClient, 60)}</td>
            <td>{shorterStringValue(clientRelationship.economicGroup, 60)}</td>
            <td className="collapsing">
                <i className="remove icon" title="Eliminar relación" style={{ cursor: "pointer" }}
                    onClick={() => this._showAlertRemoveElement(clientRelationship.id)} />
            </td>
        </tr>
    }

    _showAlertRemoveElement(idClient) {
        this.setState({
            showConfirmDelete: true,
            idClientDelete: idClient
        });
    }

    _removeClientRelationship() {
        const { modifyClientRelationship, filterContactsReducer } = this.props;
        const idClient = this.state.idClientDelete;
        var arrayClientsRemove = filterContactsReducer.get('clientsCreaterRelationship');
        arrayClientsRemove = _.remove(arrayClientsRemove, (val) => !_.isEqual(val.id, idClient) );
        this.setState({
            showConfirmDelete: false,
            idClientDelete: null
        });
        modifyClientRelationship(arrayClientsRemove);
    }

    render() {
        const { filterContactsReducer, uploadTable } = this.props;
        return (
            <div className="tab-content break-word" style={{ padding: '16px', borderRadius: '3px', overflow: 'initial', position: 'static' }}>
                <Row style={{ marginTop: '20px' }}>
                    <Col xs={12} md={12} lg={12}>
                        <table className="ui striped table">
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Razón social</th>
                                    <th>Grupo económico</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterContactsReducer.get('clientsCreaterRelationship').map(this._mapValuesCreateClientsContact)}
                            </tbody>
                        </table>
                    </Col>
                    <Col>
                        <span>{uploadTable}</span>
                    </Col>
                </Row>
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDelete}
                    title="Confirmar eliminación"
                    text="Señor usuario, ¿Está seguro que desea eliminar el cliente de la lista?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDelete: false })}
                    onConfirm={this._removeClientRelationship} />
            </div>
        )
    };

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        modifyClientRelationship
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer }, ownerProps) {
    return {
        filterContactsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCreateRelationship);