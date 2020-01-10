import React from 'react'
import Immutable from 'immutable';
import {Sheduler} from "../../../../src/components/sheduler/shedulerComponent";
import {createFieldsFromArray} from "../../../helpers/ReduxFormField";

const schedulerPrevisitReduser = Immutable.Map({});
const navBar = Immutable.Map({});
const selectsReducer = Immutable.Map({});
const contactsByClient = Immutable.Map({});
describe('Test shedulerComponent', () => {

    let fields = createFieldsFromArray(["team", "region", "zone", "nameUsuario","idUsuario"]);
    let defaultProps;
    let getRegionsByEmployeeDispatch;
    let clearListsDispatch;
    let stubLocalStorage;
    let updateTitleNavBarDispatch;
    let showLoadingDispatch;
    let validatePermissionsByModuleDispatch;
    let consultInfoClientDispatch;
    let showBrandConfidentialDispatch;
    let getSchedulerPrevisitsDispatch;
    let consultListWithParameterUbicationDispatch;
    let resetForm;
    let clearFilterDispatch;
    let consultListWithParameterDispatch;

    beforeEach(() => {

        clearListsDispatch = sinon.fake();
        updateTitleNavBarDispatch = sinon.fake();
        showLoadingDispatch = sinon.fake();
        consultListWithParameterUbicationDispatch = sinon.fake();
        showBrandConfidentialDispatch = sinon.fake();
        getSchedulerPrevisitsDispatch = sinon.fake();
        resetForm = sinon.fake();
        clearFilterDispatch = sinon.fake();
        consultListWithParameterDispatch = sinon.fake();
        validatePermissionsByModuleDispatch = sinon.stub();
        validatePermissionsByModuleDispatch.resolves("");
        getRegionsByEmployeeDispatch = sinon.stub();
        getRegionsByEmployeeDispatch.resolves("");
        consultInfoClientDispatch = sinon.stub();
        consultInfoClientDispatch.resolves("");

        defaultProps = {
            fields: fields,
            schedulerPrevisitReduser,
            clearListsDispatch,
            getRegionsByEmployeeDispatch,
            updateTitleNavBarDispatch,
            navBar,
            selectsReducer,
            showLoadingDispatch,
            consultListWithParameterUbicationDispatch,
            validatePermissionsByModuleDispatch,
            consultInfoClientDispatch,
            showBrandConfidentialDispatch,
            getSchedulerPrevisitsDispatch,
            resetForm,
            clearFilterDispatch,
            consultListWithParameterDispatch,
            contactsByClient
        };
    });

    afterEach(()=> {
        // runs after each test in this block
        stubLocalStorage.restore();
    });

    it('should render shedulerComponent', () => {
        stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("dj");
        itRenders(<Sheduler {...defaultProps}/>)
    });

    it('should open modal', ()=>{
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance().openModal();
        expect(showLoadingDispatch.called).to.equal(true);
        expect(validatePermissionsByModuleDispatch.called).to.equal(true);
        expect(consultInfoClientDispatch.called).to.equal(true);
    });

    it('should _handlePrevisitsFind', ()=>{
        let newFields = createFieldsFromArray(["team", "region", "zone", "idUsuario","nameUsuario"]);


        const wrapper = shallow(
            <Sheduler {...defaultProps} fields={newFields}/>
        );

        wrapper.instance()._handlePrevisitsFind();
        expect(showLoadingDispatch.called).to.equal(true);
        expect(getSchedulerPrevisitsDispatch.called).to.equal(true);
    });

    it('should close modal', ()=>{
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance().closeModal();
        expect(showBrandConfidentialDispatch.called).to.equal(true);
    });

    it('should _onChangeRegionStatus', ()=>{
        let val = "";
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance()._onChangeRegionStatus(val);
        expect(clearListsDispatch.called).to.equal(true);
    });

    it('should _onChangeRegionStatus val is not empty', ()=>{
        let val = 1;
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance()._onChangeRegionStatus(val);
        expect(clearListsDispatch.called).to.equal(true);
        expect(consultListWithParameterUbicationDispatch.called).to.equal(true);
    });

    it('should _cleanSearch', ()=>{
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance()._cleanSearch();
        expect(showLoadingDispatch.called).to.equal(true);
        expect(resetForm.called). to.equal(true);
        expect(clearFilterDispatch.called).to.equal(true);
        expect(clearListsDispatch.called).to.equal(true);

    });

    it('should _onChangeZoneStatus', ()=>{
        let val = 1;
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance()._onChangeZoneStatus(val);
        expect(clearListsDispatch.called).to.equal(true);
        expect(consultListWithParameterDispatch.called).to.equal(true);
    });

    it('should _onChangeZoneStatus when val is empty', ()=>{
        let val = "";
        const wrapper = shallow(
            <Sheduler {...defaultProps} />
        );

        wrapper.instance()._onChangeZoneStatus(val);
        expect(clearListsDispatch.called).to.equal(true);

    });

    it('Test when regions is not null', ()=>{
        const success = { payload:{ data:{data:"msj"}}};
        getRegionsByEmployeeDispatch.resolves(success);

        const wrapper = shallow(
            <Sheduler {...defaultProps} getRegionsByEmployeeDispatch={getRegionsByEmployeeDispatch}/>
        );
    });

    it('Test when regions is not null', ()=>{
        const success = { payload:{ data:{data:""}}};
        getRegionsByEmployeeDispatch.resolves(success);

        const wrapper = shallow(
            <Sheduler {...defaultProps} getRegionsByEmployeeDispatch={getRegionsByEmployeeDispatch}/>
        );
    });

});