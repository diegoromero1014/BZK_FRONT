import React, { Component } from 'react';
import { SAVE_DRAFT, SAVE_PUBLISHED } from '../../constantsGlobal';

class CommercialReportButtonsComponent extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const { onClickSave, onClickDownloadPDF, cancel } = this.props;
        return (
            <div 
                name="mainContainer"
                style={{
                    position: "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: "100%",
                    marginBottom: "0px",
                    backgroundColor: "#F8F8F8",
                    height: "50px",
                    background: "rgba(255,255,255,0.75)"
                }}>
                <div style={{ width: "700px", height: "100%", position: "fixed", right: "0px", textAlign: "end" }}>
                    <button
                        name="btnPreSave"
                        className="btn" type="submit" 
                        onClick={() => onClickSave(SAVE_DRAFT)} 
                        style={{ margin: "8px 10px 0px 8px", backgroundColor: "#00B5AD" }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                    </button>
                    <button
                        name="btnSave"
                        className="btn" 
                        type="submit" 
                        onClick={() => onClickSave(SAVE_PUBLISHED)}
                        style={{ margin: "8px 10px 0px 0px" }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
                    </button>
                    { onClickDownloadPDF ? 
                        <button 
                            name="btnDownloadPDF"
                            className="btn" 
                            type="button" 
                            onClick={onClickDownloadPDF} 
                            style={{ margin: "8px 10px 0px 0px", backgroundColor: "#eb984e" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Descargar PDF</span>
                        </button> : null    
                    }                    
                    <button
                        name="btnCancel"
                        className="btn" 
                        type="button" 
                        onClick={cancel} 
                        style={{ margin: "8px 10px 0px 0px", backgroundColor: "rgb(193, 193, 193)" }}>
                        <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default CommercialReportButtonsComponent;