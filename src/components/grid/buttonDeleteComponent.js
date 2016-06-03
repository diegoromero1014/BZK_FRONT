import React,{Component,PropTypes} from 'react';
import SweetAlert from 'sweetalert-react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteServer} from './actions';
import {contactsByClientFindServer,clearContactCreate,clearContactOrder} from '../contact/actions';
import {shareholdersByClientFindServer,clearShareholderCreate,clearShareholderOrder} from '../shareholder/actions';
import {NUMBER_RECORDS,DELETE_TYPE_CONTACT,DELETE_TYPE_SHAREHOLDER, DELETE_PARTICIPANT_VIEW, DELETE_TASK_VIEW} from './constants';
import {deleteParticipant} from '../participantsVisitPre/actions';
import {deleteTask} from '../visit/createVisit/tasks/actions';

class ButtonDeleteComponent extends Component{

  constructor(props){
      super(props);
      this.state = {
       show: false,
       showEx:false,
       showEr:false
     };
     this._onConfirmDelete = this._onConfirmDelete.bind(this);
     this._closeDelete = this._closeDelete.bind(this);
  }

  _onConfirmDelete(){
    console.log("_onConfirmDelete");
    const {actionsDelete, deleteServer, participants, tasks} = this.props;
    if(actionsDelete.typeDelete !== DELETE_PARTICIPANT_VIEW && actionsDelete.typeDelete !== DELETE_TASK_VIEW){
      deleteServer(actionsDelete.urlServer,actionsDelete.json,actionsDelete.typeDelete).then((data) => {
        if((_.get(data, 'payload.status') === 200)){
            this.setState({showEx: true});
          } else {
            this.setState({showEr: true});
        }
        }, (reason) => {
          this.setState({showEr: true});
      });
    } else {
      if(actionsDelete.typeDelete === DELETE_PARTICIPANT_VIEW){
        this.setState({show: false});
        const {deleteParticipant} = this.props;
        var indexDelete = participants.findIndex(function(item){
          return item.idParticipante === actionsDelete.id;
        });
        deleteParticipant(indexDelete);
      }else{
        if(actionsDelete.typeDelete === DELETE_TASK_VIEW){
          this.setState({show: false});
          const {deleteTask} = this.props;
          var indexDelete = tasks.findIndex(function(item){
            return item.uuid === actionsDelete.id;
          });
          deleteTask(indexDelete);
        }
      }
    }
  }

  _closeDelete(){
      const {contactsByClientFindServer,actionsDelete,clearContactCreate,clearContactOrder,clearShareholderCreate,clearShareholderOrder,shareholdersByClientFindServer} = this.props;
      if(this.state.showEx == true){
        if(actionsDelete.typeDelete === DELETE_TYPE_CONTACT){
          clearContactCreate();
          clearContactOrder();
          contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
          "",
          "",
          "");
        }else if(actionsDelete.typeDelete === DELETE_TYPE_SHAREHOLDER){
            clearShareholderCreate();
            clearShareholderOrder();
            shareholdersByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"sh.sharePercentage",1,"","");
          }
      }
      this.setState({showEx:false, showEr: false,show: false});
  }

  render(){
    const {actionsDelete,deleteGridReducer} = this.props;
    return (
    <td style={{padding: '10px', textAlign: 'center'}}>
      <button onClick={() => this.setState({ show: true })} className="btn btn-sm  btn-danger">
        <i style={{margin:'0em', fontSize : '1.2em'}} className="trash outline icon"></i>
      </button>
          <SweetAlert
            type= "warning"
            show={this.state.show}
            title="Confirmación eliminación"
            confirmButtonColor= '#DD6B55'
            confirmButtonText= 'Sí, estoy seguro!'
            cancelButtonText = "Cancelar"
            text={actionsDelete.mensaje}
            showCancelButton= {true}
            onCancel= {() => this.setState({show: false })}
            onConfirm={() => this._onConfirmDelete()}/>
          <SweetAlert
           type= "success"
           show={this.state.showEx}
           title="Eliminado"
           onConfirm={() => this._closeDelete()}
           />
           <SweetAlert
            type= "error"
            show={this.state.showEr}
            title="Error"
            text="Señor usuario, se presento un error al realizar la eliminación."
            onConfirm={() => this._closeDelete()}
            />
      </td>);
    }
}

ButtonDeleteComponent.propTypes = {
   actionsDelete: PropTypes.object
};


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteServer,contactsByClientFindServer,clearContactCreate,
    shareholdersByClientFindServer,clearShareholderCreate,clearShareholderOrder,clearContactOrder,
    deleteParticipant,
    deleteTask
  }, dispatch);
}

function mapStateToProps({deleteGridReducer, participants, tasks}, ownerProps) {
  return {
    deleteGridReducer,
    participants,
    tasks
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteComponent);
