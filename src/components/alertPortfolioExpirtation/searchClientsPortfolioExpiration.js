import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsPortfolioExpirationFindServer, changePage, changeKeyword} from './actions';
import {CODE_ALERT_PORTFOLIO_EXPIRATION} from '../alerts/constants';
import {getAlertsByUser} from '../alerts/actions';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import SweetAlertFocus from '../sweetalertFocus';
import {showLoading} from '../loading/actions';
import _ from 'lodash';

class SearchBarClient extends Component{

    constructor(props) {
        super(props);
        this.state = {
            openMessagePermissions: false,
            showEr: false,
        };
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._closeError = this._closeError.bind(this);
    }

    _closeError(){
        this.setState({showEr: false});
    }

    componentWillMount(){
        const {getAlertsByUser} = this.props;
        const self = this;
        if( window.localStorage.getItem('sessionTokenFront') === "" ){
            redirectUrl("/login");
        }
        getAlertsByUser().then((data) => {
            _.get(data, 'payload.data.data').map((item, idx) => {
                if( item.codeAlert === CODE_ALERT_PORTFOLIO_EXPIRATION && !item.active ){
                    self.setState({ openMessagePermissions: true});
                }
            });
        });
    }

    _handleChangeKeyword(e){
        const {changeKeyword} = this.props;
        changeKeyword(e.target.value);
        if(e.keyCode === 13 || e.which === 13){
            this._handleClientsFind(e);
        }
    }

    _handleClientsFind(e){
        const {clientsPortfolioExpirationFindServer,alertPortfolioExpiration,showLoading,changePage} = this.props;
        const keyWordNameNit = alertPortfolioExpiration.get('keywordNameNit');
        if(keyWordNameNit === '' || keyWordNameNit === undefined){
            this.setState({showEr: true});
        }else{
            const idTeam = alertPortfolioExpiration.get('idTeam');
            const idRegion = alertPortfolioExpiration.get('idRegion');
            const idZone = alertPortfolioExpiration.get('idZone');
            const order = alertPortfolioExpiration.get('order');
            const columnOrder = alertPortfolioExpiration.get('columnOrder');
            const line = alertPortfolioExpiration.get('line');
            const type = alertPortfolioExpiration.get('expirationType');
            showLoading(true, 'Cargando..');
            clientsPortfolioExpirationFindServer(keyWordNameNit, idTeam, idRegion, idZone, 1, NUMBER_RECORDS, order, columnOrder, line, type).then((data) => {
                if (_.has(data, 'payload.data.data.pagination')) {
                    showLoading(false, null);
                    changePage(1);
                }
            });
        }
    }

    render(){
        const {alertPortfolioExpiration} = this.props;
        var keyword = alertPortfolioExpiration.get('keywordNameNit');
        return(
            <div style={{marginLeft: '17px'}}>
                <div className="InputAddOn">
                    <input type="text" style={{padding: '0px 11px !important'}} placeholder="Buscar por cliente o NIT" value={keyword} onKeyPress={this._handleChangeKeyword}  onChange={this._handleChangeKeyword} className="input-lg input InputAddOn-field"/>
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button" onClick={this._handleClientsFind} style={{backgroundColor:"#E0E2E2"}}>
                        <i className="search icon" style={{margin:'0em', fontSize : '1.2em'}} />
                    </button>
                </div>
                <SweetAlertFocus
                    type= "error"
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

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        clientsPortfolioExpirationFindServer, changePage, changeKeyword, redirectUrl, showLoading, getAlertsByUser
    }, dispatch);
}

function mapStateToProps({alertPortfolioExpiration}, ownerProps){
    return {
        alertPortfolioExpiration
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
