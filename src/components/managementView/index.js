import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import SecurityMessageComponent from '../globalComponents/securityMessageComponent';
import Reports from './widgets/reports';
import Header from './header';

import { updateTitleNavBar } from '../navBar/actions';

export class ManagementView extends Component {

  componentWillMount() {

    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { dispatchUpdateTitleNavBar } = this.props;
      dispatchUpdateTitleNavBar("Vista gerencial");
    }
  }

  render() {
    return (
        <div className="ui segment" style={{ paddingLeft: 50, paddingRigth: 50, height: '100%' }}>  
            <SecurityMessageComponent />
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

export default connect(null, mapDispatchToProps)(ManagementView);