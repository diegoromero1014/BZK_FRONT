import React from 'react';
import SectionSearchClientRedux from '../../../../../../src/components/managementView/widgets/searchClient';
import { SectionSearchClient } from '../../../../../../src/components/managementView/widgets/searchClient';
import * as globalActions from '../../../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps;
let dispatchClearClients;
let dispatchClientsFindServer;
let dispatchSwtShowMessage;
let dispatchChangeActiveItemMenu; 
let redirectUrl;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test for SectionSearchClient Component', () => {

    beforeEach(() => {
        store = mockStore({
            clientR: Immutable.Map({
                responseClients: [],
                countClients: 0
            })
        });
        dispatchClearClients = sinon.fake();
        dispatchClientsFindServer = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        dispatchChangeActiveItemMenu = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            data: [],
            rowCount: 0,

            dispatchClearClients,
            dispatchClientsFindServer,
            dispatchSwtShowMessage,
            dispatchChangeActiveItemMenu
        }
    });


    afterEach(() => {
        redirectUrl.restore();
    })


    it('Test rendering SectionSearchClient with Redux', () => {
        itRenders(<SectionSearchClientRedux store={store} />)
    })

    it('Test rendering SectionSearchClient component', () => {
        itRenders(<SectionSearchClient {...defaultProps} />);
    })

    describe('Test functions of SectionSearchClient component', () => {

        it('Test function setKeyword', () => {
            let keyword = "busqueda"
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.setState({
                keyword: "",
                page: 1,
                searched: false
            })
            wrapper.instance().setKeyword(keyword);
            expect(wrapper.state().keyword).to.equal("busqueda");
        })

        it('Test function currentPage', () => {
            let page = 1;
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.instance().currentPage(page);
            expect(wrapper.state().page).to.equal(1);
        })

        it('Test function currentPage', () => {
            let page = 1;
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.instance().currentPage(page);
            expect(wrapper.state().page).to.equal(1);
        })

        it('Test function handelClickClient', () => {
            let element = {
                id: 584946,
                access: false
            }
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.instance().handelClickClient(element)
            expect(wrapper.length).to.equal(1);
        })


        it('Test function handelClickClient', () => {
            let element = {
                id: 584946,
                access: true
            }
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.instance().handelClickClient(element)
            expect(redirectUrl.calledOnce).to.equal(true);
        })

        it('Test function restartPage', () => {
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.setState({
                keyword: "",
                page: 10,
                searched: false
            })
            wrapper.instance().restartPage();
            expect(wrapper.state().page).to.equal(1);

        });

        it('Test function handleSetSearched ', () => {
            let searched = true;
            const wrapper = shallow(<SectionSearchClient {...defaultProps} />);
            wrapper.setState({
                keyword: "",
                page: 10,
                searched: false
            })
            wrapper.instance().handleSetSearched(searched);
            expect(wrapper.state().searched).to.equal(true);
        })
    })
})