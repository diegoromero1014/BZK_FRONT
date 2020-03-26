import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TASK_STATUS } from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { updateStatusTask, tasksByUser } from '../myPendings/myTasks/actions';
import { NUMBER_RECORDS } from '../myPendings/myTasks/constants';
import { MESSAGE_SAVE_DATA } from '../../constantsGlobal';
import { changeStateSaveData } from '../main/actions';
import { validateIsNullOrUndefined } from '../../actionsGlobal';

let key = 1;
class SelectTaskComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idEstado: null,
      idTask: null
    };
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  componentWillMount() {
    const { valueStatus } = this.props;
    this.setState({
      idEstado: valueStatus.idStatus,
      idTask: valueStatus.idTask
    });
  }

  onChangeValue(idValueStatus) {
    const { updateStatusTask, tasksByUser, changeStateSaveData } = this.props;
    changeStateSaveData(true, MESSAGE_SAVE_DATA);
    updateStatusTask(this.state.idTask, idValueStatus).then((data) => {
      changeStateSaveData(false, "");
      if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
      } else {
        tasksByUser(0, NUMBER_RECORDS, "");
      }
    });
  }

  render() {
    const { colorTraffict, selectsReducer, isEditable, styles } = this.props;
    var editable = isEditable;
    if (validateIsNullOrUndefined(isEditable)) {
      editable = true;
    }
    return (
      <td>
        <ComboBox name={key++} labelInput="Seleccione"
          value={this.state.idEstado}
          valueProp={'id'}
          textProp={'value'}
          disabled={editable ? '' : 'disabled'}
          data={selectsReducer.get(TASK_STATUS) || []}
          onChange={val => this.onChangeValue(val)}
          onBlur={() => ''}
          defaultValue={this.state.idEstado}
        />
      </td>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateStatusTask,
    changeStateSaveData,
    tasksByUser
  }, dispatch);
}

function mapStateToProps({ selectsReducer }, { taskEdit }) {
  return {
    selectsReducer
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTaskComponent);
