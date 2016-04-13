import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, changePage, changeKeyword} from './actions';
import {NUMBER_RECORDS} from './constants';

class SearchBarClient extends Component{

  constructor(props) {
      super(props);
      this.state = {
        keyword: '',
      };

      this._handleClientsFind = this._handleClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  _handleChangeKeyword(e){
    if(e.keyCode == 13 || e.which == 13){
      this._handleClientsFind(e);
    }else{
      this.setState({
        keyword: e.target.value
      });
      const {changeKeyword} = this.props;
      changeKeyword(e.target.value);
    }
  }

  _handleClientsFind(e){
    if(this.state.keyword === '' || this.state.keyword === undefined){
      alert('Por favor ingrese un criterio de búsqueda');
    }else{
      const {changePage} = this.props;
      const {clientsFindServer} = this.props;
      var limInf = (1 - 1) * NUMBER_RECORDS;
      clientsFindServer(this.state.keyword, limInf, NUMBER_RECORDS);
      changePage(1);
    }
  }

  render(){
    return(
      <div style={{paddingBottom:"15px", borderBottom:"2px solid #D9DEDF"}}>
        <div style={{margin:"auto", width:"80%", marginTop:"15px"}}>
          <input id="searchExpression" type="search" onKeyPress={this._handleChangeKeyword} className="form-control input-lg" placeholder="Búsqueda por cliente, NIT o grupo económico" style={{width:"93%",}} value={this.state.keyword} onChange={this._handleChangeKeyword}/>
          <span className="input-group-btn" style={{width:"5%",}}>
            <button id="searchClients" className="btn btn-default btn-large" type="button" onClick={this._handleClientsFind} style={{backgroundColor:"#E0E2E2"}}><i className="icon-search"></i></button>
          </span>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    clientsFindServer, changePage, changeKeyword
  }, dispatch);
}

function mapStateToProps({clientR}, ownerProps){
  return {
    clientR
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
