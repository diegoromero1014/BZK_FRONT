import React from 'react';
import { shallow } from 'enzyme';
import Immutable from "immutable";
import _ from "lodash";

import {MyTaskPage} from "../../../../../../../src/components/myTasks/myTaskPage";
import * as actions from "../../../../../../../src/components/myTasks/actions";
import { ASSIGNED, PENDING, FINISHED } from "../../../../../../../src/components/myTasks/constants";
const myTasks = Immutable.Map({
  tabPending: { order: 0, rowCount: 0, data: {}, page: 0 },
  tabFinished: { order: 0, rowCount: 0, data: {}, page: 0 },
  textToSearch: ""
});
let dispatchFinalizedTasks = spy(sinon.fake());
let dispatchPendingTasks = spy(sinon.fake());
let dispatchGetMasterDataFields = spy(sinon.stub());
let dispatchUpdateTitleNavBar = spy(sinon.stub());
let getPendingTaskPromise;
let getFinalizedTaskPromise;
const defaultProps = {
  dispatchGetMasterDataFields,
  dispatchUpdateTitleNavBar,
  myTasks,
  dispatchFinalizedTasks,
  dispatchPendingTasks
};

describe("Test MyTasks component", () => {
    beforeEach(() => {
        getPendingTaskPromise = sinon
          .stub(actions, "getPendingTaskPromise")
          .resolves({ data: { status: 200, data: {} } });
        getFinalizedTaskPromise = sinon
          .stub(actions, "getFinalizedTaskPromise")
          .resolves({ data: { status: 200, data: {} } });      

    });
    afterEach(() => {
        getPendingTaskPromise.restore();
        getFinalizedTaskPromise.restore();
    });
    it("Should render MyTasks component", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps} />);
        expect(wrapper).to.have.length(1);
    });
    it("test fetchAndDispatchPendingTasks", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let filters = {users:[120], rol:{ASSIGNED}};
        await wrapper.instance().fetchAndDispatchPendingTasks(0, 0, null, filters);
        expect(dispatchPendingTasks).to.have.been.called.exactly(1);
        sinon.assert.called(getPendingTaskPromise);
    });
    it("test fetchAndDispatchFinalizedTasks", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let filters = { users: [120], rol: {ASSIGNED} };
        await wrapper.instance().fetchAndDispatchFinalizedTasks(0, 0, null, filters);
        expect(dispatchFinalizedTasks).to.have.been.called.exactly(1);
        sinon.assert.called(getFinalizedTaskPromise);
    });
    it("test updateBothTabs", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps} />);
        await wrapper.instance().updateBothTabs();

        sinon.assert.called(getPendingTaskPromise);
        sinon.assert.called(getFinalizedTaskPromise);
   });
    it("test handleFetchAndDispatchPendingTasks when mode is PENDING", () => {
      let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
      wrapper.instance().handleFetchAndDispatchPendingTasks(0, PENDING);

      sinon.assert.called(getPendingTaskPromise);
    });
    it("test handleFetchAndDispatchPendingTasks when mode is FINISHED", () => {
      let wrapper = shallow(<MyTaskPage {...defaultProps} />);
      wrapper.instance().handleFetchAndDispatchPendingTasks(0, FINISHED);

      sinon.assert.called(getFinalizedTaskPromise);
    });
    it("test handlePaginar when mode is PENDING", () => {
        let dispatchSetPagePending = spy(sinon.stub());
        let dispatchSetPageFinalized = spy(sinon.stub());
        let otherProps = {
          dispatchSetPagePending,
          dispatchSetPageFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps}/>);
        wrapper.instance().handlePaginar(0, PENDING);
        expect(dispatchSetPagePending).to.have.been.called.exactly(1);
    });
    it("test handlePaginar when mode is FINISHED", () => {
      let dispatchSetPagePending = spy(sinon.stub());
      let dispatchSetPageFinalized = spy(sinon.stub());
      let otherProps = {
        dispatchSetPagePending,
        dispatchSetPageFinalized
      };
      let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
      wrapper.instance().handlePaginar(0, FINISHED);
      expect(dispatchSetPageFinalized).to.have.been.called.exactly(1);
    });
    it("test orderColumn when mode is PENDING", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let handleFetchAndDispatchPendingTasks = spy(sinon.stub());
        let otherProps = {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized
        }
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().handleFetchAndDispatchPendingTasks = handleFetchAndDispatchPendingTasks;
        wrapper.instance().orderColumn(0, PENDING);
        expect(dispatchCleanPageAndSetOrderPending).to.have.been.called.exactly(1);
    });
    it("test orderColumn when mode is FINISHED", () => {
      let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
      let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
      let otherProps = {
        dispatchCleanPageAndSetOrderPending,
        dispatchCleanPageAndSetOrderFinalized
      };
      let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
      wrapper.instance().orderColumn(0, FINISHED);
      expect(dispatchCleanPageAndSetOrderFinalized).to.have.been.called.exactly(1);
    });
    it("test clearUserTask when mode is PENDING", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let otherProps = {
          dispatchCleanPageAndSetOrderPending,
          dispatchCleanPageAndSetOrderFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().clearUserTask(PENDING);
        expect(dispatchCleanPageAndSetOrderPending).to.have.been.called.exactly(
          1
        );
    });
    it("test clearUserTask when mode is FINISHED", () => {
      let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
      let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
      let otherProps = {
        dispatchCleanPageAndSetOrderPending,
        dispatchCleanPageAndSetOrderFinalized
      };
      let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
      wrapper.instance().clearUserTask(FINISHED);
      expect(dispatchCleanPageAndSetOrderFinalized).to.have.been.called.exactly(
        1
      );
    });
});