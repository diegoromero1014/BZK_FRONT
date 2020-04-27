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

export class SearchBarClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this.handleClientsFind = this.handleClientsFind.bind(this);
        this.handleChangeKeywordClient = this.handleChangeKeywordClient.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    closeError = () => {
        this.setState({showEr: false});
    }

    componentWillMount() {
        const { dispatchUpdateTabSeleted, dispatchGetAlertsByUser } = this.props;
        const self = this;
        dispatchUpdateTabSeleted(null);
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        }
        dispatchGetAlertsByUser().then((data) => {
            _.get(data, 'payload.data.data').map((item, idx) => {
                if (item.codeAlert === CODE_BLACK_LIST_ALERT && !item.active) {
                    self.setState({openMessagePermissions: true});
                }
            });
        });
    }

    handleChangeKeywordClient = e => {
        const { dispatchChangeKeywordClient } = this.props;
        dispatchChangeKeywordClient(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this.handleClientsFind(e);
        }
    }

    handleClientsFind = () => {
        const {dispatchBlackListFindServer, alertBlackList, dispatchChangePage, dispatchShowLoading} = this.props;
        const keywordNameNitClient = alertBlackList.get('keywordNameNitClient');
        if (keywordNameNitClient === '' || keywordNameNitClient === undefined) {
            this.setState({showEr: true});
        } else {
            const typeEntity = alertBlackList.get('typeEntity');
            const keyWordNameNit = alertBlackList.get('keywordNameNit');
            const order = alertBlackList.get('order');
            const columnOrder = alertBlackList.get('columnOrder');
            dispatchShowLoading(true, 'Cargando..');
            dispatchBlackListFindServer(keyWordNameNit, keywordNameNitClient,typeEntity, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    dispatchShowLoading(false, null);
                    dispatchChangePage(1);
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
                           value={keyword} onKeyPress={this.handleChangeKeywordClient} onChange={this.handleChangeKeywordClient}
                           className="input-lg input InputAddOn-field"/>
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button"
                            onClick={this.handleClientsFind} style={{backgroundColor: "#E0E2E2"}}>
                        <i className="search icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                    </button>
                </div>
                <SweetAlertFocus
                    type="error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this.closeError()}
                />
                <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions}/>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchBlackListFindServer : blackListFindServer, 
        dispatchChangePage : changePage, 
        dispatchChangeKeywordClient : changeKeywordClient, 
        dispatchUpdateTabSeleted : updateTabSeleted, 
        dispatchShowLoading : showLoading, 
        dispatchGetAlertsByUser : getAlertsByUser
    }, dispatch);
}

const mapStateToProps = ({alertBlackList}) => {
    return {alertBlackList};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
