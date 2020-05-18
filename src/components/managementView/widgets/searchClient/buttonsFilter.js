import React, { Component } from 'react';
import Tooltip from "../../../toolTip/toolTipComponent";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { filterByClient, filterByRealtion } from './actions';
import { TITLE_FILTER_BY_CLIENTS, TITLE_FILTER_BY_RELATION } from './constants'

class ButtonsFilter extends Component {

    constructor(props) {
        super(props);
    }

    handleFilterByClient = (event, data) => {
        event.stopPropagation();
        document.getElementById("alertSection").scrollIntoView(true);
        const { name, id } = data;
        const { dispatchFilterbyClients } = this.props;
        dispatchFilterbyClients(name, id, TITLE_FILTER_BY_CLIENTS);
    }

    handleFilterByRelation = (event, data) => {
        event.stopPropagation();
        document.getElementById("alertSection").scrollIntoView(true);
        const { economicGroup, idEconomicGroup } = data;
        const { dispatchFilterByRealtion } = this.props;
        dispatchFilterByRealtion(economicGroup, idEconomicGroup, TITLE_FILTER_BY_RELATION);  
    }

    render() {

        const { data , data: { name, economicGroup, access } } = this.props;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Tooltip text={!access ? 'No cuenta con permisos' : name ? 'Filtrar por cliente' : 'Cliente sin NIT principal'}>
                    <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        style={{ background: `${!access ? '#9C9C9C' : name ? '#00448C' : '#9C9C9C'}` }}
                        disabled={!access ? true : name ? false : true}
                        onClick={event => this.handleFilterByClient(event, data)}
                    >
                        <i
                            className="filter icon"
                            style={{
                                color: "white",
                                marginRight: "5px",
                                fontSize: "8pt"
                            }}
                        />
                        Cliente
                    </button>
                </Tooltip>
                <Tooltip text={!access ? 'No cuenta con permisos' : economicGroup ? 'Filtrar por grupo económico' : 'Client sin grupo económico'}>
                    <button
                        className="btn btn-primary btn-sm"
                        type="button"
                        style={{ background: `${!access ? '#9C9C9C' : economicGroup ? '#00448C' : '#9C9C9C'}` }}
                        disabled={!access ? true : economicGroup ? false : true}
                        onClick={event => this.handleFilterByRelation(event, data)}
                    >
                        <i
                            className="filter icon"
                            style={{
                                color: "white",
                                marginRight: "5px",
                                fontSize: "8pt"
                            }}
                        />
                        Relación
                    </button>
                </Tooltip>
            </div>
        );
    }
}

const mapStateToProps = ({ filterDashboard }) => ({ filterDashboard });

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchFilterbyClients: filterByClient,
    dispatchFilterByRealtion: filterByRealtion
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsFilter);