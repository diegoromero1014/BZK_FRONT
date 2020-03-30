import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TASK_STATUS } from '../selectsComponent/constants';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { updateStatusTask } from '../myPendings/myTasks/actions';
import { MESSAGE_SAVE_DATA } from '../../constantsGlobal';
import { changeStateSaveData } from '../dashboard/actions';
import { validateIsNullOrUndefined } from '../../actionsGlobal';

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
    const { idStatus, idTask } = this.props;
    this.setState({
      idEstado: idStatus,
      idTask: idTask
    });
  }

  async onChangeValue (idValueStatus) {
    const { updateStatusTask, changeStateSaveData, updateBothTabs } = this.props;
    changeStateSaveData(true, MESSAGE_SAVE_DATA);
    let data = await updateStatusTask(this.state.idTask, idValueStatus);
    if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
      redirectUrl("/login");
    } else {
      await updateBothTabs();
      this.forceUpdate();
      changeStateSaveData(false, "");
    }
  }

  render() {
    const { selectsReducer, permissionEdit, key} = this.props;
    const { idEstado, idTask } = this.state
    var editable = permissionEdit;
    if (validateIsNullOrUndefined(permissionEdit)) {
      editable = true;
    }
    return (
      <td key={idTask}>
        <ComboBox
          key={idTask}
          labelInput="Seleccione"
          name={idTask}
          value={idEstado}
          valueProp={"id"}
          textProp={"value"}
          disabled={editable ? "" : "disabled"}
          data={selectsReducer.get(TASK_STATUS) || []}
          onChange={val => {
            val != idEstado ? this.onChangeValue(val) : {};
          }}
          defaultValue={idEstado}
        />
      </td>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateStatusTask,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({ selectsReducer }) {
  return {
    selectsReducer
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTaskComponent);
