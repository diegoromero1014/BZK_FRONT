import React from "react";
import TrafficLightIndicator from './../../../../src/ui/TrafficLightIndicator';
import { shallow } from "enzyme";
import TrafficLightComponent from './../../../../src/components/grid/trafficLightComponent';
import {
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_GREEN
} from './../../../../src/components/clientInformation/constants';

describe("Test TrafficLightIndicator",  () => {
    it("should render green traffic light", () => {
        const props ={
            days:7,
            isFinalized: false
        }
        const wrapper = shallow(<TrafficLightIndicator {...props}></TrafficLightIndicator>).find(TrafficLightComponent);
        expect(wrapper).to.have.length(1);
        expect(wrapper.props().colorTraffict.color).to.equals(COLOR_GREEN);
    })
    it("should render orange traffic light", () => {
        const props = {
            days: 3,
            isFinalized: false
        };
        const wrapper = shallow(
            <TrafficLightIndicator {...props}></TrafficLightIndicator>
        );
        expect(wrapper).to.have.length(1);            
        expect(wrapper.props().colorTraffict.color).to.equals(COLOR_ORANGE);

    });
    it("should render red traffic light", () => {
        const props = {
            days: 0,
            isFinalized: false
        };
        const wrapper = shallow(
            <TrafficLightIndicator {...props}></TrafficLightIndicator>
        );
        expect(wrapper).to.have.length(1);
        expect(wrapper.props().colorTraffict.color).to.equals(COLOR_RED);
    });
    it("should not render traffic light", () => {
      const props = {
        days: 7,
        isFinalized: true
      };
      const wrapper = shallow(
        <TrafficLightIndicator {...props}></TrafficLightIndicator>
      );      
      expect(wrapper).to.have.length(1);
      expect(wrapper.props().colorTraffict.color).to.equals("rgba(255, 255, 255,0)");
    });
});