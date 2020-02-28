import React from "react";
import Immutable from "immutable";
import {VisitComponent} from "../../../../src/components/visit/component";

const visitReducer = Immutable.Map({ 'rowCount': 1 });
describe("Test ButtonCreateVisit", ()=>{


    let defaultProps;
    let clearVisit;
    let visitByClientFindServer;
    let validatePermissionsByModule;


    beforeEach(() => {
        clearVisit = sinon.fake();
        visitByClientFindServer = sinon.fake();
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
            clearVisit,
            visitByClientFindServer,
            validatePermissionsByModule,
            visitReducer
        }
    });


    it('should render icon plus', ()=>{
        const reducerGlobalPermissionsVisits = Immutable.Map({permissionsVisits: ['CREAR']});
        const wrapper = shallow(<VisitComponent reducerGlobal={reducerGlobalPermissionsVisits} {...defaultProps}/>);

        expect(wrapper.find('button').find({className:'btn'}));
        expect(wrapper.find('i').find({className:'plus'}));
    });
});