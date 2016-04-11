import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleModal} from './action';

class ModalComponentButton extends Component{
    render(){
      const {toggleModal} = this.props;
      return (<button onClick={toggleModal}>Click Me !!</button>);
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModal
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(ModalComponentButton);
