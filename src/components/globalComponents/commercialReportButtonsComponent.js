import React, { Component } from 'react';
import { SAVE_DRAFT, SAVE_PUBLISHED } from '../../constantsGlobal';

export default class CommercialReportButtonsComponent extends Component {

    render() {
        const { onClickSave, onClickDownloadPDF, cancel, fromModal, isEditable, documentDraft, creatingReport, definitiveSaveTitle } = this.props;
        return (
            <div 
                name="commercialReportButtons"
                style={{
                    position: fromModal ? "absolute" : "fixed",
                    border: "1px solid #C2C2C2",
                    bottom: "0px",
                    width: fromModal ? "100%" : "calc(100% - 190px)",
                    marginBottom: "0px",
                    padding: '0px 0 8px 0',
                    backgroundColor: "#F8F8F8",
                    height: "60px",
                    background: "rgba(255,255,255,0.75)",
                    zIndex: "1"
                }}>
                <div style={{ width: "100%", height: "100%", right: "0px", display: 'flex', "justify-content": 'flex-end' }}>                
                    {((!isEditable && !documentDraft) || creatingReport) &&
                        <button
                            name="btnPreSave"
                            className="btn" type="submit"                             
                            onClick={() => onClickSave && onClickSave(SAVE_DRAFT)}
                            style={{ margin: "8px 10px 0px 8px", backgroundColor: "#00B5AD" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                        </button>
                    }
                    {(!isEditable || creatingReport) && 
                        <button
                            name="btnSave"
                            className="btn" 
                            type="submit" 
                            onClick={() => onClickSave && onClickSave(SAVE_PUBLISHED)}
                            style={{ margin: "8px 10px 0px 0px" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>{definitiveSaveTitle}</span>
                        </button>
                    }                                        
                    { onClickDownloadPDF && !creatingReport &&
                        <button 
                            name="btnDownloadPDF"
                            className="btn" 
                            type="button" 
                            onClick={onClickDownloadPDF} 
                            style={{ margin: "8px 10px 0px 0px", backgroundColor: "#eb984e" }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Descargar PDF</span>
                        </button> 
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