import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {shareholdersByClientFindServer,changeKeywordShareholder,clearShareholderPaginator,clearShareholderOrder} from './actions';
import {NUMBER_RECORDS} from './constants';

let v1 = "";
let v2 = "";


class SearchShareholderComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        keywordShareholder: ''
      };
      this._handleShareholderByClientsFind = this._handleShareholderByClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  componentWillReceiveProps(nextProps){
      const {
          value1,
          value2
      } = nextProps;
      if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)){
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      const {clearShareholderOrder} = this.props;
      clearShareholderOrder();
      this._handleShareholderByClientsFind();
      }
  }

  _handleChangeKeyword(e){
    if(e.keyCode === 13 || e.which === 13){
      this._handleShareholderByClientsFind();
    }else{
      this.setState({
        keywordShareholder: e.target.value
      });
      const {changeKeywordShareholder} = this.props;
      changeKeywordShareholder(e.target.value);
    }
  }

  _handleShareholderByClientsFind(){
      const {shareholdersByClientFindServer,clearShareholderPaginator} = this.props;
      clearShareholderPaginator();
      clearShareholderOrder();
      if(this.state.keywordShareholder === '' || this.state.keywordShareholder === undefined){
          shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"sh.sharePercentage",1,"",v1,v2);
      }else{
          shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"sh.sharePercentage",1,this.state.keywordShareholder,v1,v2);
      }
  }

    render() {
      const {disabled} = this.props;
        return (
          <div className="InputAddOn">
          <input style={{padding: '0px 11px !important'}} disabled={disabled} id="searchExpression" onKeyPress={this._handleChangeKeyword} type="text" placeholder="Búsqueda por número, nombre"  value={this.state.keywordShareholder} onChange={this._handleChangeKeyword} className="input InputAddOn-field"/>
            <button onClick={this._handleShareholderByClientsFind} disabled={disabled}  className="button InputAddOn-item">
              <i className="search icon" />
            </button>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    shareholdersByClientFindServer, changeKeywordShareholder,clearShareholderPaginator,clearShareholderOrder
  }, dispatch);
}

function mapStateToProps({shareholdersReducer}, ownerProps){
    return {
        shareholdersReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchShareholderComponent);
