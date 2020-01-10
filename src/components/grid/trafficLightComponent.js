import React, {Component} from 'react';

class TrafficLightComponent extends Component {

  constructor(props){
      super(props);
  }

  render(){
  const {colorTraffict} = this.props;
    return (
      <td>
        <div style={{borderRadius: '50%', width: '20px', height: '20px', backgroundColor: colorTraffict.color}}></div>
      </td>
    );
  }
}

export default TrafficLightComponent;
