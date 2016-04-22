import React,{Component,PropTypes} from 'react';
import SweetAlert from 'sweetalert-react';

class ButtonDeleteComponent extends Component{

  constructor(props){
      super(props);
      this.state = {
       show: false,
       showD:false
     };
     //this._onConfirmDelete = this._onConfirmDelete.bind(this);
  }

  _onConfirmDelete(){
    this.setState({showD:false,show: false});
  }

    render(){
      const {actionsDelete} = this.props;
      return (
      <td style={{padding: '10px', textAlign: 'center'}}>

      <button onClick={() => this.setState({ show: true })} className="btn btn-sm  btn-danger">
          <span className="icon icon-delete">
          </span>
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
          onConfirm={() => this.setState({showD:true})}
          />
          <SweetAlert
           type= "success"
           show={this.state.showD}
           title="Elimininado"
           onConfirm={() => this._onConfirmDelete()}
           />
        </td>);
    }
}

ButtonDeleteComponent.propTypes = {
   actionsDelete: PropTypes.object
};


export default ButtonDeleteComponent;
