import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import numeral from 'numeral';
import _ from 'lodash';
import {OPTION_MANAGER, OPTION_OTHERS, OPTION_ASSISTANTS} from './constants';
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
      activeTabAssistants: ''
    }
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

  componentWillMount(){
    console.log("idclient", window.localStorage.getItem('idClientSelected'));
  }

  render(){
    return (
          <div className="modalBt4-body modal-body business-content editable-form-content clearfix" style={{overflowX:"hidden"}}>
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
                <div className={`ui bottom attached ${this.state.activeTabManager} tab segment`} data-tab="first">
                  <div className="news-page content">
                    <div className="team-modal">
                      <TeamManager />
                    </div>
                  </div>
                </div>
                <div className={`ui bottom attached ${this.state.activeTabOthers} tab segment`} data-tab="second">
                  <div className="news-page content">
                    <div className="team-modal">
                      <TeamOthers />
                    </div>
                  </div>
                </div>
                <div className={`ui bottom attached ${this.state.activeTabAssistants} tab segment`} data-tab="third">
                  <div className="news-page content">
                    <div className="team-modal">
                      <TeamAssistants />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({selectsReducer}, ownerProps) {
  return {
    selectsReducer
  };
}

export default ModalComponentTeam;
