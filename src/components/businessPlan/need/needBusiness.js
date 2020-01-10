import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import ListNeed from './listNeed';
import { clearNeed } from './actions';

class NeedBusiness extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { clearNeed } = this.props;
    clearNeed();
  }

  render() {
    const { needs, disabled } = this.props;
    return (
      <div className="my-custom-tab"
        style={{ backgroundColor: "#FFFFFF", width: "100%" }}>
        <Row style={{ padding: "20px 23px 20px 20px" }}>
          <Col xs={12} md={12} lg={12}>
            <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
              <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
              <i className="table icon" style={{ fontSize: "18px" }} />
              <span style={{ fontSize: "20px" }}> Necesidades </span>
            </div>
          </Col>
        </Row>
        <Row style={{ padding: "0px 23px 10px 20px" }}>
          <Col xs>
            <ListNeed disabled={disabled} />
          </Col>
        </Row>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearNeed
  }, dispatch);
}

function mapStateToProps({ needs }, ownerProps) {
  return {
    needs
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NeedBusiness);