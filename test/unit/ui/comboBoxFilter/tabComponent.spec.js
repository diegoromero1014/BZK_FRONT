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
        shallow(<TabComponent {...props} />);
    });
});