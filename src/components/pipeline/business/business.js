import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { clearBusiness } from './ducks';
import ListBusiness from './listBusiness';
import { ORIGIN_PIPELIN_BUSINESS } from '../constants';

class BusinessBusiness extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { businesss, disabled, origin } = this.props;
    return (
      <div style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "10px 10px 0px 20px" }}>
        <Col xs={12} md={12} lg={12}>
          <div style={{
            fontSize: "25px",
            color: "#CEA70B",
            marginTop: "5px",
            marginBottom: "5px"
          }}>
            <div className="tab-content-row" style={{
              borderTop: "1px dotted #cea70b",
              width: "99%",
              marginBottom: "10px"
            }} />
            <i className="browser icon" style={{ fontSize: "20px" }} />
            <span style={{ fontSize: "20px" }}> Negocios</span>
          </div>
        </Col>
        <div style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : {}}>
          <ListBusiness disabled={disabled} />
        </div>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearBusiness }, dispatch);
}

function mapStateToProps({ businesss }, ownerProps) {
  return {
    businesss
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessBusiness);
