import React from 'react';
import {SelectOpportunitiesWeaknesses} from '../../../../src/components/opportunitiesWeaknesses/SelectOpportunitiesWeaknesses';
import { shallow } from 'enzyme';
import Immutable from 'immutable';

let dispatchAddToList;
let dispatchResetRecords;
let dispatchLinkedRecords;
let dispatchSwtShowMessage;
let handleCloseModal;
let handleCancel;
let handleOnReset;
let handleOnSelect;
let defaultProps = {};
let elementsReducer; 
let weaknesses;
let opportunities;
let linkedOpportunities;
let linkedWeaknesses

describe("test selectOpportunitiesWeaknesses ", () => {

    beforeEach(() => {
        dispatchAddToList = sinon.fake();
        dispatchResetRecords = sinon.fake();
        dispatchLinkedRecords = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();

        handleOnSelect = sinon.fake();
        handleCancel = sinon.fake();
        handleOnReset = sinon.fake();
        handleOnSelect = sinon.fake();

        defaultProps = {
            open: false,
            name: '',
            singularTitle: '',
            title: '',
            placeholder: '',
            elements: null,

            handleCancel,
            handleCloseModal,
            handleOnReset,
            handleOnSelect,
            dispatchAddToList,
            dispatchResetRecords,
            dispatchLinkedRecords,
            dispatchSwtShowMessage,

            elementsReducer: Immutable.Map({opportunities: { elements: [] , linkedRecords: [] , open : false} , weaknesses : { elements : [], linkedRecords : [] , open : false }}),
            weaknesses : elementsReducer[weaknesses].elements ,
            opportunities : elementsReducer[opportunities].elements,
            linkedOpportunities : elementsReducer[opportunities].linkedRecords,
            linkedWeaknesses : elementsReducer[weaknesses].linkedRecords

        }
    })
})