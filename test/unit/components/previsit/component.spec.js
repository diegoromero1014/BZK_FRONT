import React from "react";
import Immutable from "immutable";
import {PrevisitComponent} from "../../../../src/components/previsita/component";

const previsitReducer = Immutable.Map({ 'rowCount': 1 });
describe("Test buttonCreatePrevisit", ()=>{

    let defaultProps;
    let clearPrevisit;
    let previsitByClientFindServer;
    let validatePermissionsByModule;


    beforeEach(() => {
        clearPrevisit = sinon.fake();
        previsitByClientFindServer = sinon.fake();
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
            clearPrevisit,
            previsitByClientFindServer,
            validatePermissionsByModule,
            previsitReducer
        }
    });

    it('should render icon plus', ()=>{
        const reducerGlobalPermissionsPrevisits = Immutable.Map({permissionsPrevisits: ['CREAR']});
        const wrapper = shallow(<PrevisitComponent reducerGlobal={reducerGlobalPermissionsPrevisits} {...defaultProps}/>);

        expect(wrapper.find('button').find({className:'btn'}));
        expect(wrapper.find('i').find({className:'plus'}));
    });

});