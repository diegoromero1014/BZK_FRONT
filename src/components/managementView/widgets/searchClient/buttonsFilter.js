import React, { Component } from 'react';
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
        const { name, id } = data;
        const { dispatchFilterbyClients } = this.props;
        dispatchFilterbyClients(name, id, TITLE_FILTER_BY_CLIENTS);
    }

    handleFilterByRelation = (event, data) => {
        event.stopPropagation();
        const { economicGroup, id } = data;
        const { dispatchFilterByRealtion } = this.props;
        dispatchFilterByRealtion(economicGroup, id, TITLE_FILTER_BY_RELATION);
    }

    render() {

        const { data } = this.props;

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{ background: "#00448C" }}
                    title="Filtro por cliente"
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
                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{ background: "#00448C" }}
                    title="Filtro por Relacion"
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

// export default ButtonsFilter;