import React from 'react';
import { ManagementView } from '../../../../src/components/managementView';

let defaultProps;
let dispatchUpdateTitleNavBar;

describe('ManagementView Test', () => {
    beforeEach(() => {
        dispatchUpdateTitleNavBar = sinon.fake();
        defaultProps = {
            dispatchUpdateTitleNavBar,
        }
    })

    it('Should render component', () => {
        itRenders(<ManagementView {...defaultProps}/>);
    })
})