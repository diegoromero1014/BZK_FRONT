import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import Reports from './widgets/reports';
import TabAlerts from './widgets/alerts/alertSection'

import { getUsername } from './actions';
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
        <div className="ui segment" style={{ paddingLeft: 50, paddingRigth: 50, height: 'auto' }}>  
            <div style={{ color: "#7f7f7f" }}>
                <span style={{ fontStyle: "italic" }}>{MESSAGE_CONFIDENTIAL}</span>
            </div>
            <Row>
                <Col md={3}>
                    <div style={{ marginTop: 30, fontSize: 20, textTransform: 'capitalize' }}>
                        Bienvenid@ {getUsername().toLowerCase()}
                    </div>
                </Col>
                <Col mdOffset={8} md={1} >
                    <img src={'../../../img/icon/settings.png'} alt={'title'} style={{ fontSize: 40, marginLeft: '50px', marginTop: 30, cursor: 'pointer' }} />
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{ marginTop: 50 }}>
                    <Reports />
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{ marginTop: 50, marginBottom: 50 }}>
                    <h2 style={{marginBottom: "15px" , marginBottom: "10px"}}>Alertas</h2>
                    <TabAlerts />
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
