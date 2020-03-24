import React, { Component } from 'react';
import Tooltip from '../../toolTip/toolTipComponent';
import SweetAlert from "../../sweetalertFocus";
import { redirectCreatePropspect } from './utils';
import { PLACEHOLDER_SEARCH_CLIENT, MESSAGE_TOOLTIP } from './constants';

class searchClient extends Componet {
    state = {
        keyword: '',
        swError: false
    }

    handelInput = event => {
        const { name , value } = event.target;
        this.setState({
            [name] : value
        })
    }

    handelKeyword = event => {
        const { keyCode } = event ;
        if (keyCode === 13) {
            console.log('hola')
            console.log(event)
        }
    }

    closeError = () => {
        this.setState({
            swError : false
        })
    }

    render() {
        const { swError } = this.state;

        return (
            <div style={{ width: "100%", display: 'flex' }}>
                <div style={{ width: "70%" }}>
                    <input name="keyword" type="text" style={{ padding: '0px 11px !important', width: "80%" }} placeholder={PLACEHOLDER_SEARCH_CLIENT} onChange={event => this.handelInput(event)}
                        onKeyPress={event => this.handelKeyword(event)} className="input-lg input InputAddOn-field" />
                    <button id="searchClients" className="btn" title="Buscar clientes" type="button"
                        style={{ backgroundColor: "#E0E2E2" }}>
                        <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                    </button>
                </div>
                <Tooltip text={MESSAGE_TOOLTIP}>
                    <button className="btn btn-primary" onClick={redirectCreatePropspect} type="button"
                        style={{ marginLeft: "60px" }}>
                        <i className="add user icon"
                            style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                    </button>
                </Tooltip>
                <SweetAlert
                    type="error"
                    show={swError}
                    title="Error de búsqueda"
                    text="Señor usuario, por favor ingrese un criterio de búsqueda."
                    onConfirm={() => this._closeError()}
                />
            </div>
        )
    }
}

export default searchClient;