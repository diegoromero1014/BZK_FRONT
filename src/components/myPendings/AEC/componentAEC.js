import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { updateTitleNavBar } from '../../navBar/actions';
import { getAECForEmployee } from './actions';
import _ from 'lodash';
import { validateResponse } from '../../../actionsGlobal';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT } from '../../../constantsGlobal';
import ListAEC from './listAEC';
import PaginationAEC from './paginationAEC';
import { NUMBER_RECORDS } from './constants';

class ComponentAEC extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    const { updateTitleNavBar, getAECForEmployee, swtShowMessage } = this.props;
    updateTitleNavBar("AEC");
    getAECForEmployee(0, NUMBER_RECORDS).then((data) => {
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      }
    }, (reason) => {
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  render() {
    const { AECMyPendings } = this.props;
    const listAEC = AECMyPendings.get('AECList');
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if (AECMyPendings.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
        <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
          <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
            <Col style={{ width: '100%' }}>
              <ListAEC listAEC={listAEC} />
              <div style={{ marginBottom: '10px' }}>
                <PaginationAEC />
              </div>
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado AEC activos</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTitleNavBar,
    getAECForEmployee,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ AECMyPendings }, ownerProps) {
  return {
    AECMyPendings
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentAEC);
