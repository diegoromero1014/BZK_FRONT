import React from 'react';
import Header from '../../../../../src/components/managementView/header';

describe('Header Test', () => {

    it('Should render component', () => {
        sinon.stub(window.sessionStorage, 'getItem').returns("Any Name");
        itRenders(<Header />);
    })
})