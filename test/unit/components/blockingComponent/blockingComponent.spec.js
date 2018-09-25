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
    let stubLocalStorage;
    const data = { payload: { data: { data: { isPDFGenerated: true } } } };

    beforeEach(() => {
        store = mockStore({});
        const success = { payload: { data: { data: { username: 'heurrea', name: 'Urrea Ballesteros' } } } };
        stubGetUser = sinon.stub(actionsGlobal, 'getUserBlockingReport').returns(() => {
            return new Promise(
                (resolve, reject) => resolve(success)
            )
        });
    });

    afterEach(function () {
        // runs after each test in this block
        stubGetUser.restore();
        stubLocalStorage.restore();
    });

    it("should render wrapper component", () => {
        const BlockingComponent = blockingFunction(TestComponent, "Prueba");
        const wrapper = shallow(<BlockingComponent store={store} />).dive();
        stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("icherrer");
        expect(wrapper.find(TestComponent)).to.have.length(1);
    });

    it("hasAccess should be false when the user is diferent", (done) => {
        const BlockingComponent = blockingFunction(TestComponent, "Prueba");
        const wrapper = shallow(<BlockingComponent store={store} />).dive();
        stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("icherrer");

        setTimeout(() => {
            expect(wrapper.state()).to.have.property('hasAccess', false);
            done();
        }, 1000);

    });

    it("hasAccess should be true when the user is the same", (done) => {
        const BlockingComponent = blockingFunction(TestComponent, "Prueba");
        const wrapper = shallow(<BlockingComponent store={store} />).dive();
        stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("heurrea");

        setTimeout(() => {
            expect(wrapper.state()).to.have.property('hasAccess', true);
            done();
        }, 1000);
    });
})