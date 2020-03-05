import React from "react";
import TrafficLightIndicator from './../../../../src/ui/TrafficLightIndicator';
import { shallow } from "enzyme";


describe("Test TrafficLightIndicator",  () => {
    it("should render green traffic light", () => {
        const props ={
            days:7,
            isFinalized: false
        }
        const wrapper = shallow(<TrafficLightIndicator {...props}></TrafficLightIndicator>);
        expect(wrapper).to.have.length(1);
    })
    it("should render yellow traffic light", () => {
      const props = {
        days: 3,
        isFinalized: false
      };
      const wrapper = shallow(
        <TrafficLightIndicator {...props}></TrafficLightIndicator>
      );
      expect(wrapper).to.have.length(1);
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
    });
});