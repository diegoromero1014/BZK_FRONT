import React from 'react';
import { Dashboard } from '../../../../src/components/dashboard';

let defaultProps;
let dispatchUpdateTitleNavBar;

describe('Dashboard Test', () => {
    beforeEach(() => {
        dispatchUpdateTitleNavBar = sinon.fake();
        defaultProps = {
            dispatchUpdateTitleNavBar,
        }
    })

    it('Should render component', () => {
        itRenders(<Dashboard {...defaultProps}/>);
    })
})