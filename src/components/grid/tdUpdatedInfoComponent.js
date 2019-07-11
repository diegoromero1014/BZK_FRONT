import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react';

const styleTooltip = {
  borderRadius: 5,
  opacity: 0.9
}

class TdUpdatedInfoComponent extends Component {
  render() {      
    const {columnRow, styles} = this.props; 
    return (
        <td style={styles} className="text-center"
        >
            {columnRow.length > 0 ?
                <Popup style={styleTooltip} trigger={ <button className="btn btn-sm btn-warning"><i style={{ margin: '0em', fontSize: '1.2em' }} className={"warning sign icon"} /></button> } inverted position='left center' wide='very'>{columnRow}</Popup>
                : ''} 
        </td>
    );
  }
}

TdUpdatedInfoComponent.defaultProps = {
  columnRow: []
}

export default TdUpdatedInfoComponent;