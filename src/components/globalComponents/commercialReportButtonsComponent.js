import React, { Component } from 'react';
import { SAVE_DRAFT, SAVE_PUBLISHED, AFIRMATIVE_ANSWER, CANCEL } from '../../constantsGlobal';

class CommercialReportButtonsComponent extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const {onClickSave, cancel} = this.props;
        return (
            <div style={{
                position: "fixed",
                border: "1px solid #C2C2C2",
                bottom: "0px",
                width: "100%",
                marginBottom: "0px",
                backgroundColor: "#F8F8F8",
                height: "50px",
                background: "rgba(255,255,255,0.75)"
            }}>
                <div style={{ width: "580px", height: "100%", position: "fixed", right: "0px" }}>
                    <button className="btn" type="submit" onClick={() => onClickSave(SAVE_DRAFT)} style={{
                        float: "right",
                        margin: "8px 0px 0px 8px",
                        position: "fixed",
                        backgroundColor: "#00B5AD"
                    }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                    </button>
                    <button className="btn" type="submit" onClick={() => onClickSave(SAVE_PUBLISHED)}
                        style={{ float: "right", margin: "8px 0px 0px 250px", position: "fixed" }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
                    </button>
                    <button className="btn" type="button" onClick={() => cancel()} style={{
                        float: "right",
                        margin: "8px 0px 0px 450px",
                        position: "fixed",
                        backgroundColor: "rgb(193, 193, 193)"
                    }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default CommercialReportButtonsComponent;