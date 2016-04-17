import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer} from './actions';
import ClientListItem from './ClientListItem';
import SearchBarClient from './SearchBarClient';
import Pagination from './Pagination';
import {redirectUrl} from '../globalComponents/actions';

class ClientsFind extends Component {

  componentWillMount(){
    if(window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined){
      redirectUrl("/login");
    }
  }

  _mapClientItems(item, idx) {
      return <ClientListItem
          key={idx}
          dataId={item.id}
          dataName={item.name}
          dataDocumentType={item.documentType}
          dataDocument={item.document}
          dataAccountManager={item.accountManager}
          dataEconomicGroup={item.economicGroup}
          dataIsProspect={item.prospect}
          dataIsAccess={item.access}
      />
  }

    render() {
      var clientItems = [];
      const {clientR} = this.props;
      var countClients = clientR.get('countClients');
      var status = clientR.get('status');
      console.log("numero = ", countClients);
      clientItems = clientR.get('responseClients');

      return (
        <div id="page-container" className="condensed full-height" style={{width:"100%", "backgroundColor":"#E7ECED", display: "inline"}}>
          <div style={{borderBottom:"2px solid #D9DEDF", display: "inline", margin:"auto", width:"100%"}}>
            <div style={{width:"90%", margin:"auto", marginTop:"15px", textAlign:"center"}}>
              <SearchBarClient />
              <button className="btn btn-default btn-large" type="button" title="Crear prospecto" onClick={this._handleClientsFind} style={{backgroundColor:"blue", marginLeft:"30px"}}><i className="icon-search"></i></button>
            </div>
          </div>
          <div style={{margin:"0px 0px 10px 10px", width:"100%", display: "inline-block"}}>
            <div className="news-page content">
              <div className="team-modal">
                {countClients === 0 && status === 'processed' ? <div style={{textAlign:"center"}} > <h4 className="form-item">No se encontraron clientes, que cumplan el criterio de búsqueda.</h4> </div>:  ''}
                {clientItems.map(this._mapClientItems)}
              </div>
            </div>
          </div>
          <Pagination />
        </div>
      )
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clientsFindServer
  }, dispatch);
}

function mapStateToProps({clientR}, ownerProps){
  return {
    clientR
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsFind);
