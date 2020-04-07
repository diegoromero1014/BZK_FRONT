import React, { Component } from 'react';
import moment from "moment";
import { get } from 'lodash';
import Tabs from "../../../../ui/Tab";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { MY_TASKS, ASSIGNED_TASKS, MY_TASK_MESSAGE, ASSIGNED_TASKS_MESSAGE, RESPONSIBLE, ASSIGNED } from './constants';
import MyTask from './MyTask';
import AssignedTasks from './AssignedTasks';
import { getTaskBoardValues, getInformationUser } from './action';
import '../../../../../styles/board/widgets/tasks/main.scss';
import { setRolToSearch } from '../../../myTasks/actions';
import { redirectUrl } from "../../../globalComponents/actions";

class Task extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [],
            tabName: MY_TASKS
        }
    }

    async componentWillMount() {
        await this.handleDispatchAction();
    }

    handleDispatchAction = async () => {
        const { dispatchGetTaskBoardValues } = this.props;
        await dispatchGetTaskBoardValues();
    }

    handleChangeTab = tabName => {
        this.setState({ tabName });
        this.handleDispatchAction();
    }

    handleRedirect = async () => {
        const { dispatchSetRolToSearch } = this.props;

        await dispatchSetRolToSearch({
            users: [await this.getUser()],
            rol: this.getRole(),
            initialDate: moment(moment().subtract(3, 'months'), "DD/MM/YYYY").toDate().getTime(),
            finalDate: moment(moment(), "DD/MM/YYYY").toDate().getTime()
        });

        redirectUrl("/dashboard/myTask");
    }

    getRole = () => this.state.tabName === MY_TASKS ? RESPONSIBLE : ASSIGNED;

    getUser = async () => {
        const { dispatchGetInformationUser } = this.props;

        return get(await dispatchGetInformationUser(), "payload.data.data.id", "");
    };

    handleRenderTabs = () => {
        const { assignedCounter, myTaskCounter } = this.props;

        const tabs = [
            {
                name: MY_TASKS,
                content: (
                    <MyTask
                        tasks={[myTaskCounter.finished, myTaskCounter.pending]}
                        handleRedirect={this.handleRedirect}
                    />
                ),
                number: myTaskCounter.total,
                className: 'tasks-tab',
                callback: this.handleChangeTab,
                tooltip: MY_TASK_MESSAGE
            },
            {
                name: ASSIGNED_TASKS,
                content: (
                    <AssignedTasks
                        tasks={[assignedCounter.finished, assignedCounter.pending]}
                        handleRedirect={this.handleRedirect}
                    />
                ),
                number: assignedCounter.total,
                className: 'tasks-tab',
                callback: this.handleChangeTab,
                tooltip: ASSIGNED_TASKS_MESSAGE
            }
        ];

        return (
            <div style={{ width: '45%', height: '100%' }}>
                <h3>TAREAS</h3>
                <div className={'dashboard-tasks-container'} >
                    <Tabs tabs={tabs} />
                </div>
            </div>
        );
    }

    render() {
        return this.handleRenderTabs();
    }
}

const mapStateToProps = ({ boardTaskReducer: { assignedCounter, myTaskCounter } }) => ({
    assignedCounter,
    myTaskCounter
});

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchGetTaskBoardValues: getTaskBoardValues,
    dispatchGetInformationUser: getInformationUser,
    dispatchSetRolToSearch: setRolToSearch
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);