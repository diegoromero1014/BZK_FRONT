import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer} from './actions';
import ClientListItem from './ClientListItem';
import SearchBarClient from './SearchBarClient';
import Pagination from './Pagination';

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
        <div id="page-container" className=" condensed full-height" style={{width:"100%", "backgroundColor":"#E7ECED"}}>
          <SearchBarClient />
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
