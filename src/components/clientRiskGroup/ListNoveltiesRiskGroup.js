import React, { Component } from 'react';
import GridComponent from '../grid/component';
import { VIEW_OBSERVATIONS_BY_RISK_GROUP } from '../modal/constants';

class ListNoveltiesRiskGroup extends Component {
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
                title: "Identificación",
                key: "code",
                width: '160px'
            },
            {
                title: "Nombre",
                key: "nameData",
                width: '380px'
            },
            {
                title: "Novedad",
                key: "novelty",
                width: '380px'
            },
            {
                title: "Estado novedad",
                key: "stateNovelty",
                width: '100px'
            }
        ]
    }

    _renderCellView(data = []) {
        return data.map(item => {
            let map_trans_novelty_type = {
                "DELETE": "Eliminar",
                "ADD": "Agregar",
                "REMOVE": "Remover",
                "EDIT": "Editar"
            }

            let map_trans_novelty_state = {
                "APPROVED": "Aprobado",
                "REJECTED": "Rechazado",
                "PENDING": "Pendiente"
            }

            const infoRiskGroup = {
                code: item.riskGroupCode,
                nameData: item.name,
                novelty: map_trans_novelty_type[item.novelty],
                stateNovelty: map_trans_novelty_state[item.stateNovelty],
                entity: item.entity
            }

            return {
                actions: {
                    actionView: true,
                    component: VIEW_OBSERVATIONS_BY_RISK_GROUP,
                    idRiskGroup: item.entityId,
                    infoRiskGroup
                },
                code: item.riskGroupCode,
                nameData: item.name,
                novelty: map_trans_novelty_type[item.novelty],
                stateNovelty: map_trans_novelty_state[item.stateNovelty]
            }
        });
    }

    render() {
        const { riskGroupReducer } = this.props;
        const modalTitle = 'Observaciones grupos de riesgo';
        const data = riskGroupReducer.get("listNoveltiesRiskGroup");

        if (data.length == 0) {
            return (<div><p>Señor usuario, no se encontraron registros para mostrar</p></div>)
        } else {
            return (
                <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
                    <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
                </div>
            )
        }
    }
}

export default ListNoveltiesRiskGroup;