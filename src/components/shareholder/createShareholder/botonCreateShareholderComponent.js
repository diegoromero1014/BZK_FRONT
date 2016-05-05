import React, {
  Component
} from 'react';
import {toggleModalShareholder} from './actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import ModalComponentShareholder from './modalComponentShareholder';

class BotonCreateShareholderComponent extends Component {

  constructor(props){
      super(props);
  }

  render() {
    const {toggleModalShareholder} = this.props;
    return (
          <Col xs={2} sm={2} md={1} lg={1}>
          <button className="btn btn-primary" type="button" title="Crear accionista" style={{float: "right"}} onClick={toggleModalShareholder}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button><ModalComponentShareholder />
          </Col>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    toggleModalShareholder
  }, dispatch);
}

function mapStateToProps({createShareholder}, ownerProps){
    return {
        createShareholder
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(BotonCreateShareholderComponent);
