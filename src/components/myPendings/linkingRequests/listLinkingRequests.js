import React, { Component } from 'react';
import moment from "moment";
import { has, indexOf } from 'lodash';

import GridComponent from '../../grid/component';

import { shorterStringValue } from '../../../actionsGlobal';

import { VIEW_OBSERVATIONS_LINKING_REQUESTS } from '../../modal/constants';
import { VISUALIZAR } from '../../../constantsGlobal';

class ListLinkingRequests extends Component {

    constructor(props) {
        super(props);
        this._renderHeaders = this._renderHeaders.bind(this);
        this._renderCellView = this._renderCellView.bind(this);
    }

    _renderHeaders() {
        return [
            {
                title: "",
                key: "actions",
                width: '20px'
            },
            {
                title: "Tipo documento",
                key: "typeOfDocument",
                width: '160px'
            },
            {
                title: "Número documento",
                key: "documentClient",
                width: '170px'
            },
            {
                title: "Nombre/Razón social",
                key: "clientNameLink",
                showLink: has(this.props.reducerGlobal.get('permissionsClients'), indexOf(this.props.reducerGlobal.get('permissionsClients'), VISUALIZAR), false),
                width: '380px'
            },
            {
                title: "Célula",
                key: "team",
                width: '100px'
            },
            {
                title: "Líneas de negocio",
                key: "lineOfBunsiness",
                width: '380px'
            },
            {
                title: "Estado",
                key: "statusLinkRequest",
                width: '100px'
            },
            {
                title: "Creado por",
                key: "createdBy",
                width: '150px'
            },
            {
                title: "Fecha creación",
                key: "createdTimestamp",
                width: '200px'
            },
            {
                title: "Actualizado por",
                key: "updateBy",
                width: '150px'
            },
            {
                title: "Fecha actualización",
                key: "updatedTimestamp",
                width: '150px'
            }
        ]
    }

    _renderCellView(data = []) {
        return data.map(item => {
            var createdTimestampMod, updatedTimestampMod;
            if (item.createdTimestamp != null) {
                let createdTimestamp = moment(item.createdTimestamp, "x").locale('es');
                createdTimestampMod = createdTimestamp.format("DD") + " " + createdTimestamp.format("MMM") + " " + createdTimestamp.format("YYYY") + ", " + createdTimestamp.format("hh:mm a");
            }
            if (item.updatedTimestamp != null) {
                let updatedTimestamp = moment(item.updatedTimestamp, "x").locale('es');
                updatedTimestampMod = updatedTimestamp.format("DD") + " " + updatedTimestamp.format("MMM") + " " + updatedTimestamp.format("YYYY") + ", " + updatedTimestamp.format("hh:mm a");
            }
            const client = {
                typeOfDocument: item.typeOfDocument,
                documentClient: item.documentClient,
                nameClient: item.nameClient,
                statusLinkRequest: item.statusLinkRequest,
            }
            return {
                actions: {
                    actionView: true,
                    component: VIEW_OBSERVATIONS_LINKING_REQUESTS,
                    idLinkingRequests: item.idLinkRequest,
                    client
                },
                typeOfDocument: item.typeOfDocument,
                documentClient: item.documentClient,
                clientNameLink: {
                    id: item.idClient,
                    value: shorterStringValue(item.nameClient),
                    link: '/dashboard/clientInformation'
                },
                team: item.team,
                lineOfBunsiness: item.lineOfBunsiness,
                statusLinkRequest: item.statusLinkRequest,
                createdBy: item.createdBy,
                createdTimestamp: createdTimestampMod,
                updateBy: item.updateBy,
                updatedTimestamp: updatedTimestampMod
            };
        });
    }


    
    render() {
        const { linkRequestsReducer } = this.props;
        const modalTitle = 'Solicitudes de vinculación';
        const data = linkRequestsReducer.get('listLinkRequests');
        return (
            <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
                <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
            </div>
        )
    }
}

export default ListLinkingRequests;

