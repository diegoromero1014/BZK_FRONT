import React, {Component} from 'react';
import {ToastContainer} from 'react-toastr';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleMessage} from './actions';

class MessageComponent extends Component {
  render(){
    const {status, body} = this.props;
    return(
      <div style={{display: status === "opened" ? "block": "none"}}>
        <span>{body}</span>
      </div>
    );
  }

  componentDidMount(){
    const {toggleMessage, status} = this.props;
    if(status === "opened"){
        setTimeout(() => {
          toggleMessage("");
        }, 3000);
    }
  }
}

function mapStateToProps({message}){
  return {
    status: message.get('status'),
    body: message.get('body')
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleMessage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageComponent);
