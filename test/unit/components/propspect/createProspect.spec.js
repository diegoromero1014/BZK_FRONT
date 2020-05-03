import React from 'react';
import CreatePropspectRedux from '../../../../src/components/propspect/createPropspect';
import { CreatePropspect } from '../../../../src/components/propspect/createPropspect';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';
import { NATURE_PERSON } from '../../../../src/components/propspect/constants';
import { CONTACT_ID_TYPE } from '../../../../src/components/selectsComponent/constants';

let dispatchValidateProspectExists;
let dispatchClearAllState;
let dispatchConsultList;
let dispatchGetMasterDataFields;

let defaultProps ;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('unit test for CreatePropspect component', () => {

    beforeEach(() => {
        store = mockStore({});

        dispatchValidateProspectExists = sinon.stub();
        dispatchGetMasterDataFields = sinon.stub();
        dispatchClearAllState = sinon.fake();
        dispatchConsultList = sinon.fake();

        defaultProps = {
            dispatchValidateProspectExists,
            dispatchGetMasterDataFields,
            dispatchClearAllState,
            dispatchConsultList,

            fields : {
                idType : {
                    onChange : sinon.fake(),
                    value : "test"
                },
                idNumber : {
                    onChange : sinon.fake(),
                    value : "test"
                },
                clientType : {
                    onChange : sinon.fake()
                }
            },

            selectsReducer : Immutable.Map({ clientType : [ { id : 10, key : NATURE_PERSON }, { id : 14 } ] })
        }


    })

    describe('Rendering component', () => {
        
        it('rendering with redux', () => {
            itRenders(<CreatePropspectRedux store={store}/>)
        })

        it('rendering CreatePropspect', () => {
            itRenders(<CreatePropspect {...defaultProps}/>)
        })

    })

    describe('functions of component' , () => {

        it('closeError instance', () => {
            const wrapper = shallow(<CreateProspect {...defaultProps}/>)
            wrapper.setState({
                showEx : true ,
                showEr : true
            })
            wrapper.instance().closeError();
            expect(wrapper.state().showEx).to.equal(false);
            expect(wrapper.state().showEr).to.equal(false);
        })

        it('onClickButtonChange instance', () => {
            const wrapper = shallow(<CreateProspect {...defaultProps}/>)
            wrapper.instance().onClickButtonChange();
            sinon.assert.calledOnce(dispatchClearAllState);
            expect(wrapper.state().idTypeMaster).to.equal([]);
            expect(wrapper.state().idTypeMasterSelector).to.equal("");
            expect(wrapper.state().personType).to.equal(null);
        })

        it('clickButtonCreateProps instance', () => {
            defaultProps.dispatchValidateProspectExists.resolves({
                payload : {
                    data : {
                        data : {
                            status : "Exists"
                        }
                    }
                }
            })
            const wrapper = shallow(<CreateProspect {...defaultProps}/>)
            wrapper.instance().clickButtonCreateProps();
            expect(wrapper.state().showEr).to.equal(true);
        })
        
        it('clickButtonCreateProps instance', () => {
            defaultProps.dispatchValidateProspectExists.resolves({
                payload : {
                    data : {
                        data : {
                            status : 500
                        }
                    }
                }
            })
            const wrapper = shallow(<CreateProspect {...defaultProps}/>)
            wrapper.instance().clickButtonCreateProps();
            expect(wrapper.state().showEx).to.equal(true);
        })


        it('clientetypeChange instance', () => {
            const valor = 10;
            const idTypeMaster = CONTACT_ID_TYPE;
            const wrapper = shallow(<CreateProspect {...defaultProps}/>)
            wrapper.instance().clickButtonCreateProps(valor);
            expect(wrapper.state().idTypeMasterSelector).to.equal(idTypeMaster);
        })

        it('clientetypeChange instance', () => {
            const valor = "";
            defaultProps.selectsReducer = Immutable.Map({ clientType : [] });
            const wrapper = shallow(<CreateProspect {...defaultProps}/>);
            wrapper.instance().clickButtonCreateProps(valor);
            expect(wrapper.state().idTypeMasterSelector).to.equal("");
        })

    })

})
