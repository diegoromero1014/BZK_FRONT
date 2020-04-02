import React, { Component } from 'react';
import Tabs from "../../../../ui/Tab";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { MY_TASKS, ASSIGNED_TASKS } from './constants';
import MyTask from './MyTask';
import AssignedTasks from './AssignedTasks';

import '../../../../../styles/board/widgets/tasks/main.scss';

class Task extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: []
        }
    }

    async componentWillMount() {
        const { assignedTasks, myTask } = this.props;

        await this.setState({
            tabs: [
                {
                    name: MY_TASKS,
                    content: <MyTask tasks={[myTask.finished, myTask.pending]} />,
                    number: myTask.total,
                    className: 'tasks-tab',
                    callback: name => console.log(name)
                },
                {
                    name: ASSIGNED_TASKS,
                    content: <AssignedTasks tasks={[assignedTasks.finished, assignedTasks.pending]} />,
                    number: assignedTasks.total,
                    className: 'tasks-tab',
                    callback: name => console.log(name)
                }
            ]
        });
    }

    render() {
        return (
            <div style={{ width: '45%', height: '100%' }}>
                <h3>TAREAS</h3>
                <div className={'dashboard-tasks-container'} >
                    <Tabs tabs={this.state.tabs} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ boardTaskReducer: { assignedTasks, myTask } }) => ({
    assignedTasks,
    myTask
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);