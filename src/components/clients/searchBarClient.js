import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clientsFindServer, changePage, changeKeyword } from './actions';
import { redirectUrl } from '../globalComponents/actions';
import SweetAlert from '../sweetalertFocus';
import { updateTabSeleted } from '../clientDetailsInfo/actions';
import _ from 'lodash';
import { saveSelectValue, backButtonFilter, clearSaveSelectedValue } from '../clients/actions';
import { MESSAGE_PLACEHOLDER } from './constants';

import '../../../styles/app/placeholder.scss';

class SearchBarClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        }
        // this._handleClientsFind = this._handleClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._closeError = this._closeError.bind(this);
        this._handledClicChange = this._handledClicChange.bind(this);
    }

    _closeError() {
        this.setState({ showEr: false });
    }

    componentWillMount() {
        const { updateTabSeleted } = this.props;


        updateTabSeleted(null);
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        }
    }

    _handleChangeKeyword(e) {
        const { changeKeyword } = this.props;

        changeKeyword(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this._handledClicChange(e.target.value);
        }
    }

    _handledClicChange(keywordValue) {
        const { clientR, saveSelectValue, handleClientsFind } = this.props;
        let keyword = keywordValue ? keywordValue : clientR.get('keyword');

        if (keyword === '' || keyword === undefined) {
            this.setState({ showEr: true });
        } else {
            const jsonFilter = {
                name: "searchBarClient",
                value: keyword
            };
            saveSelectValue(jsonFilter);
            handleClientsFind();
        }
    }


    render() {
        const { clientR } = this.props;
        var keyword = clientR.get('keyword');
        return (
            <div>
                <div className="InputAddOn">
                    <input
                        className="input-lg input InputAddOn-field"
                        type="text"
                        style={{ padding: '0px 11px !important' }}
                        placeholder={MESSAGE_PLACEHOLDER}
                        value={keyword} onKeyPress={this._handleChangeKeyword}
                        onChange={this._handleChangeKeyword}
                    />
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button" onClick={() => { this._handledClicChange() }} style={{ backgroundColor: "#E0E2E2" }}>
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

function mapStateToProps({ clientR, tabReducer }) {
    return {
        clientR,
        tabReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarClient);
