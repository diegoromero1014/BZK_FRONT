import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { filterByClient } from './actions';

class ButtonsFilter extends Component {

    constructor(props){
        super(props);
    }

    handleFilterByClient = (event, data) => {
        event.stopPropagation();
        console.log(">>", data);
    }

    handleFilterByRelation = (event, data) => {
        event.stopPropagation();
        console.log(">>", data);
    }

    render() {

        const { data } = this.props;

        console.log(this);

        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{ background: "#00448C"}}
                    title="Filtro por cliente"
                    onClick={event => this.handleFilter(event, data)}
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
                    style={{ background: "#00448C"}}
                    title="Filtro por Relacion"
                    onClick={event => handleFilterByRelation(event, data)}
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

const mapStateToProps = ({filterDashboard}) => ({ filterDashboard });

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchFilterbyClients : filterByClient
},dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsFilter);

// export default ButtonsFilter;