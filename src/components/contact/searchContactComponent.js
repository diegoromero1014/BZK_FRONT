import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer,changeKeyword} from './actions';

class SearchContactComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        keyword: '',
      };
      this._handleContactsByClientsFind = this._handleContactsByClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  _handleChangeKeyword(e){
    if(e.keyCode == 13 || e.which == 13){
      this._handleContactsByClientsFind(e);
    }else{
      this.setState({
        keyword: e.target.value
      });
      const {changeKeyword} = this.props;
      changeKeyword(e.target.value);
    }
  }

  _handleContactsByClientsFind(e){
    const {contactsByClientFindServer} = this.props;
    if(this.state.keyword === '' || this.state.keyword === undefined){
        contactsByClientFindServer(0,window.localStorage.getItem('idClientSeleted'),10,"",0,"");
    }else{
      const {contactsByClientFindServer} = this.props;
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSeleted'),10,"",0,this.state.keyword);
    }
  }

    render() {
        return (
          <div className="InputAddOn">
          <input style={{padding: '0px 11px !important'}} id="searchExpression" type="text" onKeyPress={this._handleChangeKeyword} className="input InputAddOn-field" placeholder="Búsqueda por número, nombre, función, cargo" value={this.state.keyword} onChange={this._handleChangeKeyword}/>
            <button onClick={this._handleContactsByClientsFind} className="button InputAddOn-item">
              <span className="icon icon-search">
              </span>
            </button>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    contactsByClientFindServer, changeKeyword
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
    return {
        contactsByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContactComponent);
