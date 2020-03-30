import React from 'react';
import Immutable from "immutable";
import _ from 'lodash';
import {ClientTaskList} from '../../../../src/components/pendingTask/ClientTaskList';
import { shallow } from 'enzyme';
import { PENDING, FINISHED } from "./../../../../src/components/pendingTask/constants";
import * as globalActions from "../../../../src/components/globalComponents/actions";
import * as actions from "../../../../src/components/pendingTask/actions";
const tasksByClient = Immutable.Map({ "tabPending": {"order":0}, "tabFinished": {"order":0}, "textToSearch":"" });
const reducerGlobal = Immutable.Map({"permissionsTasks": {} });
const dispatchValidatePermissionsByModule = sinon
  .stub()
  .resolves({
        payload:{
            data:{
                validateLogin:true
            }
        }
});
let redirectUrl;
let pendingTasksByClientPromise;
let finalizedTasksByClientPromise;
const dispatchCleanPagAndOrderColumnFinalizedUserTask = sinon.fake();
const dispatchCleanPagAndOrderColumnPendingUserTask = sinon.fake();
const dispatchPendingTasksByClientFindServer = spy(sinon.fake());
const dispatchFinalizedTasksByClientFindServer = spy(sinon.fake());
const dispatchSetTextToSearch = spy(sinon.fake());
const dispatchShowLoading = sinon.fake();
const defaultProps = {
  dispatchValidatePermissionsByModule,
  dispatchCleanPagAndOrderColumnPendingUserTask,
  dispatchCleanPagAndOrderColumnFinalizedUserTask,
  dispatchPendingTasksByClientFindServer,
  dispatchFinalizedTasksByClientFindServer,
  dispatchSetTextToSearch,
  dispatchShowLoading,
  tasksByClient,
  reducerGlobal
};

describe("Test ClientTaskList", () =>{
    beforeEach(()=>{
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        finalizedTasksByClientPromise = sinon.stub(actions, "finalizedTasksByClientPromise").resolves({data:{status:200, data:{}}});  
        pendingTasksByClientPromise = sinon.stub(actions, "pendingTasksByClientPromise").resolves({data:{status:200, data:{}}});      
    })
    afterEach(() => {
        redirectUrl.restore();
        finalizedTasksByClientPromise.restore();
        pendingTasksByClientPromise.restore();
    });
    it("should render ClientTaskList", () =>{
        const wrapper = shallow(<ClientTaskList {...defaultProps}/>);
        expect(wrapper).to.have.length(1);
    });
    it("test dispatchPendingTasks", () => {
        let wrapper = shallow(<ClientTaskList {...defaultProps} />);
        wrapper.instance().dispatchPendingTasks(0, 0);
        sinon.assert.called(pendingTasksByClientPromise);
        expect(dispatchPendingTasksByClientFindServer).to.have.been.called.exactly(1);
        expect(dispatchSetTextToSearch).to.have.been.called.exactly(2);
    });
    it("test dispatchFinalizedTask", () => {
        let wrapper = shallow(<ClientTaskList {...defaultProps}/>);
        wrapper.instance().dispatchFinalizedTask(0, 0);
        sinon.assert.called(finalizedTasksByClientPromise);
        expect(dispatchFinalizedTasksByClientFindServer).to.have.been.called.exactly(2);
        expect(dispatchSetTextToSearch).to.have.been.called.exactly(5);
    });
    it("test orderColumn when mode is PENDING", ()=>{
        let dispatchCleanPagAndOrderColumnPendingUserTask = spy(sinon.fake());
        let dispatchCleanPagAndOrderColumnFinalizedUserTask = spy(sinon.fake());
        let otherProps = {
            dispatchCleanPagAndOrderColumnPendingUserTask,
            dispatchCleanPagAndOrderColumnFinalizedUserTask
        }
        let wrapper = shallow(<ClientTaskList {...defaultProps} {...otherProps}></ClientTaskList>);
        wrapper.instance().orderColumn(0, PENDING);
        expect(dispatchCleanPagAndOrderColumnPendingUserTask).to.have.been.called.exactly(2);
    });
    it("test orderColumn when mode is FINISHED", ()=>{
        let dispatchCleanPagAndOrderColumnPendingUserTask = spy(sinon.fake());
        let dispatchCleanPagAndOrderColumnFinalizedUserTask = spy(sinon.fake());
        let otherProps = {
            dispatchCleanPagAndOrderColumnPendingUserTask,
            dispatchCleanPagAndOrderColumnFinalizedUserTask
        }
        let wrapper = shallow(<ClientTaskList {...defaultProps} {...otherProps}></ClientTaskList>);
        wrapper.instance().orderColumn(0, FINISHED);
        expect(dispatchCleanPagAndOrderColumnFinalizedUserTask).to.have.been.called.exactly(2);
    });
    it("test handleTaskByClientsFind when mode is PENDING", () => {
        let wrapper = shallow(<ClientTaskList {...defaultProps}/>);
        let dispatchPendingTasks = spy(sinon.stub());
        wrapper.instance().dispatchPendingTasks = dispatchPendingTasks;
        wrapper.instance().handleTaskByClientsFind(0,PENDING);
        expect(dispatchPendingTasks).to.have.been.called.exactly(1);
    });
    it("test handleTaskByClientsFind when mode is FINISHED", () => {
      let wrapper = shallow(<ClientTaskList {...defaultProps} />);
      let dispatchFinalizedTask = spy(sinon.fake());
      wrapper.instance().dispatchFinalizedTask = dispatchFinalizedTask;
      wrapper.instance().handleTaskByClientsFind(0, FINISHED);
      expect(dispatchFinalizedTask).to.have.been.called.exactly(1);
    });
    it("test handePaginar when mode is PENDING", () => {
        let dispatchChangePagePending = spy(sinon.stub());
        let dispatchChangePageFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchChangePagePending,
            dispatchChangePageFinalized
        }
        let wrapper = shallow(<ClientTaskList {...defaultProps} {...otherProps}/>);
        wrapper.instance().handlePaginar(0, PENDING);
        expect(dispatchChangePagePending).to.have.been.called.exactly(1);
    });
    it("test handePaginar when mode is FINISHED", () => {
      let dispatchChangePagePending = spy(sinon.stub());
      let dispatchChangePageFinalized = spy(sinon.stub());
      let otherProps = {
        dispatchChangePagePending,
        dispatchChangePageFinalized
      };
      let wrapper = shallow(
        <ClientTaskList {...defaultProps} {...otherProps} />
      );
      wrapper.instance().handlePaginar(0, FINISHED);
      expect(dispatchChangePageFinalized).to.have.been.called.exactly(1);
    });
    it("test clearUserTask when mode is PENDING", () => {
        let dispatchCleanPagAndOrderColumnPendingUserTask = spy(sinon.stub());
        let dispatchCleanPagAndOrderColumnFinalizedUserTask = spy(sinon.stub());
        let otherProps ={
            dispatchCleanPagAndOrderColumnPendingUserTask,
            dispatchCleanPagAndOrderColumnFinalizedUserTask
        }
        let wrapper = shallow(<ClientTaskList {...defaultProps} {...otherProps}/>);
        wrapper.instance().clearUserTask(PENDING);
        expect(dispatchCleanPagAndOrderColumnPendingUserTask).to.have.been.called.exactly(2);
    });
    it("test clearUserTask when mode is FINISHED", () => {
        let dispatchCleanPagAndOrderColumnPendingUserTask = spy(sinon.stub());
        let dispatchCleanPagAndOrderColumnFinalizedUserTask = spy(sinon.stub());
        let otherProps ={
            dispatchCleanPagAndOrderColumnPendingUserTask,
            dispatchCleanPagAndOrderColumnFinalizedUserTask
        }
        let wrapper = shallow(<ClientTaskList {...defaultProps} {...otherProps}/>);
        wrapper.instance().clearUserTask(FINISHED);
        expect(dispatchCleanPagAndOrderColumnFinalizedUserTask).to.have.been.called.exactly(2);
    });
    it("test createTask", () => {
        let dispatchUpdateTitleNavBar = spy(sinon.stub());
        let wrapper = shallow(<ClientTaskList {...defaultProps} dispatchUpdateTitleNavBar={dispatchUpdateTitleNavBar}/>);
        wrapper.instance().createTask();
        expect(dispatchUpdateTitleNavBar).to.have.been.called.exactly(1);
        sinon.assert.called(redirectUrl);
    });
});