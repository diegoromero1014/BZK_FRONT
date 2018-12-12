import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import Shareholder from './shareholder/component';
import BoardMembers from './boardMembers/component';

import { validateResponse } from '../../../actionsGlobal';
import { consultModulesAccess } from '../../navBar/actions';
import { updateTabSeletedPartners } from './actions';
import { showLoading } from '../../loading/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';

import { TAB_BOARD_MEMBERS, TAB_SHAREHOLDER } from './constants';
import {
    MODULE_SHAREHOLDERS, MODULE_BOARD_MEMBERS, MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT,
    MESSAGE_ERROR_SWEET_ALERT
} from '../../../constantsGlobal';

class TabComponent extends Component {

    constructor(props) {
        super(props);
    }

    _handleItemClick(module) {
        this.props.updateTabSeletedPartners(module);
    }

    componentWillMount() {
        const { consultModulesAccess, showLoading, swtShowMessage } = this.props;
        showLoading(true, MESSAGE_LOAD_DATA);
        consultModulesAccess().then((data) => {
            showLoading(false, "");
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            }
        }, (reason) => {
            showLoading(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    componentWillUnmount() {
        this.props.updateTabSeletedPartners(null);
    }

    render() {
        const { navBar, tabPartners } = this.props;
        let tabActive = tabPartners.get('tabSelected');
        if (_.isNull(tabActive)) {
            if (_.get(navBar.get('mapModulesAccess'), MODULE_SHAREHOLDERS)) {
                tabActive = TAB_SHAREHOLDER;
            } else if (_.get(navBar.get('mapModulesAccess'), MODULE_BOARD_MEMBERS)) {
                tabActive = TAB_BOARD_MEMBERS;
            }
        }

        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
                <div className="tab-pane quickZoomIn animated"
                    style={{ width: "100%", marginBottom: "70px" }}>
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
                                {
                                    _.get(navBar.get('mapModulesAccess'), MODULE_SHAREHOLDERS) &&
                                    < Menu.Item name="Accionistas" active={tabActive === TAB_SHAREHOLDER}
                                        onClick={this._handleItemClick.bind(this, TAB_SHAREHOLDER)}
                                    />
                                }
                                {
                                    _.get(navBar.get('mapModulesAccess'), MODULE_BOARD_MEMBERS) &&
                                    <Menu.Item name="Miembros de junta" active={tabActive === TAB_BOARD_MEMBERS}
                                        onClick={this._handleItemClick.bind(this, TAB_BOARD_MEMBERS)}
                                    />
                                }
                            </Menu>
                            <Segment>
                                {
                                    _.get(navBar.get('mapModulesAccess'), MODULE_SHAREHOLDERS) &&
                                    tabActive === TAB_SHAREHOLDER && <Shareholder />
                                }
                                {
                                    _.get(navBar.get('mapModulesAccess'), MODULE_BOARD_MEMBERS) &&
                                    tabActive === TAB_BOARD_MEMBERS && <BoardMembers />
                                }
                            </Segment>
                        </div>
                    }
                </div>
            </div >
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultModulesAccess,
        updateTabSeletedPartners,
        showLoading,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({ navBar, tabPartners }, ownerProps) {
    return {
        navBar,
        tabPartners
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabComponent);