import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import numeral from 'numeral';
import _ from 'lodash';

class TeamManager extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  render(){
    return (
      <div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Juan Perez</div>
              <div className="celula-name">Analista desarrollador</div>
              <div className="celula-title">Ingeniería Aplicaciones y Software</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Pepito Perez</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="juan@ias.com.co"></i>
          </div>
        </div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Wilfer Salazar</div>
              <div className="celula-name">Analista</div>
              <div className="celula-title">I.A.S</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Arley Giraldo</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="wilfer@ias.com.co"></i>
          </div>
        </div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Tatiana Montoya</div>
              <div className="celula-name">Desarrolladora</div>
              <div className="celula-title">Bancolombia S.A</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Cindy Leal</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="tmontoya@bancolombia.com.co"></i>
          </div>
        </div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Juan Perez</div>
              <div className="celula-name">Analista desarrollador</div>
              <div className="celula-title">Ingeniería Aplicaciones y Software</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Pepito Perez</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="juan@ias.com.co"></i>
          </div>
        </div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Wilfer Salazar</div>
              <div className="celula-name">Analista</div>
              <div className="celula-title">I.A.S</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Arley Giraldo</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="wilfer@ias.com.co"></i>
          </div>
        </div>
        <div className="client-card" style={{width:"260px"}}>
          <div className="celula-card-top">
            <div className="celula-card-top-left">
              <div className="celula-title">Tatiana Montoya</div>
              <div className="celula-name">Desarrolladora</div>
              <div className="celula-title">Bancolombia S.A</div>
              <div className="celula-name" style={{marginTop: "5px", fontStyle: "italic"}}>Cindy Leal</div>
            </div>
          </div>
          <div className="celula-card-bottom" style={{backgroundColor:"#B0E0E6"}}>
            <i className="mail right icon blue" style={{marginTop:"-15px"}} title="tmontoya@bancolombia.com.co"></i>
          </div>
        </div>
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

export default TeamManager;
