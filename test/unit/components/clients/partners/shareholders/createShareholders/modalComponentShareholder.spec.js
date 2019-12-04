import React from 'react'
import Immutable from 'immutable';
import {ModalComponentShareholder}
    from "../../../../../../../src/components/clients/partners/shareholder/createShareholder/modalComponentShareholder";
import {createFieldsFromArray} from "../../../../../../helpers/ReduxFormField";

import * as actions from '../../../../../../../src/components/globalComponents/actions';

const selectsReducer = Immutable.Map({});
describe('Test ModalComponentShareholder', ()=>{

    let fields = createFieldsFromArray(["tipoDocumento"]);
    let defaultProps;
    let nonValidateEnter;
    let clearValuesAdressess;
    let resetForm;
    let getMasterDataFields;
    let consultDataSelect;
    let handleSubmit;
    let createShareholder;
    let changeStateSaveData;
    let stubRedirect;

    beforeEach(() => {

        nonValidateEnter = sinon.fake();
        clearValuesAdressess = sinon.fake();
        resetForm = sinon.fake();
        getMasterDataFields = sinon.fake();
        consultDataSelect = sinon.fake();
        handleSubmit = sinon.fake();
        changeStateSaveData = sinon.fake();
        createShareholder = sinon.stub();
        stubRedirect = sinon.stub(actions, "redirectUrl");


        const success = { payload:{ data:{status:500,validateLogin:true,data:"msj"}}};
        createShareholder.resolves(success);

        defaultProps = {
            fields: fields,
            nonValidateEnter,
            clearValuesAdressess,
            resetForm,
            getMasterDataFields,
            consultDataSelect,
            selectsReducer,
            handleSubmit,
            createShareholder,
            changeStateSaveData
        };
    });

    afterEach(() => {
        stubRedirect.restore();
    });

    it('Should render ModalComponentShareholder', ()=>{

        itRenders(<ModalComponentShareholder {...defaultProps}/>);
    });

    it('should save shareholder', ()=>{
        let newFields = createFieldsFromArray(["tipoDocumento",
        "numeroDocumento",
        "tipoPersona",
        "razonSocial",
        "porcentajePart",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "genero",
        "tipoAccionista",
        "pais",
        "departamento",
        "ciudad",
        "direccion",
        "paisResidencia",
        "numeroIdTributaria",
        "observaciones"]);



        newFields["tipoDocumento"].onChange("shareHolderIdType");
        newFields["numeroDocumento"].onChange("shareHolderIdNumber");
        newFields["tipoPersona"].onChange("shareHolderType");
        newFields["razonSocial"].onChange("shareHolderName");
        newFields["porcentajePart"].onChange("100");
        newFields["primerNombre"].onChange("primerNombre");
        newFields["segundoNombre"].onChange("segundoNombre");
        newFields["primerApellido"].onChange("primerApellido");
        newFields["segundoApellido"].onChange("segundoApellido");
        newFields["genero"].onChange("genero");
        newFields["tipoAccionista"].onChange("tipoAccionista");
        newFields["pais"].onChange("pais");
        newFields["departamento"].onChange("departamento");
        newFields["ciudad"].onChange("ciudad");
        newFields["direccion"].onChange("direccion");
        newFields["paisResidencia"].onChange("paisResidencia");
        newFields["numeroIdTributaria"].onChange("numeroIdTributaria");
        newFields["observaciones"].onChange("observaciones");
        const wrapper = shallow(
            <ModalComponentShareholder {...defaultProps} fields={newFields}/>
        );

        wrapper.instance()._handleCreateShareholder();
        expect(createShareholder.called).to.equal(true);
    });
});