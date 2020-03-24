import React, { Component } from 'react';
import SearchClient from './searchClient';
import TableBuilder from '../../table/TableBuilder';
import TableComponent from '../../table';

import { TITLE_SEARCH_CLIENT, COLUMNS_SEARCH_CLIENT } from './constants';

class SectionSearchClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {
                //     prospect : 'Icon' ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'

                // },
                // {
                //     prospect : '' ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'
                // },
                // {
                //     prospect : 'icon' ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'
                // },
                // {
                //     prospect : true ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'
                // },
                // {
                //     prospect : '' ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'
                // },
                // {
                //     prospect : 'icon' ,
                //     tipoDocumento : 'Cedula',
                //     numeroCedula : 1037628960,
                //     razonSocial : 'Hola',
                //     grupoEconomic : 'Hola dos'
                // },
            ],
            messageError: false
        }
    }

    render() {
        const { data } = this.state;
        const tableSettings = new TableBuilder(data, COLUMNS_SEARCH_CLIENT)
            .setNoRowMessage("Aún no se han creado registros.")
            .setRecordsPerPage(5)
            .setStriped(true)
            .setTotalRecords(40)
            // .setOnPageChange(async page => await dispatchGetAlertPortfolioExpirationDashboard(page))
            .build();

        return (
            <div style={{ margin: "30px 0px" }}>
                <h3>{TITLE_SEARCH_CLIENT}</h3>
                <SearchClient />
                {
                    data.length !== 0 ?
                        <TableComponent tableSettings={tableSettings} /> :  null
                }
            </div>
        )
    }
}

export default SectionSearchClient;