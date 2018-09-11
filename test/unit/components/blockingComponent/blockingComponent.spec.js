import React from "react";
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import blockingFunction from "~/src/components/blockingComponent/blockingComponent";
import * as actionsGlobal from "~/src/actionsGlobal";

class TestComponent extends React.Component {
    render() {
        return (
            <div>Hola Mundo</div>
        );
    }
}

const middlewares = [thunk];
const mockStore = configureStore(middlewares);


describe("Test BlockingComponent", () => {

    let store;
    let stubGetUser;

    beforeEach(() => {
        store = mockStore({});
        stubGetUser = sinon.stub(actionsGlobal, 'getUserBlockingReport').returns(() => Promise.resolve({}));

    });

    afterEach(function() {
        // runs after each test in this block
        stubGetUser.restore();
    });

    it("should render Component", () => {
        const BlockingComponent = blockingFunction(TestComponent, "Prueba");
        const success = {payload: { data: { data: {username: 'heurrea', name: 'Urrea Ballesteros'} } }};
        store.subscribe()
        const wrapper = render(<BlockingComponent store={store} />);
        expect(wrapper.find(TestComponent)).to.have.length(1);
    });
})