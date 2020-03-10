import React from 'react';
import Header from '../../../../../src/components/dashboard/header';

let stubLocalStorage;

describe('Header Test', () => {

    it('Should render component', () => {
        stubLocalStorage = sinon.stub(window.sessionStorage, 'getItem').returns("Any Name");
        itRenders(<Header />);
    })
})