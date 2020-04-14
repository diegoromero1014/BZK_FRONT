import React from 'react';
import SidebarComponent from "../../../../src/components/myTasks/SidebarComponent";

let dispatchFilters;
let defaultFilters
let defaultProps = {};

describe('Test SidebarComponent', () => {
    beforeEach(() => {
        dispatchFilters = sinon.stub();
        defaultFilters = sinon.stub();
        defaultProps = {
            dispatchFilters,
            defaultFilters
        };
    });

    describe('Rendering unit test', () => {
        it('Should render SidebarComponent', () => {
            itRenders(<SidebarComponent {...defaultProps}/>);
        });

        it('onSetSidebarOpen validate open sidebar', () => {
            const wrapper = shallow(<SidebarComponent {...defaultProps}/>);
            wrapper.instance().onSetSidebarOpen(true);
            expect(wrapper.state().sidebarOpen).to.equal(true);
        });
    });
});