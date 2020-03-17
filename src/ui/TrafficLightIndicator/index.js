import React from 'react';
import {PropTypes} from 'prop-types';
import {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_GREEN
} from './../../components/clientInformation/constants';
import TrafficLightComponent from './../../components/grid/trafficLightComponent';

const TrafficLightIndicator = ({days, isFinalized, style}) => {
    if (days === 0 && !isFinalized) {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_RED}} style={style}></TrafficLightComponent>
      );
    } else if (days <= 3 && !isFinalized) {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_ORANGE}} style={style}></TrafficLightComponent>
      );
    } else if (days > 3 && !isFinalized)  {
      return (
        <TrafficLightComponent colorTraffict={{color:COLOR_GREEN}} style={style}></TrafficLightComponent>
      );
    }else{
      return (
        <TrafficLightComponent
          colorTraffict={{ color: "rgba(255, 255, 255,0)" }}
          style={style}
        ></TrafficLightComponent>
      );
    }
}
TrafficLightIndicator.propTypes = {
    days : PropTypes.number.isRequired,
    isFinalized: PropTypes.bool.isRequired,
}


export default TrafficLightIndicator;