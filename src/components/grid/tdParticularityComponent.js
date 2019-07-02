import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react';

const styleTooltip = {
  borderRadius: 5,
  opacity: 0.9
}

class TdParticularityComponent extends Component {
  render() {      
    const {columnRow, styles} = this.props; 
    return (
        <td style={styles} className="text-center">
            {columnRow.length > 0 ?
                <Popup style={styleTooltip} trigger={ <button className="btn btn-success btn-sm"><i className={"comment alternate icon"} /></button> } inverted position='left center' wide='very'>{columnRow}</Popup>
            : ''}            
        </td>
    );
  }
}

export default TdParticularityComponent;