import React from 'react';
import { TabClientInfo } from '../../../../src/components/clientInformation/tabClientInfo';
import TabClientInfoRedux from '../../../../src/components/clientInformation/tabClientInfo';
import Immutable from "immutable";
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import { TAB_PIPELINE, TAB_BUSINESS_PLAN, TAB_RISKS_MANAGEMENT, TAB_CONTACTS, TAB_SHAREHOLDER, TAB_PREVISITS, TAB_VISITS, TAB_CUSTOMER_STORY } from '../../../../src/constantsGlobal';

let defaultProps;
let disptachUpdateTabSeleted;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test TabClientInfo', () => {

    beforeEach(() => {
        disptachUpdateTabSeleted = sinon.fake();
        defaultProps = {
            navBar: Immutable.Map({ mapModulesAccess: null }),
            tabReducer: Immutable.Map({ tabSelected: null }),
            disptachUpdateTabSeleted
        }
        store = mockStore({
            defaultProps
        })
    })

    it('Should render InfoTab', ()=> {
        itRenders(<TabClientInfo {...defaultProps}/>);
    });
    
    it('Should render component with Redux', ()=> {
        itRenders(<TabClientInfoRedux {...defaultProps} store={store}/>);
    });
    
    it('Should render InfoTab', ()=> {
        const wrapper = shallow(<TabClientInfo {...defaultProps}/>);
        expect(wrapper.find('li').find({id: 'infoTab'})).to.have.length(1);
    });
    
    it('When handleClickTabItem is instanced', ()=> {
        const wrapper = shallow(<TabClientInfo {...defaultProps}/>);
        wrapper.instance().handleClickTabItem('any');
        sinon.assert.calledOnce(disptachUpdateTabSeleted);
        expect(wrapper.state().tabActive).to.equal('any'); 
    });
    
    it('When handleChangeCounterTabPending is instanced', ()=> {
        const wrapper = shallow(<TabClientInfo {...defaultProps}/>);
        wrapper.instance().handleChangeCounterTabPending(1);
        expect(wrapper.state().counterTabPending).to.equal(1); 
    });
    
    it('When componentWillUnmount is instanced', ()=> {
        const wrapper = shallow(<TabClientInfo {...defaultProps}/>);
        wrapper.instance().componentWillUnmount();
        expect(wrapper.state().tabActive).to.equal(1); 
    });

    it('Case tabActive is TAB_PIPELINE', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_PIPELINE }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });

    it('Case tabActive is TAB_BUSINESS_PLAN', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_BUSINESS_PLAN }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });

    it('Case tabActive is TAB_CONTACTS', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_CONTACTS }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });

    it('Case tabActive is TAB_SHAREHOLDER', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_SHAREHOLDER }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });

    it('Case tabActive is TAB_RISKS_MANAGEMENT', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_RISKS_MANAGEMENT }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });
    it('Case tabActive is TAB_PREVISITS', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_PREVISITS }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });
    it('Case tabActive is TAB_VISITS', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_VISITS }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });
    it('Case tabActive is TAB_CUSTOMER_STORY ', ()=> {
        defaultProps.tabReducer = Immutable.Map({ tabSelected: TAB_CUSTOMER_STORY }),
        itRenders(<TabClientInfo {...defaultProps}/>);
    });
});