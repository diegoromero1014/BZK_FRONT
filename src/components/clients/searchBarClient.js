import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clientsFindServer, changePage, changeKeyword } from './actions';
import { NUMBER_RECORDS } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import SweetAlert from '../sweetalertFocus';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import _ from 'lodash';
import { saveSelectValue, backButtonFilter,clearSaveSelectedValue } from '../clients/actions';

let varBackButtonFilter = false;

class SearchBarClient extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEr: false,
    }
    this._handleClientsFind = this._handleClientsFind.bind(this);
    this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
    this._closeError = this._closeError.bind(this);
  }

  _closeError() {
    this.setState({ showEr: false });
  }

  componentWillMount() {
    const { login, updateTabSeleted, clientR, changeKeyword, backButtonFilter, clearSaveSelectedValue} = this.props;

    const backButtonVariable = clientR.get('backStateFilters');
    if (backButtonVariable) {
      const filters = clientR.get('filterValues');
      _.forEach(filters, (value) => {
        switch (value.name) {
          case "searchBarClient":
            changeKeyword(value.value);
            this._handleClientsFind(null, value.value);
        
            break;
        }
      });      
      backButtonFilter(varBackButtonFilter);
    } else {
      clearSaveSelectedValue();
      backButtonFilter(varBackButtonFilter);
    }

    updateTabSeleted(null);
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    }
  }

  _handleChangeKeyword(e) {
    const { changeKeyword, saveSelectValue } = this.props;
    const jsonFilter = {
      name: "searchBarClient",
      value: e.target.value
    };
    changeKeyword(e.target.value);
    if (e.keyCode === 13 || e.which === 13) {
      saveSelectValue(jsonFilter);
      this._handleClientsFind(e);
    }
  }

  _handleClientsFind(e, value) {
    const { clientsFindServer, valueTeam, valueCertification, bussinesRol, management, decisionCenter, levelAEC } = this.props;
    const { clientR } = this.props;
    let keyword
    if (typeof value === "string") {
      keyword = value ? value : clientR.get('keyword');
    } else {
      keyword = clientR.get('keyword');
    }

    
    console.log('keyword',keyword);
    console.log('value',value);
    console.log('reductor',clientR.get('keyword'));
    if (keyword === '' || keyword === undefined) {
      this.setState({ showEr: true });
    } else {
      const { changePage } = this.props;
      clientsFindServer(keyword, 0, NUMBER_RECORDS, valueCertification, valueTeam, bussinesRol, management, decisionCenter, levelAEC).then((data) => {
        if (!_.get(data, 'payload.data.validateLogin')) {
          redirectUrl("/login");
        }
      });
      changePage(1);
    }
  }

  render() {
    const { clientR } = this.props;
    var keyword = clientR.get('keyword');
    return (
      <div>
        <div className="InputAddOn">
          <input type="text" style={{ padding: '0px 11px !important' }} placeholder="Búsqueda por cliente, NIT o grupo económico" value={keyword} onKeyPress={this._handleChangeKeyword} onChange={this._handleChangeKeyword} className="input-lg input InputAddOn-field" />
          <button id="searchClients" className="btn" title="Buscar clientes" type="button" onClick={this._handleClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
            <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
          </button>
        </div>
        <SweetAlert
          type="error"
          show={this.state.showEr}
          title="Error de búsqueda"
          text="Señor usuario, por favor ingrese un criterio de búsqueda."
          onConfirm={() => this._closeError()}
        />
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clientsFindServer, changePage, changeKeyword, updateTabSeleted, redirectUrl, saveSelectValue, backButtonFilter, clearSaveSelectedValue
  }, dispatch);
}

function mapStateToProps({ clientR, tabReducer }, ownerProps) {
  return {
    clientR,
    tabReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
