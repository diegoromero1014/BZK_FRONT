import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { updateTitleNavBar } from '../../navBar/actions';
import _ from 'lodash';
import { NUMBER_RECORDS } from './constants';
import { changeStateSaveData } from '../../dashboard/actions';
import Tooltip from "../../toolTip/toolTipComponent";
import ListLinkingRequests from './listLinkingRequests';
import { getLinkRequests, limitInf, changePage } from './actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import PaginationLinkingRequests from './paginationLinkingRequests';
import { validatePermissionsByModule } from '../../../actionsGlobal';
import { MODULE_CLIENTS } from '../../../constantsGlobal';

class ComponentAssigned extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const { updateTitleNavBar, validatePermissionsByModule } = this.props;
        updateTitleNavBar("Solicitudes de vinculación");
        validatePermissionsByModule(MODULE_CLIENTS);
    }

    render() {
        const { linkRequestsReducer, getLinkRequests, swtShowMessage, changePage, limitInf,
            changeStateSaveData, reducerGlobal } = this.props;
        const listLinkRequests = linkRequestsReducer.get('listLinkRequests');
        let visibleTable = 'none';
        let visibleMessage = 'block';
        if (linkRequestsReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
                    <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                        <Col style={{ width: '100%' }}>
                            <ListLinkingRequests linkRequestsReducer={linkRequestsReducer}
                                getLinkRequests={getLinkRequests} swtShowMessage={swtShowMessage}
                                changeStateSaveData={changeStateSaveData}
                                reducerGlobal={reducerGlobal} />
                            <div style={{ marginBottom: '10px' }}>
                                <PaginationLinkingRequests linkRequestsReducer={linkRequestsReducer}
                                    getLinkRequests={getLinkRequests} swtShowMessage={swtShowMessage}
                                    changePage={changePage} limitInf={limitInf}
                                    changeStateSaveData={changeStateSaveData} />
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Grid style={{ display: visibleMessage, width: "100%" }}>
                    <Row center="xs">
                        <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado solicitudes de vinculación</span>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLinkRequests,
        swtShowMessage,
        updateTitleNavBar,
        limitInf,
        changePage,
        changeStateSaveData,
        validatePermissionsByModule
    }, dispatch);
}

function mapStateToProps({ linkRequestsReducer, reducerGlobal }, ownerProps) {
    return {
        linkRequestsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentAssigned);
