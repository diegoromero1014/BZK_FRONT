import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../globalComponents/actions';

class ListVisits extends Component{

  constructor(props){
     super(props);
     this._createVisit = this._createVisit.bind(this);
  }

  _createVisit(){
      redirectUrl("/dashboard/visita");
  }

  render(){
    return(
      <div className = "tab-pane quickZoomIn animated" style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <h1>Lista de visitas</h1>
        <button className="btn btn-primary" type="button" title="Crear visita" style={{float: "right"}} onClick={this._createVisit}>
          <i className="plus icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
        </button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps){
    return {
      clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVisits);
