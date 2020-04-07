import React from 'react';
import Header from '../../../../../src/components/managementView/header';

let stub;

describe('Header Test', () => {

    beforeEach(() => {
        stub = sinon.stub(window.localStorage, 'getItem').returns("Any Name");
    })

    afterEach(() => {
        stub.restore();
    })

    it('Should render component', () => {
        itRenders(<Header />);
    })
})