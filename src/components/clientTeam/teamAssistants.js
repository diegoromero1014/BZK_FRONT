import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import numeral from 'numeral';
import _ from 'lodash';

class TeamAssistants extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {name, position, email, company} = this.props;
    return (
          <div>
            <div className="client-card" style={{width:"250px", float:"left"}}>
              <div className="celula-card-top">
                <div className="celula-card-top-left">
                  <div className="celula-title">{name}</div>
                  <div className="celula-name">{position}</div>
                  <div className="celula-title">{company}</div>
                </div>
              </div>
              <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
                <i className="mail right icon blue" style={{marginTop:"-15px"}} title={email}></i>
              </div>
            </div>
          </div>
    );
  }
}

export default TeamAssistants;
