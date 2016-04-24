import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, changePage, changeKeyword} from './actions';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';

class SearchBarClient extends Component{

  constructor(props) {
      super(props);

      this._handleClientsFind = this._handleClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  componentWillMount(){
    const {login} = this.props;
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  _handleChangeKeyword(e){
    const {changeKeyword} = this.props;
    changeKeyword(e.target.value);
    if(e.keyCode == 13 || e.which == 13){
      this._handleClientsFind(e);
    }
  }

  _handleClientsFind(e){
    const {clientsFindServer} = this.props;
    const {clientR} = this.props;
    var keyword = clientR.get('keyword');
    if(keyword === '' || keyword === undefined){
      alert('Por favor ingrese un criterio de búsqueda');
    }else{
      const {changePage} = this.props;
      var limInf = (1 - 1) * NUMBER_RECORDS;
      clientsFindServer(keyword, limInf, NUMBER_RECORDS);
      changePage(1);
    }
  }

  render(){
    const {clientR} = this.props;
    var keyword = clientR.get('keyword');
    return(
      <div style={{paddingBottom:"15px", display: "inline", width:"100%", margin: "auto"}}>
       <div style={{display: "inline", margin: "auto"}}>
         <input type="search" onKeyPress={this._handleChangeKeyword} className="input-lg" placeholder="Búsqueda por cliente, NIT o grupo económico" style={{width:"80%", display: "inline"}} value={keyword} onChange={this._handleChangeKeyword}/>
         <span style={{width:"5%"}}>
           <button id="searchClients" className="btn" title="Buscar clientes" type="button" onClick={this._handleClientsFind} style={{backgroundColor:"#E0E2E2", width:"50px", height:"50px"}}><i className="search icon"></i></button>
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
