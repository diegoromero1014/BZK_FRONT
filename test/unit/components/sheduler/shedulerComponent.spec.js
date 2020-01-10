import React from 'react'
import Sheduler from "../../../../src/components/sheduler/shedulerComponent";
import {createFieldsFromArray} from "../../../helpers/ReduxFormField";


describe('Test shedulerComponent', () => {

    let fields = createFieldsFromArray(["team", "region", "zone", "nameUsuario"]);
    let defaultProps;
    let getRegionsByEmployeeDispatch;
    let clearListsDispatch;
    let updateTitleNavBarDispatch;
    let validatePermissionsByModuleDispatch;

    beforeEach(() => {


        clearListsDispatch = sinon.fake();
        updateTitleNavBarDispatch = sinon.fake();
        getRegionsByEmployeeDispatch = sinon.stub();
        getRegionsByEmployeeDispatch.resolves("");

        validatePermissionsByModuleDispatch = sinon.stub();
        validatePermissionsByModuleDispatch.resolves("");

        defaultProps = {
            fields: fields,
            clearListsDispatch,
            getRegionsByEmployeeDispatch,
            updateTitleNavBarDispatch,
            validatePermissionsByModuleDispatch
        };
    });


    it('should render shedulerComponent', () => {
        itRenders(<Sheduler {...defaultProps}/>)
    });


});