import React from "react";
import PrevisitComponentRedux from "../../../../src/components/previsita/component";
import {PrevisitComponent} from "../../../../src/components/previsita/component";
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from "immutable";

let dispatchprevisitByClientFindServer;
let dispatchClearPrevisit;
let dispatchUpdateTitleNavBar;
let dispatchValidatePermissionsByModule;
let dispatchDownloadFilePdf;
let dispatchChangeStateSaveData;
let redirectUrl;
let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Test buttonCreatePrevisit", ()=>{

    beforeEach(() => {
        store = mockStore({});

        dispatchUpdateTitleNavBar = sinon.fake();
        dispatchDownloadFilePdf = sinon.fake();
        dispatchClearPrevisit = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        dispatchprevisitByClientFindServer = sinon.fake();
        dispatchValidatePermissionsByModule = sinon.stub();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        dispatchValidatePermissionsByModule.resolves({
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
            dispatchUpdateTitleNavBar,
            dispatchDownloadFilePdf,
            dispatchClearPrevisit,
            dispatchChangeStateSaveData,
            dispatchprevisitByClientFindServer,
            dispatchValidatePermissionsByModule,

            previsitReducer : Immutable.Map({ rowCount: 1 }),
            reducerGlobal : Immutable.Map({ permissionsPrevisits : "" })
        }
    });

    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering components', () => {

        it('Rendering component with redux', () => {
            itRenders(<PrevisitComponentRedux store={store}/>)
        })
                
        it('Rendering component', () => {
            itRenders(<PrevisitComponent {...defaultProps}/>)
        })

        it('should render icon plus', ()=>{
            const reducerGlobalPermissionsPrevisits = Immutable.Map({permissionsPrevisits: ['CREAR']});
            const wrapper = shallow(<PrevisitComponent reducerGlobal={reducerGlobalPermissionsPrevisits} {...defaultProps}/>);
    
            expect(wrapper.find('button').find({className:'btn'}));
            expect(wrapper.find('i').find({className:'plus'}));
        });

        it('createPrevisita instance', ()=>{
            const wrapper = shallow(<PrevisitComponent {...defaultProps}/>);
            wrapper.instance().createPrevisita();
            sinon.assert.called(dispatchUpdateTitleNavBar);
        });

        it('componentWillMount instance', ()=>{
            const wrapper = shallow(<PrevisitComponent {...defaultProps}/>);
            wrapper.instance().componentWillMount();
            sinon.assert.called(dispatchClearPrevisit);
        });

        it('downloadFilePrevisitGuide instance', ()=>{
            const wrapper = shallow(<PrevisitComponent {...defaultProps}/>);
            wrapper.instance().downloadFilePrevisitGuide();
            sinon.assert.called(dispatchDownloadFilePdf);
        });

    })

});