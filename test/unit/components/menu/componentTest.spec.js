import React from 'react';
import { MenuComponent } from '../../../../src/components/menu/component';
import MenuComponentRedux from '../../../../src/components/menu/component';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import Immutable from 'immutable';

let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('MenuComponent Test', () => {

    beforeEach(() => {
        defaultProps = {
            dispatchConsultModulesAccess: sinon.stub().resolves({}),
            navBar: Immutable.Map({ mapModulesAccess: null }),
            dispatchInitialMenuPermissions: sinon.fake(),
        };

        store = mockStore({
            defaultProps
        })
    })

    it('Should render Component', () => {
        itRenders(<MenuComponent {...defaultProps} />)
    })

    it('Should getMenuListPermission is instanced', () => {
        const wrapper = shallow(<MenuComponent {...defaultProps} />);
        wrapper.instance().getMenuListPermission();
    })

    it('Should render Component Redux', () => {
        itRenders(<MenuComponentRedux {...defaultProps} store={store}/>)
    })
})