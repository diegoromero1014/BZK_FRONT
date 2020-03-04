import React from 'react';
import {PropTypes} from 'prop-types';
import {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_GREEN
} from './../../components/clientInformation/constants';
import TrafficLightComponent from './../../components/grid/trafficLightComponent';

const TrafficLightIndicator = ({days}) => {
    if (days <= 0) {
      return (
        <TrafficLightComponent color={COLOR_RED}></TrafficLightComponent>
      );
    } else if (days <= 3) {
      return (
        <TrafficLightComponent color={COLOR_ORANGE}></TrafficLightComponent>
      );
    } else {
      return (
        <TrafficLightComponent color={COLOR_GREEN}></TrafficLightComponent>
      );
    }
}
TrafficLightIndicator.propTypes = {
    days : PropTypes.number.isRequired,
}


export default TrafficLightIndicator;