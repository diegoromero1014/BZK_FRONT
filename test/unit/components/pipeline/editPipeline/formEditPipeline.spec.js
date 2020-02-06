import React from "react"
import FormEditPipeline from "../../../../../src/components/pipeline/editPipeline/formEditPipeline";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { reducer as formReducer } from "redux-form";
import {NUEVO_NEGOCIO, OPORTUNITIES_MANAGEMENT} from "../../../../../src/components/pipeline/constants";
import Immutable from "immutable";
import * as selectsComponent from "../../../../../src/components/selectsComponent/actions";
import * as pipelineActions from '../../../../../src/components/pipeline/actions';
import Input from "../../../../../src/ui/input/inputComponent";
import * as globalActions from '../../../../../src/components/globalComponents/actions';

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

describe('Pruebas unitarias editar pipeline', () =>{

    beforeEach(() => {
        const selectsReducer = Immutable.Map({ PRODUCT_FAMILY: productFamily, clientNeed: [{id: 12012, value: 'Alguna necesidad'}] });
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

    it('should render SVA field', () => {
      const wrapper = shallow(<PipelineComponent store={store}  {...defaultProps}/>)
        .dive()
        .dive()
        .dive()
        .dive();
  
      expect(wrapper.find(Input).find({ name: "sva" })).to.have.length(1);
    })
})