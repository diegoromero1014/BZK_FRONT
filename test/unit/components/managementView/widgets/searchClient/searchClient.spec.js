import React from 'react';
// import searchClientRedux from '../../../../../../src/components/managementView/widgets/searchClient/searchClient';
// import { searchClient } from '../../../../../../src/components/managementView/widgets/searchClient/searchClient';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';


let dispatchClientsFindServer ;
let dispatchSwtShowMessage ; 
let handleSetSearched ;
let setKeyword ;
let restartPage ;

let defaultProps ;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;

describe('Test searchClient component', () => {

    beforeEach(() => {
        store = mockStore({});
        dispatchClientsFindServer = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        handleSetSearched = sinon.fake();
        setKeyword = sinon.fake();
        restartPage = sinon.fake();

        defaultProps = {
            dispatchClientsFindServer,
            dispatchSwtShowMessage,
            handleSetSearched,
            setKeyword,
            restartPage
        }

    })

    describe('Rendering test', () => {
        
        it('Rendering searchClient component with Redux', () => {
            itRenders(<searchClientRedux store={store}/>)
        })

        it('Rendering searchClient component', () => {
            itRenders(<searchClient {...defaultProps}/>)
        })

    })

    describe('test functions of searchClient component', () => {
        
        

    })
    

})