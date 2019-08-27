import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Menu, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import ListCovenant from './covenants/listCovenants';
import ListAEC from './AEC/listAEC';
import ComponentSurvey from './qualitativeVariable/componentSurvey';

import { validateResponse, validatePermissionsByModule } from '../../actionsGlobal';
import { consultModulesAccess } from '../navBar/actions';
import { updateTabSeletedRisksManagment } from './actions';
import { getAllowSurveyQualitativeVarible } from './qualitativeVariable/actions';
import { showLoading } from '../loading/actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

import { executePromiseIf } from '../../utils/catchRequest';

import { TAB_COVENANTS, TAB_AEC, TAB_QUALITATIVE_VARIABLE } from './constants';
import {
    MODULE_COVENANTS, MODULE_AEC, MODULE_QUALITATIVE_VARIABLES, MESSAGE_LOAD_DATA,
    TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT
} from '../../constantsGlobal';


class RisksManagementComponent extends Component {
    constructor(props) {
        super(props);
    }

    _handleItemClick(module) {
        this.props.updateTabSeletedRisksManagment(module);
    }

    componentWillMount() {
        const { consultModulesAccess, getAllowSurveyQualitativeVarible, clientInformacion, showLoading, swtShowMessage, navBar } = this.props;
        const infoClient = clientInformacion.get('responseClientInfo');
        getAllowSurveyQualitativeVarible(infoClient.id);
        showLoading(true, MESSAGE_LOAD_DATA);
        
        executePromiseIf(
            navBar.get("mapModulesAccess"),
            consultModulesAccess
        )

    }

    componentWillUnmount() {
        this.props.updateTabSeletedRisksManagment(null);
    }

    render() {
        const { navBar, tabRisksManagment, qualitativeVariableReducer } = this.props;
        let tabActive = tabRisksManagment.get('tabSelected');
        let allowQualitativeVariable = qualitativeVariableReducer.get('allowSurveyQualitative');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            if (_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS)) {
                tabActive = TAB_COVENANTS;
            } else if (_.get(navBar.get('mapModulesAccess'), MODULE_AEC)) {
                tabActive = TAB_AEC;
            } else if (_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES) && allowQualitativeVariable) {
                tabActive = TAB_QUALITATIVE_VARIABLE;
            }
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
                {tabActive == null ?
                    <Grid style={{ width: "100%" }}>
                        <Row center="xs">
                            <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '30px' }}>
                                <span style={{ fontWeight: 'bold', color: '#4C5360' }}>Señor usuario, no tiene acceso a los módulos de esta pestaña</span>
                            </Col>
                        </Row>
                    </Grid>
                    :
                    <div>
                        <Menu pointing secondary>
                            {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) &&
                                <Menu.Item name={MODULE_COVENANTS} active={tabActive === TAB_COVENANTS}
                                    onClick={this._handleItemClick.bind(this, TAB_COVENANTS)} />
                            }
                            {_.get(navBar.get('mapModulesAccess'), MODULE_AEC) &&
                                <Menu.Item name={MODULE_AEC} active={tabActive === TAB_AEC}
                                    onClick={this._handleItemClick.bind(this, TAB_AEC)} />
                            }
                            {_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES) && allowQualitativeVariable &&
                                <Menu.Item name={MODULE_QUALITATIVE_VARIABLES} active={tabActive === TAB_QUALITATIVE_VARIABLE}
                                    onClick={this._handleItemClick.bind(this, TAB_QUALITATIVE_VARIABLE)} />
                            }
                        </Menu>
                        <Segment>
                            {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) && tabActive === TAB_COVENANTS &&
                                <ListCovenant />}
                            {_.get(navBar.get('mapModulesAccess'), MODULE_AEC) && tabActive === TAB_AEC && <ListAEC />}
                            {_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES) && tabActive === TAB_QUALITATIVE_VARIABLE && allowQualitativeVariable &&
                                <ComponentSurvey />}
                        </Segment>
                    </div>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultModulesAccess,
        updateTabSeletedRisksManagment,
        getAllowSurveyQualitativeVarible,
        showLoading,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ navBar, tabRisksManagment, qualitativeVariableReducer, clientInformacion, reducerGlobal }, ownerProps) {
    return {
        navBar,
        tabRisksManagment,
        qualitativeVariableReducer,
        clientInformacion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RisksManagementComponent);