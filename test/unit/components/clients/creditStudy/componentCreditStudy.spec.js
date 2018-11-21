import React from 'react';
import Immutable from 'immutable';
import sinon from 'sinon';

import { ComponentStudyCredit } from "~/src/components/clients/creditStudy/componentCreditStudy";
import ReduxFormField, {createFieldsFromArray} from "~/test/helpers/ReduxFormField.js";
import * as globalActions from '~/src/components/globalComponents/actions';
import ButtonContactAdmin from '~/src/components/clientDetailsInfo/bottonContactAdmin';
import ButtonShareholderAdmin from '~/src/components/clientDetailsInfo/bottonShareholderAdmin';
import ButtonBoardMembersAdmin from '~/src/components/clientDetailsInfo/buttonBoardMembersAdmin';
import ClientTypology from '~/src/components/contextClient/ClientTypology';
import ContextEconomicActivity from '~/src/components/contextClient/contextEconomicActivity';
import ComponentListLineBusiness from '~/src/components/contextClient/listLineOfBusiness/whiteListLineBusiness';
import ComponentListDistributionChannel from '~/src/components/contextClient/listDistributionChannel/componentListDistributionChannel';
import InventorPolicy from '~/src/components/contextClient/inventoryPolicy';
import ControlLinkedPayments from '~/src/components/contextClient/controlLinkedPayments';
import ComponentListMainClients from '~/src/components/contextClient/listMainClients/componentListMainClients';
import ComponentListMainSupplier from '~/src/components/contextClient/listMainSupplier/componentListMainSupplier';
import ComponentListMainCompetitor from '~/src/components/contextClient/listMainCompetitor/componentListMainCompetitor';
import ComponentListIntOperations from '~/src/components/contextClient/listInternationalOperations/componentListIntOperations';

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
        contextClient: {  }
    });
const selectsReducer = Immutable.Map({});
const reducerGlobal = Immutable.Map({});
const handleSubmit = () => {};
const getUserBlockingReport = () => new Promise((resolve, reject) => {});
const getMasterDataFields = () => new Promise((resolve, reject) => {});
const updateTitleNavBar = () => {};
const changeStateSaveData = () => {};
const showLoading = () => {};
const swtShowMessage = () => {};
let getContextClient = () => new Promise((resolve, reject) => {});
const validateInfoCreditStudy = () => new Promise((resolve, reject) => {});
const defaultProps = { 
    fields: fields, clientInformacion, 
    studyCreditReducer, handleSubmit, selectsReducer,
    getUserBlockingReport, getMasterDataFields,
    updateTitleNavBar, changeStateSaveData,
    getContextClient, validateInfoCreditStudy,
    showLoading, swtShowMessage, reducerGlobal
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
        const response = {payload: {data: {data: {filename: "prueba"}}}};
        const generatePDF = () => {
            return new Promise(
                (resolve, reject) => resolve(response)
            )
        }

        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} generatePDF={generatePDF} />);

        wrapper.instance().callGeneratePDF();
        setTimeout(() => expect(wrapper.state().isPDFGenerated).to.equal(true), 1 ); 
        
    });

    it('should render ButtonContactAdmin', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ButtonContactAdmin)).to.have.length(1);
    });

    it('should render ButtonShareholderAdmin', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ButtonShareholderAdmin)).to.have.length(1);
    });

    it('should render ButtonBoardMembersAdmin', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ButtonBoardMembersAdmin)).to.have.length(1);
    });

    it('should render ClientTypology', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ClientTypology)).to.have.length(1);
    });

    it('should render ContextEconomicActivity', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ContextEconomicActivity)).to.have.length(1);
    });

    it('should render ComponentListLineBusiness', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListLineBusiness)).to.have.length(1);
    });

    it('should render ComponentListDistributionChannel', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListDistributionChannel)).to.have.length(1);
    });

    it('should render InventorPolicy', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(InventorPolicy)).to.have.length(1);
    });

    it('should render ControlLinkedPayments', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ControlLinkedPayments)).to.have.length(1);
    });

    it('should render ComponentListMainClients', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListMainClients)).to.have.length(1);
    });

    it('should render ComponentListMainSupplier', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListMainSupplier)).to.have.length(1);
    });

    it('should render ComponentListMainCompetitor', () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListMainCompetitor)).to.have.length(1);
    });

    it("shouldn't render ComponentListIntOperations", () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} />);
        expect(wrapper.find(ComponentListIntOperations)).to.have.length(0);
    });

    it("should render ComponentListIntOperations when operationsForeignCurrency is YES", () => {
        const clientInformacion = Immutable.Map({ "responseClientInfo" : {"operationsForeignCurrency":1} });
        
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} clientInformacion={clientInformacion} />);
        expect(wrapper.find(ComponentListIntOperations)).to.have.length(1);
    });

    it('should display message when credit study is overdue', () => {
        const studyCreditReducer = Immutable.Map(
            {
                "validateInfoCreditStudy": { "numberOfShareholdersWithComment": "", "numberOfBoardMembersWithComent": "" },
                contextClient: { overdueCreditStudy: true }
            });
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} studyCreditReducer={studyCreditReducer}/>);
        expect(wrapper.find('#checkSectionActivityEconomic')).to.have.length(1);
    });

    it("shouldn't display message when credit study is not overdue", () => {
        const wrapper = shallow(<ComponentStudyCredit {...defaultProps} studyCreditReducer={studyCreditReducer}/>);
        expect(wrapper.find('#checkSectionActivityEconomic')).to.have.length(0);
    });
});