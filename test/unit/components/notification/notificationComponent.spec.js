import React from 'react';
import NotificationComponent from '../../../../src/components/notification/notificationComponent';
import { Icon } from "semantic-ui-react";
import NotificationExpiredPortfolio from '../../../../src/components/alertPortfolioExpirtation/notificationExpiredPortfolio';

const defaultProps = { type: 'error', title: 'Any text', component: NotificationExpiredPortfolio };

describe('Test notification/notificationComponent', () => {
    it('should render Icon', () => {
        const wrapper = shallow(<NotificationComponent {...defaultProps} />);
        expect(wrapper.find(Icon)).to.have.length(2);
    });

    it('should render strong (Title)', () => {
        const wrapper = shallow(<NotificationComponent {...defaultProps} />);
        expect(wrapper.find('strong[name="titleNotification"]')).to.have.length(1);
    });

    it('should render strong (Title) with any text.', () => {
        const wrapper = shallow(<NotificationComponent {...defaultProps} />);
        expect(wrapper.find('strong[name="titleNotification"]').text()).to.equal('Any text');
    });

    it('should render center (Component)', () => {
        const wrapper = shallow(<NotificationComponent {...defaultProps} />);
        expect(wrapper.find('center[name="contentComponent"]')).to.have.length(1);
    });
}); 