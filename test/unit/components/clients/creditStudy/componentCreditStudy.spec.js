import React from 'react';
import Immutable from 'immutable';
import sinon from 'sinon';

import { ComponentStudyCredit } from "~/src/components/clients/creditStudy/componentCreditStudy";
import ReduxFormField, {createFieldsFromArray} from "~/test/helpers/ReduxFormField.js";
import * as globalActions from '~/src/components/globalComponents/actions';

const fields = createFieldsFromArray(["customerTypology", "contextClientField", "inventoryPolicy", "participationLB", "participationDC", "participationMC",
"contextLineBusiness", "experience", "distributionChannel", "nameMainClient", "tbermMainClient", "relevantInformationMainClient",
"nameMainCompetitor", "participationMComp", "obsevationsCompetitor", "termMainClient", "typeOperationIntOpera", "participationIntOpe",
"idCountryIntOpe", "participationIntOpeCountry", "customerCoverageIntOpe", "descriptionCoverageIntOpe", "nameMainSupplier",
"participationMS", "termMainSupplier", "relevantInformationMainSupplier", "notApplyCreditContact", "contributionDC",
"contributionLB", "controlLinkedPayments"]);

const clientInformacion = Immutable.Map({ "responseClientInfo" : {"value":"algo"} });
const emptyClientInformacion = Immutable.Map({ "responseClientInfo": {} });
const studyCreditReducer = Immutable.Map(
    {
        "validateInfoCreditStudy": { "numberOfShareholdersWithComment": "", "numberOfBoardMembersWithComent": "" },
        contextClient: {}
    });
const selectsReducer = Immutable.Map({});
const handleSubmit = () => {};
const getUserBlockingReport = () => new Promise((resolve, reject) => {});
const getMasterDataFields = () => new Promise((resolve, reject) => {});
const updateTitleNavBar = () => {};
const changeStateSaveData = () => {};
const showLoading = () => {};
let getContextClient = () => new Promise((resolve, reject) => {});
const validateInfoCreditStudy = () => new Promise((resolve, reject) => {});
const defaultProps = { 
    fields: fields, clientInformacion, 
    studyCreditReducer, handleSubmit, selectsReducer,
    getUserBlockingReport, getMasterDataFields,
    updateTitleNavBar, changeStateSaveData,
    getContextClient, validateInfoCreditStudy,
    showLoading
};

describe("componentCreditStudy", () => {

    let redirect;
    let stubGetElement;

    beforeEach(function() {
        // runs before each test in this block
        redirect = sinon.stub(globalActions, "redirectUrl");
        stubGetElement = sinon.stub(document, 'getElementById');
        stubGetElement.withArgs('dashboardComponentScroll').returns({});
    });

    afterEach(function() {
        // runs after each test in this block
        redirect.restore();
        stubGetElement.restore();
    });

    it("should redirect when user isn't logged", () => {     
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} clientInformacion={emptyClientInformacion} />);
        expect(redirect.called).to.equal(true);
    });

    it('isPDFGenerated should be false', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.state().isPDFGenerated).to.equal(false);
    });

    it('isPDFGenerated should be the same that contextClient', () => {
        const data = {payload: { data: { data: {isPDFGenerated: true} } }};
        let getContextClientData = (idClient) => {
            return new Promise(
                (resolve, reject) => resolve(data)
            )
        }

        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} getContextClient={getContextClientData} />);  
        expect(wrapper.state().isPDFGenerated).to.equal(false);
    })

    it('isPDFGenerated should be true when the button "Generar PDF" is clicked', () => {
        
        const generatePDF = () => {
            return new Promise(
                (resolve, reject) => resolve()
            )
        }

        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} generatePDF={generatePDF} />);

        wrapper.instance().handleClickButtonPDF();
        expect(wrapper.state().isPDFGenerated).to.equal(false);
    });
});