import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, clearClients} from './actions';
import ClientListItem from './clientListItem';
import SearchBarClient from './searchBarClient';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {consultList,getMasterDataFields} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';

class ClientsFind extends Component {
  constructor(props) {
    super(props);

    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
  }

  componentWillMount(){
    if(window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined){
      redirectUrl("/login");
    } else {
      const {clearClients,consultList,getMasterDataFields} = this.props;
      clearClients();
      getMasterDataFields([constants.CERTIFICATION_STATUS]);
      consultList(constants.TEAM_FOR_EMPLOYEE);
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
      const {clientR,selectsReducer} = this.props;
      var countClients = clientR.get('countClients');
      var status = clientR.get('status');
      clientItems = clientR.get('responseClients');
      return (
        <div>
        <Row style={{borderBottom:"2px solid #D9DEDF",marginTop:"15px"}}>
            <Col xs={12} sm={12} md={4} lg={5} style={{width:'100%'}}>
                <SearchBarClient />
            </Col>
            <Col xs={12} sm={12} md={3} lg={3} style={{width:'100%'}}>
                <ComboBox
                  name="celula"
                  labelInput="Célula"
                  valueProp={'id'}
                  textProp={'description'}
                  data={selectsReducer.get('teamValueObjects')}
                />
            </Col>
            <Col xs={12} sm={12} md={3} lg={2} style={{width:'100%'}}>
                <ComboBox
                  name="celula"
                  labelInput="Estado certificación"
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get(constants.CERTIFICATION_STATUS) || []}
                />
            </Col>
            <Col xs={12} sm={12} md={2} lg={2} style={{width:'100%'}}>
                <button className="btn btn-primary" type="button" title="Crear prospecto" style={{marginLeft:"17px"}}>
                  <i className="erase icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                </button>
                <button className="btn btn-primary" onClick={this._clickButtonCreateProps} type="button" title="Crear prospecto" style={{marginLeft:"17px"}}>
                  <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                </button>
            </Col>
        </Row>
          <Row style={{paddingLeft: "10px"}}>
            <Col xs={12} md={12} lg={12}>
              <div className="news-page content">
                <div className="team-modal">
                  {countClients === 0 && status === 'processed' ? <div style={{textAlign:"center", marginTop:"15px"}}> <h4 className="form-item">Señor usuario, no se encontraron clientes que cumplan el criterio de búsqueda.</h4> </div>:
                  clientItems.map(this._mapClientItems)}
                </div>
              </div>
            </Col>
            <Col xs={12} md={12} lg={12}>
              <Pagination />
            </Col>
          </Row>
          </div>
      )
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clientsFindServer,
    clearClients,
    getMasterDataFields,
    consultList
  }, dispatch);
}

function mapStateToProps({clientR,selectsReducer}, ownerProps){
  return {
    clientR,
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientsFind);
