import React,{Component,PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleModal} from './action';
import ModalComponentDialog from './modalComponent';

class ModalComponentButton extends Component{

  constructor(props){
      super(props);
  }

    render(){
      const {toggleModal} = this.props;
      const modalTitle = this.props.modalTitle;
      const actions = this.props.actions;
      return (<td style={{padding: '10px', textAlign: 'center'}}><button className="btn btn-primary btn-sm" onClick={toggleModal}>
          <i className="search icon" style={{margin:"0px"}}/>
        </button><ModalComponentDialog modalTitle={modalTitle} actions={actions}/></td>);
    }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModal
  }, dispatch);
}

ModalComponentButton.propTypes = {
   actions: PropTypes.object,
   modalTitle: PropTypes.string
};


export default connect(null, mapDispatchToProps)(ModalComponentButton);
