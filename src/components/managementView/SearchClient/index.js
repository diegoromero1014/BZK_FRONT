import React, { Component } from 'react';

class SearchClient extends Component{
    render(){
        return(
            <div>
                <h4>Buscar clientes</h4>
                <div>
                    <input type="text"/>
                    <button>Agregar</button>
                </div>
            </div>
        )
    }
}

export default SearchClient;