import React from 'react';
import { shallow } from 'enzyme';

import SectionClientOpportunitiesWeaknesses from '../../../../src/components/clientDetailsInfo/sectionClientOpportunitiesWeaknesses';

let defaultProps = {
    infoClient: {
        clientDetailsRequest: {
            weaknesses: [{}],
            opportunities: [{}]
        }
    }
}

describe('SectionClientOpportunitiesWeaknesses Test', () => {

    it('Should render SectionClientOpportunitiesWeaknesses', () => {
        itRenders(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>)
    })

    it('When infoClient is null', () => {
        defaultProps.infoClient = null;
        itRenders(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>)
    })

    it('When infoClient has information', () => {
        defaultProps.infoClient = { clientDetailsRequest: { 
            opportunities: [{ text: 'Any text' }],
            weaknesses: [{ text: 'Any text' }]
        }}
        itRenders(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>);
    })

    it('Should render list-objects-opportunities', () => {
        const wrapper = shallow(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>);
        expect(wrapper.find('.list-objects-opportunities')).to.have.length(1);
    })

    it('Should render list-objects-weaknesses', () => {
        const wrapper = shallow(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>);
        expect(wrapper.find('.list-objects-weaknesses')).to.have.length(1);
    })

    it('Shouldn´t render any list-objects-weaknesses and list-objects-opportunities', () => {
        defaultProps.infoClient = null;
        const wrapper = shallow(<SectionClientOpportunitiesWeaknesses {...defaultProps}/>);
        wrapper.setState({ weaknesses: undefined, opportunities: undefined })
        expect(wrapper.find('.list-objects-weaknesses')).to.have.length(0);
        expect(wrapper.find('.list-objects-opportunities')).to.have.length(0);
    })
})