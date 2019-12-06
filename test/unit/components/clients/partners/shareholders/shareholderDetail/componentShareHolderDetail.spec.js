import React from 'react'
import Immutable from 'immutable';

import {createFieldsFromArray} from "../../../../../../helpers/ReduxFormField";

import * as actions from '../../../../../../../src/components/globalComponents/actions';
import {ComponentShareHolderDetail}
    from "../../../../../../../src/components/clients/partners/shareholder/shareholderDetail/componentShareHolderDetail";
import {ModalComponentShareholder} from "../../../../../../../src/components/clients/partners/shareholder/createShareholder/modalComponentShareholder";

const selectsReducer = Immutable.Map({});
const editShareholderReducer = Immutable.Map({shareHolderEdit: {}});
const reducerGlobal = Immutable.Map({});
describe("Test componentShareHolderDetail", ()=>{

    let fields = createFieldsFromArray(["shareHolderType","shareHolderIdType","shareHolderIdNumber","shareholderIdType"]);
    let defaultProps;
    let showLoading;
    let nonValidateEnter;
    let resetForm;
    let getMasterDataFields;
    let consultDataSelect;
    let getDetailShareHolder;
    let handleSubmit;
    let stubRedirect;
    let createdBy;
    let changeStateSaveData;
    let createShareholder;




    beforeEach(()=>{
        showLoading = sinon.fake();
        nonValidateEnter = sinon.fake();
        resetForm = sinon.fake();
        getMasterDataFields = sinon.fake();
        consultDataSelect = sinon.fake();
        handleSubmit = sinon.fake();
        createdBy = sinon.fake();
        changeStateSaveData = sinon.fake();
        getDetailShareHolder = sinon.stub();
        createShareholder = sinon.stub();
        getDetailShareHolder.resolves("");
        stubRedirect = sinon.stub(actions, "redirectUrl");

        const success = { payload:{ data:{status:500,validateLogin:true,data:"msj"}}};
        createShareholder.resolves(success);

        defaultProps={
            fields: fields,
            showLoading,
            nonValidateEnter,
            resetForm,
            getMasterDataFields,
            consultDataSelect,
            getDetailShareHolder,
            editShareholderReducer,
            handleSubmit,
            createdBy,
            selectsReducer,
            reducerGlobal,
            createShareholder,
            changeStateSaveData
        };
    });

    afterEach(() => {
        stubRedirect.restore();
    });


    it('Should render ModalComponentShareholder', ()=>{

        itRenders(<ComponentShareHolderDetail {...defaultProps}/>);
    });

    it('Should save sharedHolderEdit', ()=>{

        let newFields = createFieldsFromArray([
            "shareHolderType",
            "clientId",
            "shareHolderIdType",
            "shareHolderIdNumber",
            "shareholderIdType",
            "shareHolderName",
            "sharePercentage",
            "firstName",
            "middleName",
            "firstLastName",
            "secondLastName",
            "genderId",
            "shareHolderKindId",
            "countryId",
            "provinceId",
            "cityId",
            "address",
            "fiscalCountryId",
            "tributaryNumber",
            "comment"

        ]);


        const wrapper = shallow(
            <ComponentShareHolderDetail {...defaultProps} fields={newFields}/>
        );

        wrapper.instance()._submitEditShareHolderDetail();
        expect(createShareholder.called).to.equal(true);
    })
});