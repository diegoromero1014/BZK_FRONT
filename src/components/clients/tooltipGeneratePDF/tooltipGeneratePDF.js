import React from 'react';
import { Popup, List } from 'semantic-ui-react';
import '../../../../styles/modules/client/tooltipGeneratePDF.scss';

const styleTooltip = {
    borderRadius: 5,
    opacity: 0.9
  }
  
export const TooltipGeneratePDF = ({days, isDefinitive, permissionToGeneratePDF, isEnabled, action}) => {
    return (
        <div>
            <Popup                    
                trigger = {isDefinitive && permissionToGeneratePDF && isEnabled 
                    ? <button className="btn" type="button" style={{ backgroundColor: "#eb984e" }} onClick ={() => action() } id="btn-generar-pdf"><span>Generar PDF</span></button> :
                     <button className="btn" type="button"  style={{ backgroundColor: "#C0C0C0" }} disabled id="btn-generar-pdf"><span>Generar PDF</span></button>}
                flowing
                hoverable
                inverted
                style={styleTooltip}
            >
                <List id="tooltip-generar-pdf">
                    <List.Item id="tooltip-item1">
                        {isDefinitive ? <List.Icon color="green" name="check"/> : <List.Icon color="red" name="close"/>}
                        <List.Content>Guardado como definitivo</List.Content>
                    </List.Item>
                    <List.Item id="tooltip-item2">
                        {permissionToGeneratePDF ? <List.Icon color="green" name="check"/> : <List.Icon color="red" name="close"/>}
                        <List.Content>Permiso para generar PDF</List.Content>
                    </List.Item>
                    <List.Item id="tooltip-item3">
                        {isEnabled ? <List.Icon color="green" name="check"/> : <List.Icon color="red" name="close"/>}
                        <List.Content>La última actualización está<br/>dentro del tiempo permitido <br/>para generar PDF <span><b>({days} días)</b></span></List.Content>
                    </List.Item>
                </List>
            </Popup> 
        </div> 
    )
}