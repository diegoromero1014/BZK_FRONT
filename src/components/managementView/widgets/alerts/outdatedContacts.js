import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Table from "../../../table";
import TableBuilder from "../../../table/TableBuilder";
import { COLUMNS_OUTDATED_CONTACTS, MAX_ROWS } from './constants';
import { redirectUrl } from "../../../globalComponents/actions";
import { getOutdatedContacts } from '../../actions';
import { changeActiveItemMenu } from '../../../menu/actions';
import { MODULE_CONTACTS } from '../../../../constantsGlobal';

export class OutdatedContactsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }

    handleOnPageChange = async page => {
        const { dispatchGetOutdatedContacts } = this.props;
        await this.setState({ loading: true});
        await dispatchGetOutdatedContacts((page - 1), MAX_ROWS);
        await this.setState({ loading: false });
    }

    handleOnClick = data => {
        const { dispatchChangeActiveItemMenu } = this.props;
        window.sessionStorage.setItem('idContactSelected', data.id);
        dispatchChangeActiveItemMenu(MODULE_CONTACTS);
        redirectUrl("/dashboard/clientsContacts");
    }

    render() {
        const { data, total } = this.props;

        return (
            <div>
                <Table
                    tableSettings={
                        new TableBuilder(data, COLUMNS_OUTDATED_CONTACTS)
                            .setNoRowMessage("No existen registros.")
                            .setRecordsPerPage(MAX_ROWS)
                            .setStriped(true)
                            .setTotalRecords(total)
                            .setOnPageChange(this.handleOnPageChange)
                            .setOnClick(this.handleOnClick)
                            .setLoading(this.state.loading)
                            .build()
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = ({ outdatedContacts: { rows, rowCount } }) => ({
    data: rows,
    total: rowCount
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGetOutdatedContacts: getOutdatedContacts,
    dispatchChangeActiveItemMenu: changeActiveItemMenu
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OutdatedContactsComponent);