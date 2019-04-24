import React, { Component } from 'react'

class TdConfidentialComponent extends Component {
  render() {      
    const {columnRow, styles} = this.props;
    return (
        <td style={styles}>
            {columnRow.length > 0 ?
                <span styles={{ borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#3498db" }}
                className={"label label-danger bounceIn animated"}>{columnRow}</span> 
            : ''}            
        </td>
    );
  }
}

export default TdConfidentialComponent;
