import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clientsFindServer, changePage, changeKeyword } from './actions';
import { NUMBER_RECORDS } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import _ from 'lodash';

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
    const { login, updateTabSeleted } = this.props;
    updateTabSeleted(null);
    if (window.localStorage.getItem('sessionToken') === "") {
      redirectUrl("/login");
    }
  }

  _handleChangeKeyword(e) {
    const { changeKeyword } = this.props;
    changeKeyword(e.target.value);
    if (e.keyCode === 13 || e.which === 13) {
      this._handleClientsFind(e);
    }
  }

  _handleClientsFind(e) {
    const { clientsFindServer, valueTeam, valueCertification, linkingStatus, levelAEC } = this.props;
    const { clientR } = this.props;
    if (clientR.get('keyword') === '' || clientR.get('keyword') === undefined) {
      this.setState({ showEr: true });
    } else {
      const { changePage } = this.props;
      clientsFindServer(clientR.get('keyword'), 0, NUMBER_RECORDS, valueCertification, valueTeam, linkingStatus, levelAEC).then((data) => {
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
      <div style={{ marginLeft: '17px' }}>
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
    clientsFindServer, changePage, changeKeyword, updateTabSeleted, redirectUrl
  }, dispatch);
}

function mapStateToProps({ clientR, tabReducer }, ownerProps) {
  return {
    clientR,
    tabReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
