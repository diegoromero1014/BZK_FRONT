import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, clearClients} from './actions';
import ClientListItem from './clientListItem';
import SearchBarClient from './searchBarClient';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';

class ClientsFind extends Component {
  constructor(props) {
    super(props);

    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
  }

  componentWillMount(){
    if(window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined){
      redirectUrl("/login");
    } else {
      const {clearClients} = this.props;
      clearClients();
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

  _clickButtonCreateProps(){
    redirectUrl("/dashboard/createPropspect");
  }

    render() {
      var clientItems = [];
      const {clientR} = this.props;
      var countClients = clientR.get('countClients');
      var status = clientR.get('status');
      clientItems = clientR.get('responseClients');
      return (
          <Row style={{paddingLeft: "10px"}}>
            <Col xs={12} md={12} lg={12}>
              <div style={{borderBottom:"2px solid #D9DEDF", display: "inline", margin:"auto", width:"100%"}}>
                <div style={{width:"90%", margin:"auto", marginTop:"15px", textAlign:"center"}}>
                  <SearchBarClient />
                  <button className="btn btn-primary" onClick={this._clickButtonCreateProps} type="button" title="Crear prospecto" style={{marginLeft:"30px", width:"50px", height:"50px"}}>
                    <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                  </button>
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={12}>
              <div className="news-page content">
                <div className="team-modal">
                  {countClients === 0 && status === 'processed' ? <div style={{textAlign:"center"}}> <h4 className="form-item">No se encontraron clientes, que cumplan el criterio de búsqueda.</h4> </div>:
                  clientItems.map(this._mapClientItems)}
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={12}>
              <Pagination />
            </Col>
          </Row>
      )
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clientsFindServer,
    clearClients
  }, dispatch);
}

function mapStateToProps({clientR}, ownerProps){
  return {
    clientR
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsFind);
