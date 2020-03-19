import React from 'react';
import ModalContentComponentRedux, { ModalContentComponent } from '../../../../src/components/opportunitiesWeaknesses/ModalContentComponent';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let dispatchCleanList;
let dispatchAddToList;
let dispatchCreateList;
let dispatchLinkedRecords;
let dispatchResetRecords;
let dispatchSwtShowMessage;
let handleCloseModal;

let defaultprops = {};
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;


describe('ModalContentComponent Test', () => {

    beforeEach(() => {
        dispatchCleanList = sinon.fake();
        dispatchAddToList = sinon.fake();
        dispatchCreateList = sinon.fake();
        dispatchLinkedRecords = sinon.fake();
        dispatchResetRecords = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        handleCloseModal = sinon.fake();

        defaultprops = {
            dispatchCleanList,
            dispatchAddToList,
            dispatchCreateList,
            dispatchLinkedRecords,
            dispatchResetRecords,
            dispatchSwtShowMessage,
            handleCloseModal,
            elementsReducer: {},
            element: {
                elements: [
                    {
                        id: 1,
                        text: 'text'
                    }
                ]
            }
        }
        store = mockStore(defaultprops);
    })

    describe("rendering unit test", () => {

        it("render component", () => {
            itRenders(<ModalContentComponentRedux store={store}/>)
        })

        it("render component class", () => {
            itRenders(<ModalContentComponent {...defaultprops}/>)
        })

    })

    describe("test functions", () => {

        it("test  handelBackup", () => {
            const wrapper = shallow(<ModalContentComponent {...defaultprops} />);
            wrapper.instance().handleBackup();
            expect(wrapper.state().elements).to.length(1);
        })

        it("test handleOnClick ", () => {
            const wrapper = shallow(<ModalContentComponent {...defaultprops}/>);
            wrapper.instance().handleOnClick();
            expect(dispatchSwtShowMessage.calledOnce).to.equal(true);

        })
    })

    it("test handleOnSave " , () => {
        const wrapper = shallow(<ModalContentComponent {...defaultprops}/>);
        wrapper.instance().handleOnSave();
        expect(dispatchLinkedRecords.calledOnce).to.equal(true);
    })
    
})  