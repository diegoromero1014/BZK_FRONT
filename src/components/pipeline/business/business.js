import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {clearBusiness} from './ducks';
import ListBusiness from './listBusiness';
import {ORIGIN_PIPELIN_BUSINESS} from '../constants';

class BusinessBusiness extends Component{

  constructor(props) {
    super(props);
  }

  render(){
    const {businesss, disabled, origin} = this.props;
    return(
      <div style={origin === ORIGIN_PIPELIN_BUSINESS ? {display:"none"} : {padding: "0px 10px 20px 20px"}}>
        <ListBusiness disabled={disabled}/>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({clearBusiness}, dispatch);
}

function mapStateToProps({businesss}, ownerProps){
    return {
      businesss
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessBusiness);
