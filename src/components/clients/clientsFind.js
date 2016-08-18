import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, clearClients,changePage, changeKeyword} from './actions';
import ClientListItem from './clientListItem';
import SearchBarClient from './searchBarClient';
import {NUMBER_RECORDS} from './constants';
import Pagination from './pagination';
import {redirectUrl} from '../globalComponents/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import {consultList,getMasterDataFields} from '../selectsComponent/actions';
import * as constants from '../selectsComponent/constants';
import {reduxForm} from 'redux-form';
import {updateTitleNavBar} from '../navBar/actions';
import {clearContact} from '../contact/actions';

const fields =["team","certificationStatus"];

class ClientsFind extends Component {
  constructor(props) {
    super(props);
    this._onChangeTeam = this._onChangeTeam.bind(this);
    this._onChangeCertificationStatus = this._onChangeCertificationStatus.bind(this);
    this._clickButtonCreateProps = this._clickButtonCreateProps.bind(this);
    this._handleClientsFind = this._handleClientsFind.bind(this);
    this._cleanSearch = this._cleanSearch.bind(this);
    this.state ={
      valueTeam :"",
      valueCertification:""
    }
  }

  componentWillMount(){
    if(window.localStorage.getItem('sessionToken') === "" || window.localStorage.getItem('sessionToken') === undefined){
      redirectUrl("/login");
    } else {
      const {clearClients,consultList,getMasterDataFields, clearContact} = this.props;
      clearClients();
      getMasterDataFields([constants.CERTIFICATION_STATUS]);
      consultList(constants.TEAM_FOR_EMPLOYEE);
      const {updateTitleNavBar} = this.props;
      updateTitleNavBar("Mis clientes");
      clearContact();
    }
  }

  _cleanSearch(){
    const {fields: {team},clearClients} = this.props;
    this.props.resetForm();
    clearClients();

  }

  _onChangeTeam(val){
    const {fields: {team}} = this.props;
    team.onChange(val);
    if(val){
    this._handleClientsFind();
    }
  }

  _onChangeCertificationStatus(val){
    const {fields: {certificationStatus}} = this.props;
    certificationStatus.onChange(val);
    if(val){
    this._handleClientsFind();
    }
  }

  _handleClientsFind(){
    const {fields: {certificationStatus,team}} = this.props;
    const {clientsFindServer,clientR,changePage} = this.props;
    clientsFindServer(clientR.get('keyword'), 0, NUMBER_RECORDS,certificationStatus.value,team.value);
    changePage(1);
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
      const {fields:{team,certificationStatus},handleSubmit} = this.props;
      const {clientR,selectsReducer} = this.props;
      var countClients = clientR.get('countClients');
      var status = clientR.get('status');
      clientItems = clientR.get('responseClients');
      return (
        <div>
        <form>
          <Row style={{borderBottom:"2px solid #D9DEDF",marginTop:"15px"}}>
            <Col xs={12} sm={12} md={4} lg={5} style={{width:'100%'}}>
                <SearchBarClient valueTeam = {team.value} valueCertification={certificationStatus.value}/>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3} style={{width:'100%'}}>
                <ComboBox
                  name="celula"
                  labelInput="Célula"
                  {...team}
                  onChange={val => this._onChangeTeam(val)}
                  value={team.value}
                  onBlur={team.onBlur}
                  valueProp={'id'}
                  textProp={'description'}
                  searchClient ={'client'}
                  data={selectsReducer.get('teamValueObjects')}
                />
            </Col>
            <Col xs={12} sm={12} md={3} lg={2} style={{width:'100%'}}>
                <ComboBox
                  name="celula"
                  labelInput="Estado certificación"
                  {...certificationStatus}
                  onChange={val => this._onChangeCertificationStatus(val)}
                  value={certificationStatus.value}
                  onBlur={certificationStatus.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  searchClient ={'client'}
                  data={selectsReducer.get(constants.CERTIFICATION_STATUS) || []}
                />
            </Col>
            <Col xs={12} sm={12} md={2} lg={2} style={{width:'100%'}}>
                <button className="btn btn-primary" type="button" onClick={this._cleanSearch} title="Limpiar búsqueda" style={{marginLeft:"17px"}}>
                  <i className="erase icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                </button>
                <button className="btn btn-primary" onClick={this._clickButtonCreateProps} type="button" title="Crear prospecto" style={{marginLeft:"17px"}}>
                  <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
                </button>
            </Col>
        </Row>
        </form>
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
              <Pagination valueTeam = {team.value} valueCertification={certificationStatus.value}/>
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
    changePage,
    changeKeyword,
    consultList,
    updateTitleNavBar,
    clearContact
  }, dispatch);
}

function mapStateToProps({clientR, selectsReducer, navBar, contactsByClient},{fields}){
  return {
    clientR,
    selectsReducer,
    navBar,
    contactsByClient
  };
}

export default reduxForm({form: 'simple',fields}, mapStateToProps, mapDispatchToProps)(ClientsFind);
