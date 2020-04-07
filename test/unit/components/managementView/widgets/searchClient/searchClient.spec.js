import React from 'react';
import SearchClientRedux from '../../../../../../src/components/managementView/widgets/searchClient/searchClient';
import { SearchClient } from '../../../../../../src/components/managementView/widgets/searchClient/searchClient';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';


let dispatchClientsFindServer ;
let dispatchSwtShowMessage ; 
let handleSetSearched ;
let handleSearchClient ;
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
        handleSearchClient = spy(sinon.fake());
        setKeyword = sinon.fake();
        restartPage = sinon.fake();

        defaultProps = {
            dispatchClientsFindServer,
            dispatchSwtShowMessage,
            handleSetSearched,
            handleSearchClient,
            setKeyword,
            restartPage
        }

    })

    describe('Rendering test', () => {
        
        it('Rendering searchClient component with Redux', () => {
            itRenders(<SearchClientRedux store={store}/>)
        })

        it('Rendering searchClient component', () => {
            itRenders(<SearchClient {...defaultProps}/>)
        })

    })

    describe('test functions of searchClient component', () => {
        
        it('Test handleInput function', () => {
            let evento = {
                target : {
                    name : "keyword",
                    value : "busqueda"
                }
            }
            const wrapper = shallow(<SearchClient {...defaultProps}/>);
            wrapper.setState({
                keyword: "",
                closeIcon : false
            })
            wrapper.instance().handleInput(evento);
            expect(wrapper.state().keyword).to.equal("busqueda"); 
        }); 

        it('Test handleKeyword function', () => {
            let event = {
                keyCode : 13,
                which : 13
            }
            const wrapper = shallow(<SearchClient {...defaultProps}/>);
            wrapper.instance().handleKeyword(event)
            expect(handleSearchClient).to.been.called;

        })

        it('Test handleSearchClient function (with false)', () => {
            const wrapper = shallow(<SearchClient {...defaultProps}/>);
            wrapper.setState({
                keyword: "",
                closeIcon : false
            })
            wrapper.instance().handleSearchClient();
            sinon.assert.calledOnce(dispatchSwtShowMessage);
        })

        it('Test handleCloseButton function', () => {
            const wrapper = shallow(<SearchClient {...defaultProps}/>);
            wrapper.setState({
                keyword: "Busqueda",
                closeIcon : true
            })
            wrapper.instance().handleCloseButton ();
            expect(wrapper.state().closeIcon).to.equal(false);
            expect(wrapper.state().keyword).to.equal("");
        })

    })
    
})