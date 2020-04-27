import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { groupFindServer, changePage, changeKeyword } from './actions';
import AlertWithoutPermissions from '../../globalComponents/alertWithoutPermissions';
import { NUMBER_RECORDS } from './constants';
import SweetAlert from '../../sweetalertFocus';
import { showLoading } from '../../loading/actions';
import _ from 'lodash';

export class SearchGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this.handleClientsFind = this.handleClientsFind.bind(this);
        this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
    }

    handleChangeKeyword = e => {
        const { dispatchChangeKeyword } = this.props;
        dispatchChangeKeyword(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            this.handleClientsFind(e);
        }
    }

    handleClientsFind = () => {
        const { dispatchGroupFindServer, groupsFavoriteContacts, dispatchChangePage, dispatchShowLoading } = this.props;
        const keywordName = groupsFavoriteContacts.get('keywordName');
        if (keywordName === '' || keywordName === undefined || keywordName === null) {
            this.setState({
                showEr: true
            });
        } else {
            dispatchShowLoading(true, 'Cargando..');
            dispatchGroupFindServer(keywordName, 1, NUMBER_RECORDS).then((data) => {
                if (_.has(data, 'payload.data.data')) {
                    dispatchShowLoading(false, null);
                    dispatchChangePage(1);
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
                        value={keyword} onKeyPress={this.handleChangeKeyword} onChange={this.handleChangeKeyword}
                        className="input-lg input InputAddOn-field" />
                    <button id="searchClients" className="btn" title="Buscar grupo favoritos" type="button"
                        onClick={this.handleClientsFind} style={{ backgroundColor: "#E0E2E2" }}>
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

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGroupFindServer : groupFindServer,
    dispatchChangePage : changePage,
    dispatchChangeKeyword : changeKeyword,
    dispatchShowLoading : showLoading
}, dispatch);


function mapStateToProps({ groupsFavoriteContacts }, ownerProps) {
    return { groupsFavoriteContacts };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchGroup);
