import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer,changeKeywordContact,clearContactPaginator,clearContactOrder} from './actions';
import {NUMBER_RECORDS} from './constants';
import _ from 'lodash';

let v1 = "";
let v2 = "";
let v3 = "";
let limInf1 = 0;

class SearchContactComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        keywordContact: ''
      };
      this._handleContactsByClientsFind = this._handleContactsByClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  componentWillReceiveProps(nextProps){
      const {
          value1,
          value2,
          value3
      } = nextProps;
      if ((v1 !== nextProps.value1)  ||  (v2 !== nextProps.value2)  ||
          (v3 !== nextProps.value3)) {
        v1 = nextProps.value1;
        v2 = nextProps.value2;
        v3 = nextProps.value3;
        this._handleContactsByClientsFind();
      }
  }


  _handleChangeKeyword(e){
    if(e.keyCode === 13 || e.which === 13){
      this._handleContactsByClientsFind();
    }else{
      this.setState({
        keywordContact: e.target.value
      });
      const {changeKeywordContact} = this.props;
      changeKeywordContact(e.target.value);
    }
  }

  _handleContactsByClientsFind(){
      const {contactsByClientFindServer,contactsByClient,clearContactPaginator,clearContactOrder} = this.props;
      clearContactPaginator();
      clearContactOrder();
      if(this.state.keywordContact === '' || this.state.keywordContact === undefined){
          contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
          v1,
          v2,
          v3);
      }else{
          contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,this.state.keywordContact,
          v1,
          v2,
          v3);
      }
  }

    render() {
        return (
          <div className="InputAddOn">
          <input style={{padding: '0px 11px !important'}} id="searchExpression" type="text" onKeyPress={this._handleChangeKeyword} className="input InputAddOn-field" placeholder="Búsqueda por número, nombre, cargo" value={this.state.keywordContact} onChange={this._handleChangeKeyword}/>
            <button onClick={this._handleContactsByClientsFind} className="button InputAddOn-item">
              <i className="search icon" />
            </button>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    contactsByClientFindServer,changeKeywordContact,clearContactPaginator,clearContactOrder
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
    return {
        contactsByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContactComponent);
