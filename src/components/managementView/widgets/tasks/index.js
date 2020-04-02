import React, { Component } from 'react';
import Tabs from "../../../../ui/Tab";
import { MY_TASKS, ASSIGNED_TASKS } from './constants';
import '../../../../../styles/board/widgets/tasks/main.scss';
import MyTask from './MyTask';
import AssignedTasks from './AssignedTasks';

class Task extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {
                    name: MY_TASKS,
                    content: <MyTask />,
                    number: 100,
                    className: 'tasks-tab',
                    callback: name => console.log(name)
                },
                {
                    name: ASSIGNED_TASKS,
                    content: <AssignedTasks />,
                    number: 50,
                    className: 'tasks-tab',
                    callback: name => console.log(name)
                },
            ]
        }
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

export default Task;