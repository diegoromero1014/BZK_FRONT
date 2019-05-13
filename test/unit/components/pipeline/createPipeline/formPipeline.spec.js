import React from "react";
import createFormPipeline from "../../../../../src/components/pipeline/createPipeline/formPipeline";
import HeaderPipeline from "../../../../../src/components/pipeline/headerPipeline";
import { ORIGIN_PIPELIN_BUSINESS } from "../../../../../src/components/pipeline/constants";
import PermissionsUserReports from "../../../../../src/components/commercialReport/permissionsUserReports";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import Immutable from "immutable";
import { reducer as formReducer } from "redux-form";
import * as actionsGlobal from "../../../../../src/actionsGlobal";
import Input from "../../../../../src/ui/input/inputComponent";
import _ from "lodash";

const middleWares = [thunk];
const mockStore = configureStore(middleWares);

const clientInfo = [{}, {}];
const productFamily = [{}, {}];
let stubGetParameter;

describe("Test CreatePipeline", () => {
  let store;
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

    expect(wrapper.find(Input)).to.have.length(7);
  });
});

describe("Test CreatePipelineChildren", () => {
  let store;
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

  let origin = "pipelineChildren";
  const PipelineComponentChildren = createFormPipeline(
    origin,
    ORIGIN_PIPELIN_BUSINESS,
    null
  );
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

    expect(wrapper.find(Input)).to.have.length(7);
    expect(
      wrapper.find(Input).find({ name: "txtOpportunityName" })
    ).to.have.length(0);
  });
});
