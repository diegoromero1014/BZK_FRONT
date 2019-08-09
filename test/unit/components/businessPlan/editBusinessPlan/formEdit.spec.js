import React from 'react';
import Immutable from 'immutable';

import PermissionUserReports from "~/src/components/commercialReport/permissionsUserReports";
import DateTimePickerUi from "~/src/ui/dateTimePicker/dateTimePickerComponent";
import ComboBox from "~/src/ui/comboBox/comboBoxComponent";
import RichText from "~/src/components/richText/richTextComponent";
import NeedBusiness from "~/src/components/businessPlan/need/needBusiness";
import AreaBusiness from "~/src/components/businessPlan/area/areaBusiness";
import {FormEdit} from "~/src/components/businessPlan/editBusinessPlan/formEdit.js";

const fields = ["initialValidityDate", "finalValidityDate", "objectiveBusiness", "opportunities"];
const selectsReducer = Immutable.Map({});
const businessPlanReducer = Immutable.Map({});
const reducerGlobal = Immutable.Map({});
const clientInformacion = Immutable.Map({ 'responseClientInfo': { 'key': 'value' } });

const getMasterDataFields = () => { };
const nonValidateEnter = () => { };
const setConfidential = () => { };
const handleSubmit = () => { };
const showLoading = () => { };

const dataPromise = {payload: { data: { status: 200, validateLogin: true, data: {
                            objective: "", opportunitiesAndThreats: "", initialValidityDate: "", initialValidityDate: "",
                            finalValidityDate: "", clientNeedFulfillmentPlan: "", relatedInternalParties: "",
                            commercialReport: { isConfidential: "", usersWithPermission: "" }
                    } } }};
const resolveData = () => {
    return new Promise(
        (resolve, reject) => resolve(dataPromise)
    )
}

const defaultProps = { fields: fields, selectsReducer, handleSubmit, businessPlanReducer, reducerGlobal, nonValidateEnter,
                        setConfidential, clientInformacion, getMasterDataFields, showLoading };

describe('Test BusinessPlan/editBusinessPlan/formEdit', () => {

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
});