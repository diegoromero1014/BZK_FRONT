/**
 * Created by Andres Hurtado on 02/03/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {blackListFindServer, changePage, changeKeywordClient} from './actions';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import {CODE_BLACK_LIST_ALERT} from '../alerts/constants';
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
        this._handleChangeKeywordClient = this._handleChangeKeywordClient.bind(this);
        this._closeError = this._closeError.bind(this);
    }

    _closeError() {
        this.setState({showEr: false});
    }

    componentWillMount() {
        const {login, updateTabSeleted, getAlertsByUser} = this.props;
        const self = this;
        updateTabSeleted(null);
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        }
        getAlertsByUser().then((data) => {
            _.get(data, 'payload.data.data').map((item, idx) => {
                if (item.codeAlert === CODE_BLACK_LIST_ALERT && !item.active) {
                    self.setState({openMessagePermissions: true});
                }
            });
        });
    }

    _handleChangeKeywordClient(e) {
        const {changeKeywordClient} = this.props;
        changeKeywordClient(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this._handleClientsFind(e);
        }
    }

    _handleClientsFind(e) {
        const {blackListFindServer, alertBlackList, changePage, showLoading} = this.props;
        const keywordNameNitClient = alertBlackList.get('keywordNameNitClient');
        if (keywordNameNitClient === '' || keywordNameNitClient === undefined) {
            this.setState({showEr: true});
        } else {
            const typeEntity = alertBlackList.get('typeEntity');
            const keyWordNameNit = alertBlackList.get('keywordNameNit');
            const order = alertBlackList.get('order');
            const columnOrder = alertBlackList.get('columnOrder');
            showLoading(true, 'Cargando..');
            blackListFindServer(keyWordNameNit, keywordNameNitClient,typeEntity, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    showLoading(false, null);
                    changePage(1);
                }
            });
        }
    }

    render() {
        const {alertBlackList} = this.props;
        var keyword = alertBlackList.get('keywordNameNitClient');
        return (
            <div style={{marginLeft: '17px'}}>
                <div className="InputAddOn">
                    <input type="text" style={{padding: '0px 11px !important'}} placeholder="Buscar por nombe o NIT del cliente"
                           value={keyword} onKeyPress={this._handleChangeKeywordClient} onChange={this._handleChangeKeywordClient}
                           className="input-lg input InputAddOn-field"/>
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button"
                            onClick={this._handleClientsFind} style={{backgroundColor: "#E0E2E2"}}>
                        <i className="search icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                    </button>
                </div>
                <SweetAlertFocus
                    type="error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this._closeError()}
                />
                <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions}/>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        blackListFindServer, changePage, changeKeywordClient, updateTabSeleted, redirectUrl, showLoading, getAlertsByUser
    }, dispatch);
}

function mapStateToProps({alertBlackList}, ownerProps) {
    return {alertBlackList};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
