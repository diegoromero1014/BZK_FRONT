import React, {Component,PropTypes} from 'react';
import GridComponent from '../../../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {DELETE_TASK_VIEW} from './constants';
import _ from 'lodash';
import moment from 'moment';

let v1 = "";
let v2 = "";

class ListTasks extends Component {

  constructor(props){
      super(props);
      this._renderHeaders = this._renderHeaders.bind(this);
      this._mapValueTasks = this._mapValueTasks.bind(this);
      this.state = {
        column : "",
        order : "",
        orderA: 'none',
        orderD: 'inline-block'
      }
  }

  componentWillMount(){
    this.state = {
      orderA: 'none',
      orderD: 'inline-block'
    }
  }

  componentWillReceiveProps(nextProps){
    const {value1, value2} = nextProps;
    if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)){
      v1 = nextProps.value1;
      v2 = nextProps.value2;
    }
  }


  _orderColumn(orderShareholder,columnShareholder){
    if(orderShareholder === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tarea",
        key: "tarea"
      },
      {
        title: "Responsable",
        key: "responsable"
      },
      {
        title: "Fecha",
        key: "fecha"
      },
      {
        title: "",
        key:"delete"
      }
    ]
  }

  _mapValueTasks(){
    const {tasks} = this.props;
    if(tasks.size > 0){
      var data = _.chain(tasks.toArray()).map(task => {
        const {uuid, responsable, fecha, tarea} = task;
        var descripcionTarea = tarea.length > 120 ? tarea.substring(0, 120) + "..." : tarea;
        var fechaDateMoment = moment(fecha, "DD/MM/YYYY").locale('es');
        var fechaDateMomentString = fechaDateMoment.format("DD") + " " + fechaDateMoment.format("MMM") + " " + fechaDateMoment.format("YYYY");
        return _.assign({}, {
          'actions':  {
            actionView: true,
            task: task,
            urlServer: "./component",
            component : "VIEW_TASK"
          },
          uuid: uuid, responsable: responsable, fecha: fechaDateMomentString, tarea: descripcionTarea,
          'delete':  {
            typeDelete : DELETE_TASK_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar la tarea?"
          }
        });
      })
      .value();
      return data;
    } else {
      return [];
    }
  }

  render() {
    const modalTitle = 'Pendiente Detalle';
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll', height: "200px"}}>
        <GridComponent headers={this._renderHeaders} data={this._mapValueTasks()} modalTitle={modalTitle}/>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({tasks}) {
    return {
        tasks: tasks.sort(function(valueA, valueB){
          return valueA.fecha > valueB.fecha;
        })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTasks);
