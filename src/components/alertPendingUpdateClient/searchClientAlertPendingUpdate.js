import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsPendingUpdateFindServer, changePage, changeKeyword} from './actions';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import {showLoading} from '../loading/actions';
import {updateTabSeleted} from '../clientDetailsInfo/actions';
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
    const {login, updateTabSeleted} = this.props;
    updateTabSeleted(null);
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
    const {clientsPendingUpdateFindServer,alertPendingUpdateClient,showLoading} = this.props;
      const keyWordNameNit = alertPendingUpdateClient.get('keywordNameNit');
    if(keyWordNameNit === '' || keyWordNameNit === undefined){
      this.setState({showEr: true});
    }else{
      const {changePage} = this.props;
        const idTeam = alertPendingUpdateClient.get('idTeam');
        const idRegion = alertPendingUpdateClient.get('idRegion');
        const idZone = alertPendingUpdateClient.get('idZone');
        const order = alertPendingUpdateClient.get('order');
        const columnOrder = alertPendingUpdateClient.get('columnOrder');
        showLoading(true, 'Cargando..');
        clientsPendingUpdateFindServer(keyWordNameNit, idTeam, idRegion, idZone, 1, NUMBER_RECORDS, order, columnOrder).then((data) => {
            if (_.has(data, 'payload.data.data')) {
                showLoading(false, null);
            }
        });
      changePage(1);
    }
  }

  render(){
    const {alertPendingUpdateClient} = this.props;
    var keyword = alertPendingUpdateClient.get('keywordNameNit');
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
      clientsPendingUpdateFindServer, changePage, changeKeyword, updateTabSeleted, redirectUrl, showLoading
  }, dispatch);
}

function mapStateToProps({alertPendingUpdateClient}, ownerProps){
  return {
    alertPendingUpdateClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
