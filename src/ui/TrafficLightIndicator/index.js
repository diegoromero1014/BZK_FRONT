import React from 'react';
import {PropTypes} from 'prop-types';
import {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_GREEN
} from './../../components/clientInformation/constants';
import TrafficLightComponent from './../../components/grid/trafficLightComponent';

const TrafficLightIndicator = ({days, isFinalized}) => {
    if (days <= 0 && !isFinalized) {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_RED}}></TrafficLightComponent>
      );
    } else if (days <= 3 && !isFinalized) {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_ORANGE}}></TrafficLightComponent>
      );
    } else if (days > 3 && !isFinalized)  {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_GREEN}}></TrafficLightComponent>
      );
    }else{
      return null;
    }
}
TrafficLightIndicator.propTypes = {
    days : PropTypes.number.isRequired,
    isFinalized: PropTypes.bool.isRequired,
}


export default TrafficLightIndicator;