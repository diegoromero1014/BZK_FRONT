import React from 'react'
import { AlertPortfolioExpirationObservationsActionModal } from '../../../../src/components/alertPortfolioExpirtation/alertPortfolioExpirationObservationsActionModal';

describe('Test AlertPortfolioExpirationObservationsActionModal', () => {
    let defaultProps = {
        alertPortfolioExp: {
            observations: "Alguna observación",
            expectations: 1
        }
    }    

    it('should render component', () => {        
        itRenders(<AlertPortfolioExpirationObservationsActionModal {...defaultProps} />);
    });

    it('open modal observations button should have the btn-danger class', () => {
        defaultProps = {
            alertPortfolioExp: {
                observations: null,
                expectations: null
            }
        };

        const wrapper = mount(<AlertPortfolioExpirationObservationsActionModal {...defaultProps} />);
        expect(wrapper.find('Popup')).to.have.length(1);        
        expect(wrapper.find('button')).to.have.length(1);
        expect(wrapper.find('button').hasClass('btn-danger')).to.equal(true);                
    });

    it('open modal observations button should have the btn-success class', () => {
        defaultProps = {
            alertPortfolioExp: {
                observations: "Alguna observación",
                expectations: 1
            }
        };

        const wrapper = mount(<AlertPortfolioExpirationObservationsActionModal {...defaultProps} />);
        expect(wrapper.find('Popup')).to.have.length(1);
        expect(wrapper.find('button')).to.have.length(1);
        expect(wrapper.find('button').hasClass('btn-success')).to.equal(true);
    });
})
