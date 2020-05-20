import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { contactsByClientFindServer, changeKeywordContact, clearContactPaginator, clearContactOrder } from './actions';
import { NUMBER_RECORDS } from './constants';

let v1 = "";
let v2 = "";
let v3 = "";
let v4 = "";
let limInf1 = 0;

class SearchContactComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywordContact: '',
      errorKeyword: null
    };
    this._handleContactsByClientsFind = this._handleContactsByClientsFind.bind(this);
    this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2) ||
      (v3 !== nextProps.value3) || (v4 !== nextProps.value4)) {
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      v3 = nextProps.value3;
      v4 = nextProps.value4;
      this._handleContactsByClientsFind();
    }
  }

  _handleChangeKeyword(e) {
    if (e.keyCode === 13 || e.which === 13) {
      this._handleContactsByClientsFind();
    } else {
      this.setState({
        keywordContact: e.target.value
      });
      const { changeKeywordContact } = this.props;
      changeKeywordContact(e.target.value);
    }
  }

  _handleContactsByClientsFind() {
    const { contactsByClientFindServer, clearContactPaginator, clearContactOrder } = this.props;

    clearContactPaginator();
    clearContactOrder();

    let _keywordContact = this.state.keywordContact ? this.state.keywordContact : "";
    contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, _keywordContact,
      v1,
      v2,
      v3,
      v4);
  }

  render() {
    return (
      <div>
        <div className="InputAddOn">
          <input style={{ padding: '0px 11px !important' }} id="searchExpression" type="text" onKeyPress={this._handleChangeKeyword} className="input InputAddOn-field" placeholder="Búsqueda por número de documento, nombre, cargo." value={this.state.keywordContact} onChange={this._handleChangeKeyword} />
          <button onClick={this._handleContactsByClientsFind} className="button InputAddOn-item" title="Buscar contacto">
            <i className="search icon" />
          </button>
        </div>
        {this.state.errorKeyword &&
          <div>
            <div className="ui pointing red basic label">
              {this.state.errorKeyword}
            </div>
          </div>
        }
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    contactsByClientFindServer, changeKeywordContact, clearContactPaginator, clearContactOrder
  }, dispatch);
}

function mapStateToProps({ contactsByClient }, ownerProps) {
  return {
    contactsByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContactComponent);