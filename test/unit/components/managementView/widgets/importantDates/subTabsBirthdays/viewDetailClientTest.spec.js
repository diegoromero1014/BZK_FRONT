import React from 'react';
import ViewDetailClient from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/viewDetailClient';

let defaultProps;

describe('ViewDetailClient Test', () => {

    beforeEach(() => {
        defaultProps = {
            data: [
                {
                    count: null
                }
            ]
        }
    })

    it('Should render component', () => {
        itRenders(<ViewDetailClient {...defaultProps} />)
    })

    it('When handleCloseModal is instanced', () => {
        const wrapper = shallow(<ViewDetailClient {...defaultProps} />);
        wrapper.instance().handleCloseModal();
        expect(wrapper.state().open).to.equal(false);
        expect(wrapper.state().clients[0].count).to.equal(defaultProps.data[0].count);
    })

    it('When handleOnClick is instanced', () => {
        const wrapper = shallow(<ViewDetailClient {...defaultProps} />);
        wrapper.instance().handleOnClick();
        expect(wrapper.state().open).to.equal(true);
    })
})