import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ClientListItem from './ClientListItem';
import SearchBarClient from './SearchBarClient';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer} from './actions';

var clientItems = [];

class ClientsFind extends Component {

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _mapClientItems(item, idx) {
      return <ClientListItem
          key={idx}
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
      const {clientR} = this.props;
      if( clientR.get('status') === 'processed'){
        clientItems = clientR.get('responseClients');
      }
        return (
          <div id="page-container" className=" condensed full-height" style={{width:"100%", "backgroundColor":"#E7ECED"}}>
            <SearchBarClient />
            <div style={{margin:"0px 0px 10px 10px"}}>
              <div className="news-page content">
                <div className="">
                  <div className="team-modal">
                    {clientItems.map(this._mapClientItems)}
                  </div>
                </div>
              </div>
            </div>
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
