import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import {REQUEST_ERROR, ERROR_MESSAGE_REQUEST, MESSAGE_USER_WITHOUT_PERMISSIONS} from '../../constantsGlobal';
import {bindActionCreators} from 'redux';
import {getClientsEconomicGroup} from './actions';
import ClientsEconomicGroup from './clientsEconomicGroup';
import _ from 'lodash';

class ModalComponentEconomicGroup extends Component{
  constructor(props){
    super(props);
    this.state = {
      clientsEconomicGroup: [],
      nameEconomicGroup: null,
      nitEconomicGroup: null,
      showError: false
    };
    this._closeError = this._closeError.bind(this);
  }

  _closeError(){
    this.setState({showError:false, messageError:''});
  }

  componentWillMount(){
    const {getClientsEconomicGroup, clientInformacion} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    getClientsEconomicGroup(infoClient.economicGroup).then((data) => {
      if( _.get(data, 'payload.data.data.status') === REQUEST_ERROR ){
        this.setState({
          showError: true,
          messageError: ERROR_MESSAGE_REQUEST
        });
      } else {
        if( _.get(data, 'payload.data.data.validateLogin') ){
          redirectUrl("/login");
        } else {
          var dataValues = _.get(data, 'payload.data.data');
          this.setState({
            nameEconomicGroup: dataValues.nameEconomicGroup,
            nitEconomicGroup: dataValues.nitEconomicGroup,
            clientsEconomicGroup: dataValues.listClients
          });
        }
      }
    }, (reason) => {

    });
  }

  _mapClientItems(item, idx) {
      return <ClientsEconomicGroup
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

  render(){
    var nameEconomicGroup = this.state.nameEconomicGroup === null ? '' : this.state.nameEconomicGroup;
    var nitEconomicGroup = this.state.nitEconomicGroup === null ? '' : this.state.nitEconomicGroup;
    return (
      <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{overflowX:"hidden", marginBottom: '15px'}}>
        <Row style={{padding: "10px 20px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div className="news-page content">
                <div className="team-modal" style={{textAlign: 'center', marginBottom: "30px"}}>
                  <div className="client-card" style={{width:'300px', textAlign: 'left', height: '100px'}}>
                    <div className="celula-card-top" style={{borderBottom: '0px'}}>
                      <div className="celula-card-top-left">
                        <div className="celula-title">{nameEconomicGroup.length > 60 ? nameEconomicGroup.substring(0, 60) + "..." : nameEconomicGroup}</div>
                        <div className="celula-name">NIT principal: {nitEconomicGroup}</div>
                      </div>
                    </div>
                    <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6", marginTop: '-45px'}}></div>
                  </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={12} lg={12}>
            <div className="news-page content">
              <div className="team-modal">
                {this.state.clientsEconomicGroup.length === 0 ? <div style={{textAlign:"center", marginTop:"15px"}}> <h4 className="form-item">Señor usuario, no se encontraron gerentes.</h4> </div>:
                  this.state.clientsEconomicGroup.map(this._mapClientItems)}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClientsEconomicGroup
  }, dispatch);
}

function mapStateToProps({clientEconomicGroupReducer, clientInformacion}, ownerProps) {
  return {
    clientEconomicGroupReducer,
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentEconomicGroup);
