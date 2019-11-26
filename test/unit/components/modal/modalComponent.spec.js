import Immutable from 'immutable';
import Modal from 'react-modal';

import {ModalComponentDialog} from '../../../../src/components/modal/modalComponent';
import AlertPortfolioExpirationObservationsActionModal from '../../../../src/components/alertPortfolioExpirtation/alertPortfolioExpirationObservationsActionModal';

describe('Test ModalComponent', () => {

    let defaultProps;

    beforeEach(() => {

        let actions = {
            component: "prueba" 
        }

        defaultProps = {
            alertPortfolioExpiration: Immutable.Map({}),
            actions
        }
    })

    it("should render ModalComponent", () => {
        itRenders(<ModalComponentDialog {...defaultProps} />)
    });

    it("should render Modal", () => {
        itRendersChildComponent(
            <ModalComponentDialog {...defaultProps} />,
            Modal
        )
    });

    it("shouldn't render AlertPortfolioExpirationObservationsActionModal when origin is not ALERT_PORTFOLIO_EXPIRATION_LIST", () => {
        itRendersChildComponent(
            <ModalComponentDialog {...defaultProps} />,
            AlertPortfolioExpirationObservationsActionModal,
            0
        )
    })

    it("should render AlertPortfolioExpirationObservationsActionModal when origin is ALERT_PORTFOLIO_EXPIRATION_LIST", () => {
        itRendersChildComponent(
            <ModalComponentDialog {...defaultProps} origin="ALERT_PORTFOLIO_EXPIRATION_LIST" />,
            AlertPortfolioExpirationObservationsActionModal
        )
    });
});