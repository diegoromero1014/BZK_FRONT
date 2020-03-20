import React from "react";
import { DownloadPrevisits } from "../../../../../src/components/previsita/downloadPrevisits/component";
import DownloadPrevisitsRedux from "../../../../../src/components/previsita/downloadPrevisits/component";
import { shallow } from "enzyme";
import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";

let defaultProps;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares)

describe("DownloadPrevisits Test", () => {

    beforeEach(() => {
        defaultProps = {
        }

        store = mockStore({});
    });
    
    it('should render component with redux', () => {
        itRenders(<DownloadPrevisitsRedux {...defaultProps} store={store}/>);
    });

    it('should render component', () => {
        itRenders(<DownloadPrevisits {...defaultProps}/>);
    });

});