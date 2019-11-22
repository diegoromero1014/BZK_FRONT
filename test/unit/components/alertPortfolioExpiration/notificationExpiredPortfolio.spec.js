import React from 'react';
import NotificationExpiredPortfolio from '../../../../src/components/alertPortfolioExpirtation/notificationExpiredPortfolio';

let defaultProps = { data: [{ entityName: 'Example entity', daysArrears: 23, overdueBalance: 500000 }] };

describe('Test alert/notificationExpiredPortfolio', () => {

    it('should render center (verMas)', () => {
        const state = { seeMore: false };
        const wrapper = shallow(<NotificationExpiredPortfolio {...defaultProps} />);
        wrapper.setState(state);    
        expect(wrapper.find('center[name="verMas"]')).to.have.length(1);
    });

    it('should render center (verMenos)', () => {
        const state = { seeMore: true };
        const wrapper = shallow(<NotificationExpiredPortfolio {...defaultProps} />);
        wrapper.setState(state);    
        expect(wrapper.find('center[name="verMenos"]')).to.have.length(1);
    });

    it('should render div (content)', () => {
        const state = { seeMore: true };
        const wrapper = shallow(<NotificationExpiredPortfolio {...defaultProps} />);
        wrapper.setState(state);    
        expect(wrapper.find('div[name="content"]')).to.have.length(1);
    });

    it('shouldn´t render div (content)', () => {
        const state = { seeMore: false };        
        const wrapper = shallow(<NotificationExpiredPortfolio {...defaultProps} />);
        wrapper.setState(state);    
        expect(wrapper.find('div[name="content"]')).to.have.length(0);
    });
});