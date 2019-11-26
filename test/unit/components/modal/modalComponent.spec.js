import Immutable from 'immutable';
import Modal from 'react-modal';

import {ModalComponentDialog} from '../../../../src/components/modal/modalComponent';

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
    })
});