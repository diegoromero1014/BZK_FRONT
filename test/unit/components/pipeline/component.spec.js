import React from "react";
import {PipelineComponent} from "../../../../src/components/pipeline/component";
import Immutable from "immutable";


const pipelineReducer = Immutable.Map({ 'rowCount': 1 });
describe("Test buttonCreatePipeline", ()=>{

    let defaultProps;
    let clearPipeline;
    let pipelineByClientFindServer;
    let validatePermissionsByModule;

    beforeEach(() => {
        clearPipeline = sinon.fake();
        pipelineByClientFindServer = sinon.fake();
        validatePermissionsByModule = sinon.stub();
        validatePermissionsByModule.resolves({
            payload: {
                data: {
                    validateLogin: true,
                    data: {
                        showModule: true
                    }
                }
            }
        });


        defaultProps = {
            clearPipeline,
            pipelineByClientFindServer,
            validatePermissionsByModule,
            pipelineReducer
        }

    });

    it('should render icon plus', ()=>{
       const reducerGlobalPpermissionsPipeline = Immutable.Map({permissionsPipeline: ['CREAR']});
       const wrapper = shallow(<PipelineComponent reducerGlobal={reducerGlobalPpermissionsPipeline} {...defaultProps}/>);

       expect(clearPipeline.called).to.equal(true);
       expect(wrapper.find('button').find({className:'btn'}));
       expect(wrapper.find('i').find({className:'plus'}));

    });
});