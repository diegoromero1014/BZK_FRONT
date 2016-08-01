import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import numeral from 'numeral';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {REQUEST_ERROR, ERROR_MESSAGE_REQUEST, MESSAGE_USER_WITHOUT_PERMISSIONS} from '../../constantsGlobal';
import {OPTION_MANAGER, OPTION_OTHERS, OPTION_ASSISTANTS, MANAGER, OTHER, ASSISTANT} from './constants';
import {getClientTeam} from './actions';
import TeamManager from './teamManager';
import TeamOthers from './teamOthers';
import TeamAssistants from './teamAssistants';

var classTabActive = 'active';

class ModalComponentTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabManager: classTabActive,
      activeTabOthers: '',
      activeTabAssistants: '',
      teamManagers: [],
      teamOthers: [],
      teamAssistants: [],
      showError: false,
      messageError: ''
    }
    this._closeError = this._closeError.bind(this);
  }

  _closeError(){
    this.setState({showError:false, messageError:''});
  }

  _clickSeletedTab(tab){
    if(tab === OPTION_MANAGER){
      this.setState({
        activeTabManager: classTabActive,
        activeTabOthers: '',
        activeTabAssistants: ''
      });
    } else if(tab === OPTION_OTHERS){
      this.setState({
        activeTabManager: '',
        activeTabOthers: classTabActive,
        activeTabAssistants: ''
      });
    } else {
      this.setState({
        activeTabManager: '',
        activeTabOthers: '',
        activeTabAssistants: classTabActive
      });
    }
  }

  _mapTeamManagers(item, idx) {
    return <TeamManager
      key={idx}
      name={item.name}
      position={item.position}
      email={item.email}
      company={item.company}
      assistant={item.assistant}
    />
  }

  _mapTeamOthers(item, idx) {
    return <TeamOthers
      key={idx}
      name={item.name}
      position={item.position}
      email={item.email}
      company={item.company}
      assistant={item.assistant}
    />
  }

  _mapTeamAssistants(item, idx) {
    return <TeamAssistants
      key={idx}
      name={item.name}
      position={item.position}
      email={item.email}
      company={item.company}
    />
  }

  componentWillMount(){
    const {getClientTeam} = this.props;
    getClientTeam(window.localStorage.getItem('idClientSelected')).then((data) => {
      var status = data.payload.data.status;
      var validateLogin = data.payload.data.validateLogin;
      if(status === REQUEST_ERROR){
        this.setState({
          showError: true,
          messageError: ERROR_MESSAGE_REQUEST
        });
      } else {
        if(validateLogin === false){
          this.setState({
            showError: true,
            messageError: MESSAGE_USER_WITHOUT_PERMISSIONS
          });
        }else{
          var team = data.payload.data.data;
          this.setState({
            teamManagers: _.filter(team, ['employeeType', MANAGER]),
            teamOthers: _.filter(team, ['employeeType', OTHER]),
            teamAssistants: _.filter(team, ['employeeType', ASSISTANT])
          });
        }
      }
    }, (reason) => {
      this.setState({
        showError: true,
        messageError: ERROR_MESSAGE_REQUEST
      });
    });
    console.log("idclient", window.localStorage.getItem('idClientSelected'));
  }

  render(){
    return (
          <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{overflow:"hidden"}}>
            <Row style={{padding: "20px 20px 20px 20px"}}>
              <Col xs>
                <div className="ui top attached tabular menu" style={{width:"100%"}}>
                  <a className={`${this.state.activeTabManager} item`} style={{width:"33%"}}
                    data-tab="first" onClick={this._clickSeletedTab.bind(this, OPTION_MANAGER)}>Gerentes
                  </a>
                  <a className={`${this.state.activeTabOthers} item`} style={{width:"33%"}}
                    data-tab="second" onClick={this._clickSeletedTab.bind(this, OPTION_OTHERS)}>Otros
                  </a>
                  <a className={`${this.state.activeTabAssistants} item`} style={{width:"34.1%"}}
                    data-tab="third" onClick={this._clickSeletedTab.bind(this, OPTION_ASSISTANTS)}>Asistentes
                  </a>
                </div>
                <div className={`ui bottom attached ${this.state.activeTabManager} tab segment`} data-tab="first" style={{height:"360px", overflowY:"auto"}}>
                  <div className="news-page content">
                    <div className="team-modal">
                    {this.state.teamManagers.map(this._mapTeamManagers)}
                    </div>
                  </div>
                </div>
                <div className={`ui bottom attached ${this.state.activeTabOthers} tab segment`} data-tab="second" style={{height:"360px", overflowY:"auto"}}>
                  <div className="news-page content">
                    <div className="team-modal">
                    {this.state.teamOthers.map(this._mapTeamOthers)}
                    </div>
                  </div>
                </div>
                <div className={`ui bottom attached ${this.state.activeTabAssistants} tab segment`} data-tab="third" style={{height:"360px", overflowY:"auto"}}>
                  <div className="news-page content">
                    <div className="team-modal">
                    {this.state.teamAssistants.map(this._mapTeamAssistants)}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <SweetAlert
             type= "error"
             show={this.state.showError}
             title="Error cargando información"
             text={this.state.messageError}
             onConfirm={() => this._closeError()}
             />
          </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getClientTeam
  }, dispatch);
}

function mapStateToProps({teamParticipantsReducer}, ownerProps) {
  return {
    teamParticipantsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentTeam);
