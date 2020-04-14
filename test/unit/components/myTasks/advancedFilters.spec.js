import React from 'react';
import Immutable from 'immutable';
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import {REQUEST_SUCCESS} from "../../../../src/constantsGlobal";
import AdvancedFiltersRedux, {AdvancedFilters} from "../../../../src/components/myTasks/AdvancedFilters";

const region = [
    {
        "id": 1,
        "field": "region",
        "value": "Antioquia",
        "parentId": null,
        "key": "Antioquia",
        "description": ""
    },
    {
        "id": 1,
        "field": "region",
        "value": "Cundinamarca",
        "parentId": null,
        "key": "Cundinamarca",
        "description": ""
    },
    {
        "id": 1,
        "field": "region",
        "value": "Caribe",
        "parentId": null,
        "key": "Caribe",
        "description": ""
    }];

let consultListWithParameterUbicationDispatch;
let consultListWithParameterDispatch;
let getRegionsByEmployeeDispatch;
let dispatchGetMasterDataFields;
let dispatchAdvancedFilters;
let dispatchFilters;
let defaultFilters = {initialDate: '20/12/2020'};
let values = {
    closingDateTo: '20/12/2020',
    closingDateFrom: '20/12/2020',
    region: 222,
    zone: 22,
    cell: 33
};
let defaultProps = {};
let selectsReducer;
let setFieldValue;
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test AdvancedFilters', () => {
    beforeEach(() => {
        consultListWithParameterUbicationDispatch = sinon.stub();
        consultListWithParameterDispatch = sinon.stub();
        getRegionsByEmployeeDispatch = sinon.stub();
        dispatchGetMasterDataFields = sinon.stub();
        dispatchAdvancedFilters = sinon.stub();
        setFieldValue = sinon.stub();
        dispatchFilters = sinon.stub();
        dispatchGetMasterDataFields.resolves({
            masterDataDetailEntries: region
        });
        consultListWithParameterUbicationDispatch.resolves({
            payload: {
                data: {
                    status: REQUEST_SUCCESS,
                    data: []
                }
            }
        });
        consultListWithParameterDispatch.resolves({
            payload: {
                data: {
                    status: REQUEST_SUCCESS,
                    data: []
                }
            }
        });
        getRegionsByEmployeeDispatch.resolves({
            payload: {
                data: {
                    status: REQUEST_SUCCESS,
                    data: []
                }
            }
        });
        defaultProps = {
            myTasks: Immutable.Map({
                initialFilters: {
                    users: [120],
                    rol: ['RESPONSIBLE'],
                    initialDate: '10/12/2020',
                    finalDate: '10/12/2018',
                    closingDateTo: '10/12/2020',
                    closingDateFrom: '10/12/2018',
                    region: 12,
                    zone: 11,
                    cell: 1
                }
            }),
            selectsReducer,
            consultListWithParameterUbicationDispatch,
            consultListWithParameterDispatch,
            getRegionsByEmployeeDispatch,
            dispatchGetMasterDataFields,
            defaultFilters,
            setFieldValue,
            values,
            dispatchFilters
        };
        store = mockStore({
            defaultProps
        });
    });

    describe('Rendering unit test', () => {
        it('Should render AdvancedFilters', () => {
            itRenders(<AdvancedFilters {...defaultProps}/>);
        });

        it('onChangeClosingDateTo', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeClosingDateTo(120);
            sinon.assert.calledThrice(setFieldValue);
        });

        it('onChangeClosingDateTo value empty', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeClosingDateTo('');
            sinon.assert.calledThrice(setFieldValue);
        });

        it('onChangeClosingDateFrom', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeClosingDateFrom(120);
            sinon.assert.calledThrice(setFieldValue);
        });

        it('onChangeClosingDateFrom value empty', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeClosingDateFrom('');
            sinon.assert.calledThrice(setFieldValue);
        });

        it('onChangeRegionStatus', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeRegionStatus(120);
            sinon.assert.calledThrice(setFieldValue);
        });

        it('onChangeRegionStatus value empty', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeRegionStatus('');
            sinon.assert.notCalled(setFieldValue);
        });

        it('onChangeZoneStatus', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeZoneStatus(120);
            sinon.assert.calledTwice(setFieldValue);
        });

        it('onChangeZoneStatus value empty', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeZoneStatus('');
            sinon.assert.notCalled(setFieldValue);
        });

        it('onChangeCell', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().onChangeCell(120);
            sinon.assert.calledOnce(setFieldValue);
        });

        it('clearForm', async () => {
            const wrapper = shallow(<AdvancedFilters {...defaultProps}/>);
            await wrapper.instance().clearForm();
            sinon.assert.called(setFieldValue);
        });
    });

    describe('Redux Component test', () => {
        it('should render react component', () => {
            itRenders(<AdvancedFiltersRedux store={store}/>);
        })
    });
});