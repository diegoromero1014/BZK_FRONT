import React from "react";
import Immutable from "immutable";
import {BusinessPlanComponent} from "../../../../src/components/businessPlan/component";

const businessPlanReducer = Immutable.Map({ 'rowCount': 1 });
describe("Test buttonCreateBusinessPlan", ()=>{

    let defaultProps;
    let clearBusinessPlan;
    let businessPlanByClientFindServer;
    let validatePermissionsByModule;


    beforeEach(() => {
        clearBusinessPlan = sinon.fake();
        businessPlanByClientFindServer = sinon.fake();
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

        defaultProps={
            clearBusinessPlan,
            businessPlanByClientFindServer,
            validatePermissionsByModule,
            businessPlanReducer
        }
    });

    it('should render icon plus', ()=>{
        const reducerGlobalPermissionsBussinessPlan = Immutable.Map({permissionsBussinessPlan: ['CREAR']});
        const wrapper = shallow(<BusinessPlanComponent reducerGlobal={reducerGlobalPermissionsBussinessPlan} {...defaultProps}/>);

        expect(wrapper.find('button').find({className:'btn'}));
        expect(wrapper.find('i').find({className:'plus'}));
    });
});