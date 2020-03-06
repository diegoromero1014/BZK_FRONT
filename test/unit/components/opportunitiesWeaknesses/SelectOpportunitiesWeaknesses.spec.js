import React from 'react';
import SelectOpportunitiesWeaknessesRedux, {SelectOpportunitiesWeaknesses} from '../../../../src/components/opportunitiesWeaknesses/SelectOpportunitiesWeaknesses';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { OPPORTUNITIES, SINGULAR_TITLE_OPPORTUNITIES } from '../../../../src/components/opportunitiesWeaknesses/constants';

let dispatchAddToList;
let dispatchResetRecords;
let dispatchLinkedRecords;
let dispatchSwtShowMessage;
let defaultProps = {};

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe("test selectOpportunitiesWeaknesses ", () => {

    beforeEach(() => {
        dispatchAddToList = sinon.fake();
        dispatchResetRecords = sinon.fake();
        dispatchLinkedRecords = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();


        defaultProps = {
            dispatchAddToList,
            dispatchResetRecords,
            dispatchLinkedRecords,
            dispatchSwtShowMessage,
        
            elementsReducer : {
                opportunities : {
                    elements : [],
                    linkedRecords : [],
                    open : false
                },
                weaknesses : {
                    elements : [],
                    linkedRecords : [],
                    open : false
                }
            },
            opportunities : [],
            weaknesses : [],
        }
        store = mockStore(defaultProps);
    })

    describe("renderin unit tests", () => {

        it("render component connect with redux", () => {
            itRenders(<SelectOpportunitiesWeaknessesRedux store={store}/>)
        })

        it("render component SelectOpportunitiesWeaknesses", () => {
            itRenders(<SelectOpportunitiesWeaknesses {...defaultProps}/>)
        })

    })

    describe("unit test functions", () => {

        it("test handleCloseModal", () => {
            const wrapper = shallow(<SelectOpportunitiesWeaknesses {...defaultProps}/>);
            wrapper.state({
                open : true,
                elements: [],
            })
            wrapper.instance().handleCloseModal();
            expect(wrapper.state().open).to.equal(false);
            expect(wrapper.state().elements).to.equal(null);
        })

        it("test handelCancel", () => {
            const wrapper = shallow(<SelectOpportunitiesWeaknesses {...defaultProps}/>);
            wrapper.state({
                open : true,
                elements: [],
            })
            wrapper.instance().handleCancel();
            expect(wrapper.state().open).to.equal(false);
            expect(wrapper.state().elements).to.equal(null);
        })

        it("test handleOnReset", () => {
            const wrapper = shallow(<SelectOpportunitiesWeaknesses {...defaultProps}/>);
            wrapper.instance().handleOnReset();
            expect(dispatchResetRecords.calledOnce).to.equal(true);
            expect(dispatchLinkedRecords.calledOnce).to.equal(true)
        })

        it("test handleOnSelect", () => {
            const wrapper = shallow(<SelectOpportunitiesWeaknesses {...defaultProps}/>);
            const name = OPPORTUNITIES;
            const singularTitle = SINGULAR_TITLE_OPPORTUNITIES;
            const element = "Oportunidad 1";
            const associated = false;
            wrapper.instance().handleOnSelect({name, element, associated, singularTitle});
            expect(dispatchSwtShowMessage.calledOnce).to.equal(true);
        })

        it("test handleOnSelect", () => {
            defaultProps = {
                dispatchAddToList,
                dispatchResetRecords,
                dispatchLinkedRecords,
                dispatchSwtShowMessage,

                opportunities : [],
                weaknesses : [],

            }
            const name = OPPORTUNITIES;
            const singularTitle = SINGULAR_TITLE_OPPORTUNITIES;
            const element = "Oportunidad 1";
            const associated = true;
            const wrapper = shallow(<SelectOpportunitiesWeaknesses {...defaultProps}/>);
            wrapper.instance().handleOnSelect(name , element, associated, singularTitle);
            expect(dispatchAddToList.calledOnce).to.equal(true);
            expect(dispatchLinkedRecords.calledOnce).to.equal(true);
        })
    })
})