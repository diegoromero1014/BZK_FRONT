import React,{Component,PropTypes} from 'react';
import ModalComponentDialog from '../modal/component';

class ButtonModalComponent extends Component{
    render(){
      const {action} = this.props.action;
      return (<td><ModalComponentDialog/></td>);
    }
}



ButtonModalComponent.propTypes = {
   action: PropTypes.object
};

export default ButtonModalComponent;
