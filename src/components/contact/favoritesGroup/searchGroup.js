import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { groupFindServer, changePage, changeKeyword } from './actions';
import AlertWithoutPermissions from '../../globalComponents/alertWithoutPermissions';
import { NUMBER_RECORDS } from './constants';
import { redirectUrl } from '../../globalComponents/actions';
import SweetAlert from 'sweetalert-react';
import { showLoading } from '../../loading/actions';
import _ from 'lodash';

class SearchGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this._handleClientsFind = this._handleClientsFind.bind(this);
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
    }

    componentWillMount() {
        const { login } = this.props;
        const self = this;
    }

    _handleChangeKeyword(e) {
        const { changeKeyword } = this.props;
        changeKeyword(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this._handleClientsFind(e);
        }
    }

    _handleClientsFind(e) {
        const { groupFindServer, groupsFavoriteContacts, changePage, showLoading } = this.props;
        const keywordName = groupsFavoriteContacts.get('keywordName');
        if (keywordName === '' || keywordName === undefined || keywordName === null) {
            this.setState({
                showEr: true
            });
        } else {
            showLoading(true, 'Cargando..');
            groupFindServer(keywordName, 1, NUMBER_RECORDS).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    showLoading(false, null);
                    changePage(1);
                }
            });
        }
    }

    render() {
        const { groupsFavoriteContacts } = this.props;
        var keyword = groupsFavoriteContacts.get('keywordName');

        return (
            <div style={{ marginLeft: '17px' }}>
                <div className="InputAddOn">
                    <input type="text" style={{ padding: '0px 11px !important' }} placeholder="Buscar por nombre de grupo"
                        value={keyword} onKeyPress={this._handleChangeKeyword} onChange={this._handleChangeKeyword}
                        className="input-lg input InputAddOn-field" />
                    <button id="searchClients" className="btn" title="Buscar grupo favoritos" type="button"
                        onClick={this._handleClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
                        <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                    </button>
                </div>
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this.setState({ showEr: false })}
                />
                <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        groupFindServer, changePage, changeKeyword, showLoading
    }, dispatch);
}

function mapStateToProps({ groupsFavoriteContacts }, ownerProps) {
    return { groupsFavoriteContacts };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGroup);
