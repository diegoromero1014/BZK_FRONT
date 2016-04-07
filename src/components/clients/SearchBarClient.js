import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer} from './actions';

class SearchBarClient extends Component{

  constructor(props) {
      super(props);
      this._handleClientsFind = this._handleClientsFind.bind(this);
  }

  _handleClientsFind(e){
    //e.preventDefault();
    clientsFindServer('', 0, 100);
  }

  render(){
    return(
      <div style={{paddingBottom:"15px", borderBottom:"2px solid #D9DEDF"}}>
        <div style={{margin:"auto", width:"80%", marginTop:"15px"}}>
          <input id="searchExpression" type="search" className="form-control input-lg" placeholder="Búsqueda por cliente, NIT o grupo económico" style={{width:"93%",}} />
          <span className="input-group-btn" style={{width:"5%",}}>
            <button id="searchClients" className="btn btn-default btn-large" type="button" onClick={this._handleClientsFind}><i className="icon-search"></i></button>
          </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
