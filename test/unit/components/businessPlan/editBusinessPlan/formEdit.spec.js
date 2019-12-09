import React from 'react';
import Immutable from 'immutable';

import PermissionUserReports from "~/src/components/commercialReport/permissionsUserReports";
import DateTimePickerUi from "~/src/ui/dateTimePicker/dateTimePickerComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import RichText from "~/src/components/richText/richTextComponent";
import NeedBusiness from "~/src/components/businessPlan/need/needBusiness";
import AreaBusiness from "~/src/components/businessPlan/area/areaBusiness";
import {FormEdit} from "~/src/components/businessPlan/editBusinessPlan/formEdit.js";

const fields = {    "initialValidityDate": {
                        onChange: () => { },
                        value: '1567659600000'
                    }, "finalValidityDate": {
                        onChange: () => { },
                        value: '1567832400000'
                    },
                    "objectiveBusiness":"", "opportunities":""};
const selectsReducer = Immutable.Map({});
const businessPlanReducer = Immutable.Map({"detailBusiness": {data: { "id": 1}}});
const reducerGlobal = Immutable.Map({});
const clientInformacion = Immutable.Map({ 'responseClientInfo': { 'key': 'value' } });

const getMasterDataFields = () => { };
const nonValidateEnter = () => { };
const setConfidential = () => { };
const handleSubmit = () => { };
const showLoading = () => { };
const swtShowMessage = () => {};
const changeStateSaveData = () => {};

const dataPromise = {payload: { data: { status: 200, validateLogin: true, data: {
                            objective: "", opportunitiesAndThreats: "", data: {initialValidityDate: {
                                value: '1567659600000'
                            }, finalValidityDate: {
                                value: '1567832400000'
                            }},
                            clientNeedFulfillmentPlan: "", relatedInternalParties: "",
                            commercialReport: { isConfidential: "", usersWithPermission: "" }
                    } } }};
const resolveData = () => {
    return new Promise(
        (resolve, reject) => resolve(dataPromise)
    )
}


describe('Test BusinessPlan/editBusinessPlan/formEdit', () => {
    let pdfDescarga;
    let defaultProps;
    let dispatchChangeStateSaveData;
    beforeEach(() =>{
        pdfDescarga = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        let id =1;
        defaultProps = { fields: fields, selectsReducer, handleSubmit, businessPlanReducer, reducerGlobal, nonValidateEnter,
                        setConfidential, clientInformacion, getMasterDataFields, showLoading, swtShowMessage, changeStateSaveData, detailBusiness: resolveData, pdfDescarga, dispatchChangeStateSaveData, id };

    })
    it('should render PermissionUserReports', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(PermissionUserReports)).to.have.length(1);
    });

    it('should render DateTimePickerUi', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(DateTimePickerUi)).to.have.length(2);
    });

    it('should render ComboBox', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(ComboBox)).to.have.length(1);
    });

    it('should render RichText', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(RichText)).to.have.length(1);
    });

    it('should render NeedBusiness', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(NeedBusiness)).to.have.length(1);
    });

    it('should render AreaBusiness', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(AreaBusiness)).to.have.length(1);
    });

    it('should not edit form', () => {
        const wrapper = shallow(<FormEdit {...defaultProps} createBusiness={resolveData} detailBusiness={resolveData} />);
        expect(wrapper.find(PermissionUserReports).find({disabled: 'disabled'})).to.have.length(1);
        expect(wrapper.state().isEditable).equal(false);
    });

    it('should edit form when editButton was clicked', () => {
        const reducerGlobalWithBussinessPlanPermissions = Immutable.Map({ permissionsBussinessPlan: ["Editar"] });
        const wrapper = shallow(<FormEdit {...defaultProps} reducerGlobal={reducerGlobalWithBussinessPlanPermissions} createBusiness={resolveData} detailBusiness={resolveData} />);
        
        const editButton = wrapper.find('.modal-button-edit');
        editButton.simulate('click');

        expect(wrapper.find(PermissionUserReports).find({disabled: ''})).to.have.length(1);
        expect(wrapper.state().isEditable).equal(true);
    });

    it('should be ok when initialValidityDate is smaller or equals to finalValidityDate', () => {
        const reducerGlobalWithBussinessPlanPermissions = Immutable.Map({ permissionsBussinessPlan: ["Editar"] });
        const wrapper = shallow(<FormEdit {...defaultProps} reducerGlobal={reducerGlobalWithBussinessPlanPermissions}
                                createBusiness={resolveData} detailBusiness={resolveData}
                                initialValidityDate= "08/08/2019" finalValidityDate="09/08/2019" validateRangeDates={resolveData} />);

        wrapper.instance()._onSelectFieldDate("08/08/2019", "09/08/2019", "09/08/2019", true);
        expect(wrapper.state().initialDateError).equal(false);
    });

    it('should be ok when finalValidityDate is smaller or equals to initialValidityDate', () => {
        const reducerGlobalWithBussinessPlanPermissions = Immutable.Map({ permissionsBussinessPlan: ["Editar"] });
        defaultProps.fields['initialValidityDate']["value"] = 1567832400000;
        defaultProps.fields['finalValidityDate']["value"] = 1567659600000;
        const wrapper = shallow(<FormEdit {...defaultProps} reducerGlobal={reducerGlobalWithBussinessPlanPermissions}
                                createBusiness={resolveData} detailBusiness={resolveData} validateRangeDates={resolveData}
                                />);

        wrapper.instance()._onSelectFieldDate("10/08/2019", "09/08/2019", defaultProps.fields['initialValidityDate'], false);
        expect(wrapper.state().finalDateError).equal(false);
    });

    it("should call onClickPDF", () => {
            const wrapper = shallow(<FormEdit {...defaultProps} />);
            wrapper.instance()._onClickPDF()
            expect(pdfDescarga.callCount).to.equals(1);
    });

});