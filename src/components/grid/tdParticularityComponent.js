import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react';

class TdParticularityComponent extends Component {
  render() {      
    const {columnRow, styles} = this.props; 
    return (
        <td style={styles}>
            {columnRow.length > 0 ?
                <Popup trigger={ <button className="btn btn-success btn-sm"><i className={"comment alternate icon"} /></button> } inverted>{columnRow}</Popup>
            : ''}            
        </td>
    );
  }
}

export default TdParticularityComponent;