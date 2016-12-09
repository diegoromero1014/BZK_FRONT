/**
 * Created by ahurtado on 12/06/2016.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsPortfolioExpirationFindServer, changePage, changeKeyword} from './actions';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import {showLoading} from '../loading/actions';
import _ from 'lodash';

class SearchBarClient extends Component{

    constructor(props) {
        super(props);
        this.state = {
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
        if( window.localStorage.getItem('sessionToken') === "" ){
            redirectUrl("/login");
        }
    }

    _handleChangeKeyword(e){
        const {changeKeyword} = this.props;
        changeKeyword(e.target.value);
        if(e.keyCode === 13 || e.which === 13){
            this._handleClientsFind(e);
        }
    }

    _handleClientsFind(e){
        const {clientsPortfolioExpirationFindServer,alertPortfolioExpiration,showLoading} = this.props;
        const keyWordNameNit = alertPortfolioExpiration.get('keywordNameNit');
        if(keyWordNameNit === '' || keyWordNameNit === undefined){
            this.setState({showEr: true});
        }else{
            const {changePage} = this.props;
            const idTeam = alertPortfolioExpiration.get('idTeam');
            const idRegion = alertPortfolioExpiration.get('idRegion');
            const idZone = alertPortfolioExpiration.get('idZone');
            const order = alertPortfolioExpiration.get('order');
            const columnOrder = alertPortfolioExpiration.get('columnOrder');
            showLoading(true, 'Cargando..');
            clientsPortfolioExpirationFindServer(keyWordNameNit, idTeam, idRegion, idZone, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    showLoading(false, null);
                }
            });
            changePage(1);
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
                <SweetAlert
                    type= "error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this._closeError()}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        clientsPortfolioExpirationFindServer, changePage, changeKeyword, redirectUrl, showLoading
    }, dispatch);
}

function mapStateToProps({alertPortfolioExpiration}, ownerProps){
    return {
        alertPortfolioExpiration
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
