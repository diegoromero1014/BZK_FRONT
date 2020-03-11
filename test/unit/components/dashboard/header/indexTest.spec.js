import React from 'react';
import Header from '../../../../../src/components/dashboard/header';

describe('Header Test', () => {

    it('Should render component', () => {
        sinon.stub(window.sessionStorage, 'getItem').returns("Any Name");
        itRenders(<Header />);
    })
})