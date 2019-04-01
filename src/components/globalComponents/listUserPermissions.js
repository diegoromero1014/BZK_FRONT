import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import SweetAlert from '../sweetalertFocus';

import { deleteUser } from './actions';

import { DELETE_PARTICIPANT_VIEW, KEY_PARTICIPANT_BANCO } from './constants';

class ListUserPermissions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirmDeleteUser: false,
            idUserSelect: null
        };

        this._mapValuesData = this._mapValuesData.bind(this);
        this._clickButtonDelete = this._clickButtonDelete.bind(this);
    }

    _confirmDeleteUser(idData) {
        this.setState({
            showConfirmDeleteUser: true,
            idUserSelect: idData
        });
    }

    _clickButtonDelete() {
        const { usersPermission, deleteUser } = this.props;
        var indexDelete = usersPermission.findIndex(item => {
            return item.idParticipante === this.state.idUserSelect;
        });

        this.setState({
            showConfirmDeleteUser: false,
            idUserSelect: null
        });

        deleteUser(indexDelete, KEY_PARTICIPANT_BANCO);
    }

    _mapValuesData(userData, idx) {
        var { disabled } = this.props;
        return <div className="item" key={idx}>
            <span style={{ paddingRight: '10px', fontWeight: 'bold', color: 'black' }} >{userData.name}</span>
            <i className="remove icon"
                onClick={this._confirmDeleteUser.bind(this, userData.id)}
                style={disabled === 'disabled' ? { display: 'none' } : { float: 'right', margin: '0em', fontSize: '1.2em' }}
                title="Eliminar usuario"
            ></i>
        </div>
    }

    

    render() {

        let renderUsuarios = this.props.arrayUsersPermission.map(this._mapValuesData);

        return (
            <div className="ui divided selection list" style={{ paddingRight: '23px', height: "160px", overflow: 'scroll' }}>
                {renderUsuarios}                
                <SweetAlert
                    type="warning"
                    show={this.state.showConfirmDeleteUser}
                    title="Eliminación usuario"
                    text="¿Señor usuario, está seguro que desea eliminar el usuario?"
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    showCancelButton={true}
                    onCancel={() => this.setState({ showConfirmDeleteUser: false })}
                    onConfirm={this._clickButtonDelete} />
            </div>
        );
    }
}

function orderListUsers(usersPermission, disabled) {

    if (usersPermission.size > 0) {
        var data = _.chain(usersPermission.toArray()).map(participant => {
            const { idParticipante, nombreParticipante } = participant;
            if (disabled === 'disabled') {
                return _.assign({}, {
                    name: nombreParticipante, id: idParticipante
                });
            } else {
                return _.assign({}, {
                    name: nombreParticipante, id: idParticipante,
                    'delete': {
                        typeDelete: DELETE_PARTICIPANT_VIEW,
                        id: idParticipante,
                        mensaje: "¿Señor usuario, está seguro que desea eliminar el usuario?"
                    }
                });
            }
        }).value();

        if (data != null) {
            return data;
        }
    }
    return [];
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteUser
    }, dispatch);
}

function mapStateToProps({ usersPermission }, ownerProps) {
    const disabled = _.get(ownerProps, 'disabled', '');
    return {
        usersPermission,
        disabled,
        arrayUsersPermission: orderListUsers(usersPermission, disabled)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUserPermissions);