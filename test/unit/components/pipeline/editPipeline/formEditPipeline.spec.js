import React from "react"
import FormEditPipeline from "../../../../../src/components/pipeline/editPipeline/formEditPipeline";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { reducer as formReducer } from "redux-form";
import {
    NUEVO_NEGOCIO,
    OPORTUNITIES_MANAGEMENT,
    PRODUCT_FAMILY_LEASING
} from "../../../../../src/components/pipeline/constants";
import Immutable from "immutable";
import * as selectsComponent from "../../../../../src/components/selectsComponent/actions";
import * as pipelineActions from '../../../../../src/components/pipeline/actions';
import ComboBox from "../../../../../src/ui/comboBox/comboBoxComponent";
import Input from "../../../../../src/ui/input/inputComponent";

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

describe('Pruebas unitarias editar pipeline', () =>{

    beforeEach(() => {
        const selectsReducer = Immutable.Map({
            PRODUCT_FAMILY: [{id: 505950, value: 'Leasing'}],
            clientNeed: [{id: 12012, value: 'Alguna necesidad'}],
            allProductFamilies: [{id: 1, key: PRODUCT_FAMILY_LEASING}, {id: 2, key: 'Factoring'}] });
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

    it('should render filed roe', ()=>{
        const wrapper = shallow(<PipelineComponent store={store}/>)
            .dive()
            .dive()
            .dive()
            .dive();

        expect(wrapper.find(Input).find({name:'roe'})).to.have.length(1);
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
});