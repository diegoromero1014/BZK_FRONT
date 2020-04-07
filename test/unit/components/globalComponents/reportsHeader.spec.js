import React from 'react';
import ReportsHeaderRedux, {ReportsHeader} from "../../../../src/components/globalComponents/reportsHeader/component";
import Immutable from "immutable";
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import {AEC_NO_APLIED} from "../../../../src/constantsGlobal";

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let defaultProps = {};

describe('Test ReportsHeader', () => {


    beforeEach(() => {
        defaultProps = {
            showMessagge: false,
            clientInformacion: Immutable.Map({
                responseClientInfo: {
                    name: 'Cristhian',
                    clientDetailsRequest: {opportunities: []}
                }
            })
        };
        store = mockStore({
            defaultProps
        });
    });

    it('Should render ReportsHeader', () => {
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    it('Should render when aecStatus is Null', () => {
        defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {
                aecStatus: null
            }});
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    it('Should render when aecStatus is not Null', () => {
        defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {
                aecStatus: AEC_NO_APLIED
            }});
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    it('Should render when Message is true', () => {
        defaultProps.showMessagge = true;
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    it('Should render when isProspect is true', () => {
        defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {
                isProspect: true
            }});
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    it('Should render when aecStatus is not Null, undefined or AEC_NO_APLIED', () => {
        defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {
                aecStatus: "AecStatus"
            }});
        itRenders(<ReportsHeader {...defaultProps}/>);
    });

    describe('Redux Component test', () => {
        it('should render react component', () => {
            itRenders(<ReportsHeaderRedux store={store}/>);
        })
    });
});