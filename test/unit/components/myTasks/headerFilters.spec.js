import React from 'react';
import Immutable from "immutable";
import * as globalActions from "../../../../src/components/globalComponents/actions";
import * as actions from "../../../../src/components/myTasks/actions";
import {getUserAssistantsById, setRolToSearch} from "../../../../src/components/myTasks/actions";
import {swtShowMessage} from "../../../../src/components/sweetAlertMessages/actions";
import {ClientTaskList} from "../../../../src/components/pendingTask/ClientTaskList";
import HeaderFiltersRedux, {HeaderFilters} from "../../../../src/components/myTasks/headerFilters";
import TaskPageRedux, {TaskPage} from "../../../../src/components/pendingTask/taskPage";
import thunk from "redux-thunk";
import configureStore from 'redux-mock-store';
import {createFieldsFromArray} from "../../../helpers/ReduxFormField";

const dispatchValidatePermissionsByModule = sinon
    .stub()
    .resolves({
        payload: {
            data: {
                validateLogin: true
            }
        }
    });
const reducerGlobal = Immutable.Map({"permissionsTasks": {} });
const fields = createFieldsFromArray(["users", "rol", "initialDate", "finalDate"]);
let dispatchGetUserAssistantsById;
const dispatchShowMessage = spy(sinon.fake());
const dispatchSetRolToSearch = sinon.fake();
const dispatchFilters = sinon.fake();
const defaultProps = {
    dispatchGetUserAssistantsById,
    dispatchShowMessage,
    dispatchSetRolToSearch,
    fields,
    reducerGlobal,
    dispatchFilters
};
let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test taskPage', () => {
    beforeEach(() => {
        dispatchGetUserAssistantsById = sinon.stub(actions, "getUserAssistantsById").resolves({data:{status:200, data:{}}});
        store = mockStore({
            defaultProps
        });
    });

    afterEach(() => {
        dispatchGetUserAssistantsById.restore();
    });

    it("should render ClientTaskList", () =>{
        const wrapper = shallow(<HeaderFilters {...defaultProps}/>);
        expect(wrapper).to.have.length(1);
    });

    it('searchByFilters', async () => {
        const wrapper = shallow(<HeaderFilters {...defaultProps}/>);
        wrapper.update();
        await wrapper.instance().searchByFilters();
        sinon.assert.calledOnce(dispatchFilters);
    });

    it('onClickDate', async () => {
        const wrapper = shallow(<HeaderFilters {...defaultProps}/>);
        wrapper.update();
        await wrapper.instance().onClickDate('initial', new Date());
        wrapper.update();
        await wrapper.instance().onClickDate('final', new Date());
        await wrapper.instance().searchByFilters();
    });

    it('searchByFilters', async () => {
        const wrapper = shallow(<HeaderFilters {...defaultProps}/>);
        wrapper.update();
        await wrapper.instance().fillDateEmpty();
    });

    it('onClickDate', async () => {
        const wrapper = shallow(<HeaderFilters {...defaultProps}/>);
        let value = {
            target: {
                value: ''
            }
        };
        wrapper.update();
        await wrapper.instance().fillDateEmpty('initial', value);
        wrapper.update();
        await wrapper.instance().fillDateEmpty('final', value);
    });

    describe('Redux Component test', () => {
        it('should render react component', () => {
            itRenders(<HeaderFiltersRedux store={store}/>);
        })
    });
});