import React from "react";
import createFormPipeline from "../../../../../src/components/pipeline/createPipeline/formPipeline";
import HeaderPipeline from "../../../../../src/components/pipeline/headerPipeline";
import { ORIGIN_PIPELIN_BUSINESS, OPORTUNITIES_MANAGEMENT, NUEVO_NEGOCIO } from "../../../../../src/components/pipeline/constants";
import PermissionsUserReports from "../../../../../src/components/commercialReport/permissionsUserReports";
import ComponentDisbursementPlan from '../../../../../src/components/pipeline/disbursementPlan/componentDisbursementPlan';
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import Immutable from "immutable";
import { reducer as formReducer } from "redux-form";
import * as actionsGlobal from "../../../../../src/actionsGlobal";
import Input from "../../../../../src/ui/input/inputComponent";
import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import SweetAlert from "../../../../../src/components/sweetalertFocus";
import _ from "lodash";

const middleWares = [thunk];
const mockStore = configureStore(middleWares);

const clientInfo = [{}, {}];
const productFamily = [{}, {}];
const pipelineTypes = [
  {
    id: 1,
    key: OPORTUNITIES_MANAGEMENT
  },
  {
    id: 2,
    key: NUEVO_NEGOCIO
  }];

let stubGetParameter;

describe("Test CreatePipeline", () => {
  let store; 
  beforeEach(() => {
    const selectsReducer = Immutable.Map({ PRODUCT_FAMILY: productFamily, pipelineType: pipelineTypes});
    const pipelineReducer = Immutable.Map({
      nameDisbursementPlansInReducer: "disbursementPlans"
    });
    const clientInformacion = Immutable.Map({ responseClientInfo: clientInfo });
    store = mockStore({
      selectsReducer,
      clientInformacion,
      pipelineReducer,
      form: formReducer
    });
    
    const getParameterSuccess = {payload: {data:{parameter:{"id":5233384,"createdTimestamp":null,"createdBy":null,"updatedTimestamp":null,"updatedBy":null,"status":null,"name":"ULTIMA_REVISION_DE_PIPELINE","typeofData":"Fecha","value":"01/03/2015","description":null}, status: '200', validateLogin: true}}}
    stubGetParameter = sinon
      .stub(actionsGlobal, "consultParameterServer")
      .returns(() => {
        return new Promise((resolve, reject) => resolve(getParameterSuccess));
      });
  });

  afterEach(function() {
    // runs after each test in this block
    stubGetParameter.restore();

  });

  let origin = "pipeline";

  const PipelineComponent = createFormPipeline(origin, "ae", null);
  it("should render formPipeline/PermissionsUserReports", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(PermissionsUserReports)).to.have.length(1);
  });

  it("should render formPipeline/HeaderPipeline", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(HeaderPipeline)).to.have.length(1);
  });

  it("should render formPipeline/oportunityName", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Input)).to.have.length(5);
  });

  it('show Active field when areaAssetsEnabled value is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._changeAreaAssetsEnabledValue(true);         

      expect(wrapper.find(ComboBox)).to.have.length(10);
  });

  it('hide Active field when areaAssetsEnabled value is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._changeAreaAssetsEnabledValue(false);         

      expect(wrapper.find(ComboBox)).to.have.length(9);
  });

  it('show PivotNit field when showPivotNitField value is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._changeShowPivotNitField(true);         

      expect(wrapper.find(Input).find({name: 'pivotNit'})).to.have.length(1);
  });

  it('hide PivotNit field when showPivotNitField value is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._changeShowPivotNitField(false);         

      expect(wrapper.find(Input).find({name: 'pivotNit'})).to.have.length(0);
  });

  it('Show render formPipeline/SwetAlert ', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance().showMessageChangeClientNeed();
      expect(wrapper.find(SweetAlert)).to.have.length(8);
  });

  it('Show render formPipeline/SwetAlert when need changes', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._closeConfirmChangeNeed();
      expect(wrapper.find(SweetAlert)).to.have.length(8);
  });

  it('Show termInMonths when showtermInMonthsField is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(Input).find({name:'termInMonths'})).to.have.length(1);
  });

  it('Show termInMonthsValues when showtermInMonthsField is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComboBox).find('[name*="termInMonthsValues"]')).to.have.length(1);
  });

  it('Show pendingDisbursementAmount when showpendingDisbursementAmountField is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(Input).find({name:'pendingDisbursementAmount'})).to.have.length(1);
  });

  it('Show indexing when showindexingField is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComboBox).find('[name*="indexing"]')).to.have.length(1);
  });

  it('Show component ComponentDisbursementPlan when showComponentDisbursementPlan is true', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComponentDisbursementPlan)).to.have.length(1);
  });

  it('Hide termInMonths when showtermInMonthsField is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(Input).find({name:'termInMonths'})).to.have.length(0);
  });

  it('Hide termInMonthsValues when showtermInMonthsField is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComboBox).find('[name*="termInMonthsValues"]')).to.have.length(0);
  });

  it('Hide pendingDisbursementAmount when showpendingDisbursementAmountField is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(Input).find({name:'pendingDisbursementAmount'})).to.have.length(0);
  });

  it('Hide indexing when showindexingField is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComboBox).find('[name*="indexing"]')).to.have.length(0);
  });

  it('Hide component ComponentDisbursementPlan when showComponentDisbursementPlan is false', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComponentDisbursementPlan)).to.have.length(0);
  });

  it('hide mellowing period and probability fields on pipeline type change', () => {    
    const wrapper = shallow(<PipelineComponent store={store}/>)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._pipelineTypeAndBusinessOnChange(1);         
  });

  

  
  it('should render  messages tooltip value nominal', () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
    .dive()
    .dive()
    .dive()
    .dive();

    
    wrapper.instance()._onChangeBusinessCategory(1);         
    expect(wrapper.find(ComboBox).find({ name: 'product_' }));
});
});

describe("Test CreatePipelineChildren", () => {
  let store;
  let origin = "pipelineChildren";
  const PipelineComponentChildren = createFormPipeline(
    origin,
    ORIGIN_PIPELIN_BUSINESS,
    null
  );

  beforeEach(() => {
    const selectsReducer = Immutable.Map({ PRODUCT_FAMILY: productFamily });
    const pipelineReducer = Immutable.Map({
      nameDisbursementPlansInReducer: "disbursementPlans"
    });
    const clientInformacion = Immutable.Map({ responseClientInfo: clientInfo });
    store = mockStore({
      selectsReducer,
      clientInformacion,
      pipelineReducer,
      form: formReducer
    });
    const getParameterSuccess = {payload: {data:{parameter:{"id":5233384,"createdTimestamp":null,"createdBy":null,"updatedTimestamp":null,"updatedBy":null,"status":null,"name":"ULTIMA_REVISION_DE_PIPELINE","typeofData":"Fecha","value":"01/03/2015","description":null}, status: '200', validateLogin: true}}}
    stubGetParameter = sinon
      .stub(actionsGlobal, "consultParameterServer")
      .returns(() => {
        return new Promise((resolve, reject) => resolve(getParameterSuccess));
      });

  });

  afterEach(function() {
    // runs after each test in this block
    stubGetParameter.restore();

  });

  it('Show termInMonths when showtermInMonthsField is true formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(Input).find({name:'termInMonths'})).to.have.length(1);
  });

  it('Show termInMonthsValues when showtermInMonthsField is true formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComboBox).find('[name*="termInMonthsValues"]')).to.have.length(1);
  });

  it('Show pendingDisbursementAmount when showpendingDisbursementAmountField is true formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(Input).find({name:'pendingDisbursementAmount'})).to.have.length(1);
  });

  it('Show indexing when showindexingField is true formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComboBox).find('[name*="indexing"]')).to.have.length(1);
  });

  it('Show component ComponentDisbursementPlan when showComponentDisbursementPlan is true formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(true);
      expect(wrapper.find(ComponentDisbursementPlan)).to.have.length(1);
  });

  it('Hide termInMonths when showtermInMonthsField is false formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(Input).find({name:'termInMonths'})).to.have.length(0);
  });

  it('Hide termInMonthsValues when showtermInMonthsField is false formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComboBox).find('[name*="termInMonthsValues"]')).to.have.length(0);
  });

  it('Hide pendingDisbursementAmount when showpendingDisbursementAmountField is false formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(Input).find({name:'pendingDisbursementAmount'})).to.have.length(0);
  });

  it('Hide indexing when showindexingField is false formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComboBox).find('[name*="indexing"]')).to.have.length(0);
  });

  it('Hide component ComponentDisbursementPlan when showComponentDisbursementPlan is false formPipeline/pipelineChild', () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

      wrapper.instance()._validateShowFinancingNeedFields(false);
      expect(wrapper.find(ComponentDisbursementPlan)).to.have.length(0);
  });

  it("when createPipeline Children should not render formPipeline/HeaderPipeline", () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(HeaderPipeline)).to.have.length(0);
  });
  it("when createPipeline Children should not render formPipeline/PermissionsUserReports ", () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(PermissionsUserReports)).to.have.length(0);
  });
  it("when createPipeline Children should not render formPipeline/PermissionsUserReports ", () => {
    const wrapper = shallow(<PipelineComponentChildren store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Input)).to.have.length(5);
    expect(
      wrapper.find(Input).find({ name: "txtOpportunityName" })
    ).to.have.length(0);
  });
});
