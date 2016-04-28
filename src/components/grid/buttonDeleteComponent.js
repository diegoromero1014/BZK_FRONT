import React,{Component,PropTypes} from 'react';
import SweetAlert from 'sweetalert-react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteServer} from './actions';
import {contactsByClientFindServer} from '../contact/actions';
import {NUMBER_RECORDS,DELETE_TYPE_CONTACT} from './constants';

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
      const {actionsDelete,deleteServer} = this.props;
      deleteServer(actionsDelete.urlServer,actionsDelete.json,actionsDelete.typeDelete).then((data) => {
        if((_.get(data, 'payload.status') === 200)){
            this.setState({showEx: true});
          } else {
            this.setState({showEr: true});
        }
        }, (reason) => {
          this.setState({showEr: true});
      });
    }

    _closeDelete(){
        const {contactsByClientFindServer,actionsDelete} = this.props;
        if(this.state.showEx == true){
          if(actionsDelete.typeDelete === DELETE_TYPE_CONTACT){
            contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
            "",
            "",
            "");
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
             title="Elimininado"
             onConfirm={() => this._closeDelete()}
             />
             <SweetAlert
              type= "error"
              show={this.state.showEr}
              title="Error"
              text="Se presento un error al realizar la eliminación"
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
    deleteServer,contactsByClientFindServer
  }, dispatch);
}

function mapStateToProps({deleteGridReducer}, ownerProps) {
  return {
    deleteGridReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeleteComponent);
