import React from 'react';
import TdParticularityComponent from '~/src/components/grid/tdParticularityComponent';
import { Popup } from 'semantic-ui-react';

describe('Test TdParticularityComponent', () => {

    it('Should render TdParticularityComponent', () => {
        itRenders(<TdParticularityComponent />);
    });

    it('Should render td', () => {
        const wrapper = shallow(<TdParticularityComponent/>);
        expect(wrapper.find('td')).to.have.length(1);
    });

    it('should render popup when columnrow greater than 0', () => {
        const columnRow = [1];
        const wrapper = shallow(<TdParticularityComponent columnRow={columnRow} />);
        expect(wrapper.find('td')).to.have.length(1);
        expect(wrapper.find(Popup)).to.have.length(1);
    });

    it("shouldn't render popup when colomRow is empty ", () => {
        const columnRow = [];
        const wrapper = shallow(<TdParticularityComponent columnRow={columnRow} />);
        expect(wrapper.find('td')).to.have.length(1);
        expect(wrapper.find(Popup)).to.have.length(0);
    });

});