import React from 'react';
import TabComponent from './../../../../src/ui/Tab';
import MenuItem from 'semantic-ui-react/dist/commonjs/collections/Menu/MenuItem';
describe("Test TabComponent", () => {
    it("should render two tabs", ()=>{
        const props = {
          tabs: [
            {
              name: "Tab1",
              number: 2,
              content: <div></div>
            },
            {
              name: "Tab2",
              number: 2,
              content: <div></div>
            }]
        };
        const wrapper = shallow(<TabComponent {...props}/>);
        expect(wrapper.find(MenuItem)).to.have.length(2);
    });
    it("should block handleClick when tab is disabled", () => {
        const props = {
          tabs: [
            {
              name: "Tab1",
              number: 2,
              content: <div>hola mundo</div>,
              disable: true
            }
          ]
        };
        const wrapper = shallow(<TabComponent {...props} />);
        expect(wrapper.find(MenuItem).props().style.backgroundColor).to.equals("rgba(0, 0, 0, 0.09)");
    });
});