import React from "react"
import FormEditPipeline from "../../../../../src/components/pipeline/editPipeline/formEditPipeline";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { reducer as formReducer } from "redux-form";
import {
    BUSINESS_STATUS_NO_CONTACTADO, BUSINESS_STATUS_PERDIDO, HELP_SVA,
    NUEVO_NEGOCIO,
    OPORTUNITIES_MANAGEMENT, PRODUCT_FAMILY_LEASING
} from "../../../../../src/components/pipeline/constants";
import Immutable from "immutable";
import * as selectsComponent from "../../../../../src/components/selectsComponent/actions";
import * as pipelineActions from '../../../../../src/components/pipeline/actions';
import Input from "../../../../../src/ui/input/inputComponent";
import TextareaComponent from '../../../../../src/ui/textarea/textareaComponent';
import * as globalActions from '../../../../../src/components/globalComponents/actions';
import * as actionsGlobal from "../../../../../src/actionsGlobal";
import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import Tooltip from "../../../../../src/components/toolTip/toolTipComponent";

const clientInfo = [{}, {}];
const productFamily = [{}, {}];
const middleWares = [thunk];
const mockStore = configureStore(middleWares);
const pipelineTypes = [
    {
        id: 1,
        key: OPORTUNITIES_MANAGEMENT
    },
    {
        id: 2,
        key: NUEVO_NEGOCIO
    }];

let stubGetCatalogType;
let getPipelineById;
let store;
let defaultProps;
let redirectUrl;
let stubHandleBlurValueNumber;
let stubHandleFocusValueNumber;

describe('Pruebas unitarias editar pipeline', () =>{

    beforeEach(() => {
        const selectsReducer = Immutable.Map({
            PRODUCT_FAMILY: [{id: 505950, value: 'Leasing'}],
            clientNeed: [{id: 12012, value: 'Alguna necesidad'}],
            allProductFamilies: [{id: 1, key: PRODUCT_FAMILY_LEASING}, {id: 2, key: 'Factoring'}],
            allBusinessCategories:[{

                description: "Valor total del negocio",
                field: "businessCategory",
                id: 5110627,
                key: "Colocaciones",
                parentId: 5230109,
                value: "Colocación"
            },
                {
                    description: "Valor total del negocio",
                    field: "businessCategory",
                    id: 5110627,
                    key: "Colocaciones",
                    parentId: 5230109,
                    value: "Colocación"
                }]
        });
        const clientInformacion = Immutable.Map({ responseClientInfo: clientInfo });
        const reducerGlobal = Immutable.Map({});
        const pipelineReducer = Immutable.Map({
            nameDisbursementPlansInReducer: "disbursementPlans",
            detailPipeline: {
                need: 5989489
            }
        });
        getPipelineById = sinon.stub(pipelineActions, 'getPipelineById');
        getPipelineById.onCall(0)
            .returns(() => { return new Promise((resolve, reject) => resolve(
                {payload: {data: {data: { id: 654654 }, validatelogin: true}}}
            )); });
        stubGetCatalogType = sinon.stub(selectsComponent, "consultListByCatalogType");
        stubGetCatalogType.onCall(0)
            .returns(() => { return new Promise((resolve, reject) => resolve(
                {payload: {data: {data: { id: 1, value: 'Factoring', key: 'Factoring', field: 'productFamily', description: ''}}}}
            )); });
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        stubHandleBlurValueNumber = sinon.stub(actionsGlobal, 'handleBlurValueNumber');
        stubHandleFocusValueNumber = sinon.stub(actionsGlobal, 'handleFocusValueNumber');

        defaultProps = {
            form: formReducer,
            selectsReducer,
            clientInformacion,
            pipelineReducer,
            reducerGlobal,
            getPipelineById,
            params: {
                id: 498498
            }
        }
        store = mockStore(defaultProps);
    });

    afterEach(() => {
        stubGetCatalogType.restore();
        getPipelineById.restore();
        redirectUrl.restore();
        stubHandleBlurValueNumber.restore();
        stubHandleFocusValueNumber.restore();
    })

    let origin = "pipeline";
    const PipelineComponent = FormEditPipeline(origin, "ae", null);
    it('should call getNeedById when needs client on change is called', () => {
        const wrapper = shallow(<PipelineComponent store={store} {...defaultProps}/>)
            .dive()
            .dive()
            .dive()
            .dive();
        const getNeedById = spy(sinon.fake());
        wrapper.instance().props.fields.need.value = 456465;
        wrapper.instance()._getNeedById = getNeedById;
        wrapper.update();
        wrapper.instance()._changeNeedsClient();
        expect(getNeedById).to.have.been.called(1);
    });

    it('should call getNeedById when needs client on change is called', () => {
      const wrapper = shallow(<PipelineComponent store={store} {...defaultProps}/>)
          .dive()
          .dive()
          .dive()
          .dive();
      const getNeedById = spy(() => ({key: 46486}));
      wrapper.instance().props.fields.need.value = 456465;
      wrapper.instance()._getNeedById = getNeedById;
      wrapper.update();
      wrapper.instance()._changeNeedsClient();
      expect(getNeedById).to.have.been.called(1);
    });

    it('should not call getNeedById when need value is empty', () => {
        const wrapper = shallow(<PipelineComponent store={store} {...defaultProps}/>)
            .dive()
            .dive()
            .dive()
            .dive();
        const getNeedById = sinon.fake();
        wrapper.instance().props.fields.need.value = '';
        wrapper.instance()._getNeedById = getNeedById;
        wrapper.update();
        wrapper.instance()._changeNeedsClient();
        sinon.assert.notCalled(getNeedById);

    });

    it('should render field justification when business status is no contactado', ()=>{

        const wrapper = shallow(<PipelineComponent store={store} />)
            .dive()
            .dive()
            .dive()
            .dive();

        wrapper.instance()._validateShowJustificationProbabilityAndMellowingPeriodFields(BUSINESS_STATUS_NO_CONTACTADO);
        setTimeout(()=>{
            expect(wrapper.state().showJustificationField).to.equal(true);
            expect(wrapper.find(TextareaComponent).find({name:'txtJustificationDetail'}));
        }, 1);

    });

    it('should render field justification when business status is perdido', ()=>{

        const wrapper = shallow(<PipelineComponent store={store} />)
            .dive()
            .dive()
            .dive()
            .dive();

        wrapper.instance()._validateShowJustificationProbabilityAndMellowingPeriodFields(BUSINESS_STATUS_PERDIDO);
        setTimeout(()=>{
            expect(wrapper.state().showJustificationField).to.equal(true);
            expect(wrapper.find(TextareaComponent).find({name:'txtJustificationDetail'}));
        }, 1);

    });

    it('should render field justification when business status is not perdido or no contactado', ()=>{

        const wrapper = shallow(<PipelineComponent store={store} />)
            .dive()
            .dive()
            .dive()
            .dive();

        wrapper.instance()._validateShowJustificationProbabilityAndMellowingPeriodFields("gestion","buisiness");
        setTimeout(()=>{
            expect(wrapper.state().showJustificationField).to.equal(false);
            expect(wrapper.find(Input).find({name:'txtJustificationDetail'})).to.have.length(0);
        }, 1);

    });

    it('should render SVA field', () => {
      const wrapper = shallow(<PipelineComponent store={store}  {...defaultProps}/>)
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState({isEditable: true});
      expect(wrapper.find(Input).find({ name: "sva" })).to.have.length(1);
      expect(wrapper.find(Input).find({ name: "sva" }).props().disabled).to.equal('');
    });

    it('should render SVA field disabled', () => {
      const wrapper = shallow(<PipelineComponent store={store}  {...defaultProps}/>)
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState({isEditable: false});
      expect(wrapper.find(Input).find({ name: "sva" })).to.have.length(1);
      expect(wrapper.find(Input).find({ name: "sva" }).props().disabled).to.equal('disabled');
    });

    it('should call SVA onBlur function', () => {
      const wrapper = shallow(<PipelineComponent store={store} />)
        .dive()
        .dive()
        .dive()
        .dive();
      const svaField = wrapper.find(Input).find({ name: "sva" });
      svaField.simulate('blur', {value: 15555});
      expect(stubHandleBlurValueNumber.calledOnce).to.equal(true);
    });

    it('should call SVA onFocus function', () => {
      const wrapper = shallow(<PipelineComponent store={store} />)
        .dive()
        .dive()
        .dive()
        .dive();
      const svaField = wrapper.find(Input).find({ name: "sva" });
      svaField.simulate('focus', {value: 15555});
      expect(stubHandleFocusValueNumber.calledOnce).to.equal(true);
    });

    it('field SVA should have a Tooltip', () => {
        const wrapper = shallow(<PipelineComponent store={store} />)
            .dive()
            .dive()
            .dive()
            .dive();
        const svaFieldTooltip = wrapper.find(Tooltip).find({ text: HELP_SVA });
        const svaField = wrapper.find(Input).find({ name: "sva" });
        expect(svaFieldTooltip).to.have.lengthOf(1);
        expect(svaFieldTooltip).contains(svaField);
    });

    it('should render filed roe', ()=>{
      const wrapper = shallow(<PipelineComponent store={store}/>)
          .dive()
          .dive()
          .dive()
          .dive();

      expect(wrapper.find(Input).find({name:'roe'})).to.have.length(1);
  });
  it("should render Margen field", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();
    wrapper.instance().showTypePolicy(1);
    expect(wrapper.find(Input).find({ name: "margen" })).to.have.length(1);
  });

  it("should render field Margen with placeholder", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();
    wrapper.instance().showTypePolicy(1);
    const input = wrapper.find(Input).find({ name: "margen" });
    expect(input.props().placeholder).to.equal("Ingresa el valor sin el %.");
  });

  it("should call Margen onFocus function", () => {
    const wrapper = shallow(<PipelineComponent store={store} />)
      .dive()
      .dive()
      .dive()
      .dive();
    wrapper.instance().showTypePolicy(1);
    const margin = wrapper.find(Input).find({ name: "margen" });
    margin.simulate("focus", { value: 35 });
    expect(stubHandleFocusValueNumber.calledOnce).to.equal(true);
  });
    it('should execute function _handleBlurValueNumber', ()=>{
        const wrapper = shallow(<PipelineComponent store={store}/>)
            .dive()
            .dive()
            .dive()
            .dive();

        const valueReduxForm = {
            onChange: spy(sinon.fake())
        }
        const value = -33.33
        wrapper.instance()._handleBlurValueNumber(valueReduxForm, value);

    });

  it('Should render field Tipo poliza in EditPipelineForm', () => {
      const wrapper = shallow(<PipelineComponent store={store} {...defaultProps}/>)
          .dive()
          .dive()
          .dive()
          .dive();
      wrapper.instance().showTypePolicy(1);
      expect(wrapper.state().showPolicyType).to.equal(true);
      expect(wrapper.find(ComboBox).find({id: "typePolicy"})).to.have.length(1);
  });

  it('Should not render field Tipo poliza in EditPipelineForm', () => {
      const wrapper = shallow(<PipelineComponent store={store} {...defaultProps}/>)
          .dive()
          .dive()
          .dive()
          .dive();
      wrapper.instance().showTypePolicy(2);
      expect(wrapper.state().showPolicyType).to.equal(false);
      expect(wrapper.find(ComboBox).find({id: "typePolicy"})).to.have.length(0);
  });

    it('should render field intereses/spred when value is Colocaciones', () => {

        const wrapper = shallow(<PipelineComponent store={store} />)
            .dive()
            .dive()
            .dive()
            .dive();

        wrapper.instance().showInteresSpreadField(5110627);
        wrapper.instance()._onChangeBusinessCategory2(5110627);
        expect(wrapper.find(Input).find({ name: 'commission' }));
    });

    it('should render field intereses/spred when value is Colocaciones', () => {

        const wrapper = shallow(<PipelineComponent store={store}  />)
            .dive()
            .dive()
            .dive()
            .dive();

        wrapper.instance().showInteresSpreadField(5110628);
        wrapper.instance()._onChangeBusinessCategory2(5110628);
        expect(wrapper.find(Input).find({ name: 'commission' }));
    });

    it('should call shouwBisnessCategory2', ()=>{

        const wrapper = shallow(<PipelineComponent store={store}/>)
            .dive()
            .dive()
            .dive()
            .dive();

        const button = wrapper.find('button').find({ id: 'addCategory' });
        button.at(0).simulate('click');
        wrapper.instance()._showBusinessCategory2();

    });

});