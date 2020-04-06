import React, { Component } from 'react';
import Tabs from "../../../../ui/Tab";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { MY_TASKS, ASSIGNED_TASKS } from './constants';
import MyTask from './MyTask';
import AssignedTasks from './AssignedTasks';
import { getTaskBoardValues } from './action';
import '../../../../../styles/board/widgets/tasks/main.scss';

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

    handleRenderTabs = () => {
        const { assignedCounter, myTaskCounter } = this.props;

        const tabs = [
            {
                name: MY_TASKS,
                content: <MyTask tasks={[myTaskCounter.finished, myTaskCounter.pending]} />,
                number: myTaskCounter.total,
                className: 'tasks-tab',
                callback: this.handleChangeTab
            },
            {
                name: ASSIGNED_TASKS,
                content: <AssignedTasks tasks={[assignedCounter.finished, assignedCounter.pending]} />,
                number: assignedCounter.total,
                className: 'tasks-tab',
                callback: this.handleChangeTab
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
    dispatchGetTaskBoardValues: getTaskBoardValues
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);