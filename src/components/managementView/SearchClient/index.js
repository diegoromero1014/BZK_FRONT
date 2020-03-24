import React, { Component } from 'react';
import Tooltip from '../../toolTip/toolTipComponent';
import { TITLE_SEARCH_CLIENT, PLACEHOLDER_SEARCH_CLIENT } from './constants';

class SearchClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            
        }
    }


    render() {
        return (
            <div style={{ margin: "30px 0px" }}>
                <h3>{TITLE_SEARCH_CLIENT}</h3>
                <div style={{ width: "100%" , display: 'flex'}}>
                    <div style={{width: "80%"}}>
                        <input type="text" style={{ padding: '0px 11px !important', width: "80%" }} placeholder={PLACEHOLDER_SEARCH_CLIENT}
                            className="input-lg input InputAddOn-field" />
                        <button id="searchClients" className="btn" title="Buscar clientes" type="button"
                            style={{ backgroundColor: "#E0E2E2" }}>
                            <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                        </button>
                    </div>
                    <Tooltip text="Crear prospecto">
                        <button className="btn btn-primary" onClick={this._clickButtonCreateProps} type="button"
                            style={{ marginLeft: "60px" }}>
                            <i className="add user icon"
                                style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                        </button>
                    </Tooltip>
                </div>
            </div>
        )
    }
}

export default SearchClient;