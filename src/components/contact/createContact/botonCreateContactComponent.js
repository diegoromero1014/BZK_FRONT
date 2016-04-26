import React, {
  Component
} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleModalContact} from './actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ModalComponentContact from './modalComponentContact';

class BotonCreateContactComponent extends Component {

  constructor(props){
      super(props);
  }

  render() {
    const {toggleModalContact} = this.props;
    return (
          <Col xs={2} sm={2} md={1} lg={1}>
          <button className="btn btn-primary" type="button" style={{float: "right"}} onClick={toggleModalContact}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button><ModalComponentContact/>
          </Col>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModalContact
  }, dispatch);
}

function mapStateToProps({createContactReducer}, ownerProps){
    return {
        createContactReducer
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateContactComponent);
