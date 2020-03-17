import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import Modal from 'react-modal';
import _ from 'lodash';
import moment from 'moment';

import BotonCreateTaskComponent from './botonCreateTaskVisit';
import SweetAlert from '../../sweetalertFocus';
import ModalTask from './modalTask';

import { deleteTask } from './actions';

import { DELETE_TASK_VIEW } from './constants';

var arrayValueTask = [];
var idTaskSeleted = null;

export class ListTasks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showConfirmDeleteTask: false,
      actions: {},
      modalIsOpen: false
    };

    this._mapValuesTask = this._mapValuesTask.bind(this);
    this._getValuesTask = this._getValuesTask.bind(this);
    this._deleteTask = this._deleteTask.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  _getValuesTask() {
    var { tasks } = this.props;
    tasks = tasks.sort(function (valueA, valueB) {
      return valueA.fecha > valueB.fecha;
    });

    if (tasks.size > 0) {
      var data = _.chain(tasks.toArray()).map(task => {
        const { uuid, responsable, fechaForm, fecha, tarea, textTarea, idResponsable, id, taskAsignator, notes } = task;
        var descripcionTarea = textTarea.length > 120 ? textTarea.substring(0, 120) + "..." : textTarea;
        var fechaDateMoment = moment(fecha, "DD/MM/YYYY").locale('es');
        var fechaDateMomentString = fechaDateMoment.format("DD") + " " + fechaDateMoment.format("MMM") + " " + fechaDateMoment.format("YYYY");
        return _.assign({}, {
          'actions': {
            actionView: true,
            task: task,
            urlServer: "./component",
            component: "VIEW_TASK"
          },
          uuid,
          id,
          idResponsable,
          responsable,
          fechaForm: fechaForm,
          fecha: fechaDateMomentString,
          tarea,
          descripcionTarea,
          taskAsignator,
          notes,
          'delete': {
            typeDelete: DELETE_TASK_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar la tarea?"
          }
        });
      })
        .value();
      arrayValueTask = data;
    } else {
      arrayValueTask = [];
    }
  }

  _confirmDeleteTask(idTask) {
    idTaskSeleted = idTask;
    this.setState({
      showConfirmDeleteTask: true
    });
  }

  _deleteTask() {
    const { deleteTask, tasks } = this.props;
    var indexDelete = tasks.findIndex(function (item) {
      return item.uuid === idTaskSeleted;
    });
    deleteTask(indexDelete);
    this.setState({
      showConfirmDeleteTask: false
    });
    idTaskSeleted = null;
  }

  _viewDetailsTask(taskDetails) {
    var actions = {
      actionView: true,
      task: taskDetails,
      urlServer: "./component",
      component: "VIEW_TASK"
    }

    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesTask(taskData, idx) {
    var { disabled } = this.props;
    return <tr key={idx}>
      <td className="collapsing">
        <i className="zoom icon" title="Ver detalle"
          onClick={this._viewDetailsTask.bind(this, taskData)}
          style={disabled === 'disabled' ? { display: 'none' } : { cursor: "pointer" }} />
      </td>
      <td>{taskData.responsable}</td>
      <td>{taskData.fecha}</td>
      <td>{taskData.descripcionTarea}</td>
      <td className="collapsing">
        <i className="remove icon" title="Eliminar tarea"
          onClick={this._confirmDeleteTask.bind(this, taskData.uuid)}
          style={disabled === 'disabled' ? { display: 'none' } : { cursor: "pointer" }} />
      </td>
    </tr>
  }

  render() {
    this._getValuesTask();
    const { tasks, disabled } = this.props;
    const modalTitle = 'Pendiente Detalle';
    return (
      <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial' }}>
        {disabled === '' || disabled === undefined ?
          <Row xs={12} md={12} lg={12}>
            <BotonCreateTaskComponent />
          </Row>
          : ''}
        {tasks.size > 0 ?
          <Row style={disabled === '' || disabled === undefined ? { marginTop: '20px' } : {}}>
            <Col xs>
              <table className="ui striped table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Responsable</th>
                    <th>Fecha de cierre</th>
                    <th>Tarea</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrayValueTask.map(this._mapValuesTask)}
                </tbody>
              </table>
            </Col>
          </Row> :
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                <span className="form-item">Aún no se han adicionado pendientes</span>
              </div>
            </Col>
          </Row>
        }
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">

          <div className="modalBt4-dialog modalBt4-lg">
            <div className="modalBt4-content modal-content">
              <div className="modalBt4-header modal-header">
                <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                  <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                  <span className="sr-only">Close</span>
                </button>
                <h4 className="modal-title" id="myModalLabel">{modalTitle}</h4>
              </div>
              <ModalTask taskEdit={this.state.actions.task} isOpen={this.closeModal} />
            </div>
          </div>
        </Modal>
        <SweetAlert
          type="warning"
          show={this.state.showConfirmDeleteTask}
          title="Eliminación tarea"
          text="¿Señor usuario, está seguro que desea eliminar la tarea?"
          confirmButtonColor='#DD6B55'
          confirmButtonText='Sí, estoy seguro!'
          cancelButtonText="Cancelar"
          showCancelButton={true}
          onCancel={() => this.setState({ showConfirmDeleteTask: false })}
          onConfirm={this._deleteTask} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteTask
  }, dispatch);
}

function mapStateToProps({ tasks }) {
  return {
    tasks
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTasks);