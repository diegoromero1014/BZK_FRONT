import React, { Component } from 'react';

class ButtonsFilter extends Component {
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{ background: "#00448C" }}
                    title="Filtro por cliente"
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
                >
                    <i
                        className="filter icon"
                        style={{
                            color: "white",
                            marginRight: "5px",
                            fontSize: "8pt"
                        }}
                    />
                    Relacion
                </button>
            </div>
        );
    }
}

export default ButtonsFilter;