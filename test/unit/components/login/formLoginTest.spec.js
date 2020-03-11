import React from 'react';
import { FormLogin } from '../../../../src/components/login/formLogin';
import Immutable from 'immutable';

let defaultProps;

describe('FormLogin Test', () => {

    beforeEach(() => {
        defaultProps = {
            mainReducer: Immutable.Map({ validToken: false}),
            dispatchShowLoading: sinon.fake(),
            dispatchStopObservablesLeftTimer: sinon.fake(),
            dispatchClearStateLogin: sinon.fake(),
            login: Immutable.Map({ validateLogin: false})
        }
    })

    it('Should render component', () => {
        itRenders(<FormLogin {...defaultProps}/>);
    })
})