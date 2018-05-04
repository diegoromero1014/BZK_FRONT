import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clientsPendingUpdateFindServer, changePage, changeKeyword } from './actions';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import {CODE_ALERT_PENDING_UPDATE_CLIENT} from '../alerts/constants';
import {getAlertsByUser} from '../alerts/actions';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import SweetAlertFocus from '../sweetalertFocus';
import {showLoading} from '../loading/actions';
import {updateTabSeleted} from '../clientDetailsInfo/actions';
import _ from 'lodash';

class SearchBarClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._closeError = this._closeError.bind(this);
    }

    _closeError() {
        this.setState({ showEr: false });
    }

    componentWillMount() {
        const { login, updateTabSeleted, getAlertsByUser } = this.props;
        const self = this;
        updateTabSeleted(null);
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        }
        getAlertsByUser().then((data) => {
            _.get(data, 'payload.data.data').map((item, idx) => {
                if (item.codeAlert === CODE_ALERT_PENDING_UPDATE_CLIENT && !item.active) {
                    self.setState({ openMessagePermissions: true });
                }
            });
        });
    }

    _handleChangeKeyword(e, val) {
        const { changeKeyword, swtShowMessage } = this.props;
        changeKeyword(e.target.value);
        console.log("val",val)
        if (e.keyCode === 13 || e.which === 13) {
            if (e.target.value < 3) {
                swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
                return;
            } else {
                this._handleClientsFind(e);
            }
        }
    }

    _handleClientsFind(e) {
        const { clientsPendingUpdateFindServer, alertPendingUpdateClient, showLoading, changePage } = this.props;
        const keyWordNameNit = alertPendingUpdateClient.get('keywordNameNit');
        if (keyWordNameNit === '' || keyWordNameNit === undefined) {
            this.setState({ showEr: true });
        } else {
            const idTeam = alertPendingUpdateClient.get('idTeam');
            const idRegion = alertPendingUpdateClient.get('idRegion');
            const idZone = alertPendingUpdateClient.get('idZone');
            const order = alertPendingUpdateClient.get('order');
            const columnOrder = alertPendingUpdateClient.get('columnOrder');
            showLoading(true, 'Cargando..');
            clientsPendingUpdateFindServer(keyWordNameNit, idTeam, idRegion, idZone, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    changePage(1);
                    showLoading(false, null);
                }
            });
        }
    }

    render() {
        const { alertPendingUpdateClient } = this.props;
        var keyword = alertPendingUpdateClient.get('keywordNameNit');
        return (
            <div style={{ marginLeft: '17px' }}>
                <div className="InputAddOn">
                    <input type="text" style={{ padding: '0px 11px !important' }} placeholder="Buscar por cliente o NIT"
                        value={keyword} onKeyPress={this._handleChangeKeyword} onChange={ val => this._handleChangeKeyword(val)}
                        className="input-lg input InputAddOn-field" />
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button"
                        onClick={this._handleClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
                        <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                    </button>
                </div>
                <SweetAlertFocus
                    type="error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this._closeError()}
                />
                <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clientsPendingUpdateFindServer,
        changePage,
        changeKeyword,
        updateTabSeleted,
        redirectUrl,
        showLoading,
        getAlertsByUser
    }, dispatch);
}

function mapStateToProps({ alertPendingUpdateClient }, ownerProps) {
    return {
        alertPendingUpdateClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
