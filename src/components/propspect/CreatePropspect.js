import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class CreatePropsPect extends Component{
  constructor( props ) {
    super(props);
  }

  componentWillMount(){
    if( window.localStorage.getItem('sessionToken') === "" ){
      redirectUrl("/login");
    }
  }

  render(){
    return (
      <div style={{width: "100%", marginTop: "10px", marginBottom: "70px"}}>
        <p>Prospecto</p>
      </div>
    );
  }

}


export default CreatePropsPect
