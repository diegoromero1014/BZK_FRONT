import React from 'react';
import TdUpdatedInfoComponent from '~/src/components/grid/tdUpdatedInfoComponent';
import { Popup } from 'semantic-ui-react';

describe('Test TdUpdatedInfoComponent', () => {

    it('Should render TdUpdatedInfoComponent', () => {
        itRenders(<TdUpdatedInfoComponent />);
    });

    it('Should render td', () => {
        const wrapper = shallow(<TdUpdatedInfoComponent/>);
        expect(wrapper.find('td')).to.have.length(1);
    });

    it('should render popup when columnrow greater than 0', () => {
        const columnRow = [1];
        const wrapper = shallow(<TdUpdatedInfoComponent columnRow={columnRow} />);
        expect(wrapper.find('td')).to.have.length(1);
        expect(wrapper.find(Popup)).to.have.length(1);
    });

    it("shouldn't render popup when colomRow is empty ", () => {
        const columnRow = [];
        const wrapper = shallow(<TdUpdatedInfoComponent columnRow={columnRow} />);
        expect(wrapper.find('td')).to.have.length(1);
        expect(wrapper.find(Popup)).to.have.length(0);
    });

});