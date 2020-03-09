import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import Reports from './widgets/reports';
import Header from './header';

import { updateTitleNavBar } from '../navBar/actions';

import { MESSAGE_CONFIDENTIAL } from './constants';

export class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  componentWillMount() {
    const { dispatchUpdateTitleNavBar } = this.props;
    dispatchUpdateTitleNavBar("Dashboard");
  }

  render() {
    return (
        <div className="ui segment" style={{ paddingLeft: 50, paddingRigth: 50, height: '100%' }}>  
            <div style={{ color: "#7f7f7f" }}>
                <span style={{ fontStyle: "italic" }}>{MESSAGE_CONFIDENTIAL}</span>
            </div>
            <Header />
            <Row>
                <Col md={12} style={{ marginTop: 50 }}>
                    <Reports />
                </Col>
            </Row>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatchUpdateTitleNavBar: updateTitleNavBar,
  }, dispatch);
}

function mapStateToProps({ }, ownerProps) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
