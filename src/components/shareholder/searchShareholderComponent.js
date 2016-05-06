import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shareholdersByClientFindServer,changeKeyword,clearShareholder} from './actions';
import {NUMBER_RECORDS} from './constants';

class SearchShareholderComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        keyword: ''
      };
      this._handleShareholderByClientsFind = this._handleShareholderByClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  _handleChangeKeyword(e){
    if(e.keyCode == 13 || e.which == 13){
      this._handleShareholderByClientsFind(e);
    }else{
      this.setState({
        keyword: e.target.value
      });
      const {changeKeyword} = this.props;
      changeKeyword(e.target.value);
    }
  }

  _handleShareholderByClientsFind(){
      const {shareholdersByClientFindServer,clearShareholder} = this.props;
      clearShareholder();
      if(this.state.keyword === '' || this.state.keyword === undefined){
          shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",-1,"");
      }else{
          shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",-1,this.state.keyword);
      }
  }

    render() {
        return (
          <div className="InputAddOn">
          <input style={{padding: '0px 11px !important'}} id="searchExpression" onKeyPress={this._handleChangeKeyword} type="text" placeholder="Búsqueda por numero, nombre, tipo de persona"  value={this.state.keyword} onChange={this._handleChangeKeyword} className="input InputAddOn-field"/>
            <button onClick={this._handleShareholderByClientsFind}  className="button InputAddOn-item">
              <i className="search icon" />
            </button>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    shareholdersByClientFindServer, changeKeyword,clearShareholder
  }, dispatch);
}

function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchShareholderComponent);
