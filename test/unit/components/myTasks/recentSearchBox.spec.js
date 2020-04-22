import RecentSearchBox from "../../../../src/components/myTasks/RecentSearchBox";
import React from 'react';

let applyRecentSearch = sinon.fake();
let deleteSearch = sinon.fake();
let recordsRecentSearch = [
    {
        id: 1,
        name: 'Algo',
        isSelected: false
    },
    {
        id: 2,
        name: 'Algo Mas',
        isSelected: true
    }
];

describe('Test RecentSearchBox Component', () => {

    describe('Rendering tests', () => {
       
        it('should render component', () => {
            itRenders(<RecentSearchBox applyRecentSearch={applyRecentSearch} deleteSearch={deleteSearch} recordsRecentSearch={recordsRecentSearch}/>);
        });
    });

    describe('Actions tests', () => {

        it('should call applyRecentSearch when Label span is clicked', () => {
            let wrapper = shallow(<RecentSearchBox applyRecentSearch={applyRecentSearch} deleteSearch={deleteSearch} recordsRecentSearch={recordsRecentSearch}/>);
            const label = wrapper.find('Label').at(0);
            const span = label.find('span');
            span.simulate('click');
            sinon.assert.called(applyRecentSearch);
        });

        it('should call deleteSearch when Icon is clicked', () => {
            let wrapper = shallow(<RecentSearchBox applyRecentSearch={applyRecentSearch} deleteSearch={deleteSearch} recordsRecentSearch={recordsRecentSearch}/>);
            const label = wrapper.find('Label').at(0);
            const icon = label.find('Icon');
            icon.simulate('click');
            sinon.assert.called(deleteSearch);
        });
    })
});