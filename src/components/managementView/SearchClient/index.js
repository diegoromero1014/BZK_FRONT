import React, { Component } from 'react';
import SearchClient from './searchClient';
import TableBuilder from '../../table/TableBuilder';
import TableComponent from '../../table';

import { TITLE_SEARCH_CLIENT, COLUMNS_SEARCH_CLIENT } from './constants';

class SectionSearchClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            messageError: false
        }
    }

    saveData = data => {
        this.setState({
            data
        })
    }

    render() {
        const { data } = this.state;
        const tableSettings = new TableBuilder(data, COLUMNS_SEARCH_CLIENT)
            .setNoRowMessage("Aún no se han creado registros.")
            .setRecordsPerPage(10)
            .setStriped(true)
            .setTotalRecords(data.length)
            // .setOnPageChange(async page => await dispatchGetAlertPortfolioExpirationDashboard(page))
            .build();

        return (
            <div style={{ margin: "30px 0px" }}>
                <h3>{TITLE_SEARCH_CLIENT}</h3>
                <SearchClient saveData={this.saveData}/>
                {
                    data.length !== 0 ?
                        <TableComponent tableSettings={tableSettings} /> :  null
                }
            </div>
        )
    }
}

export default SectionSearchClient;