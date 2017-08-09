import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { Menu, Segment } from 'semantic-ui-react';
import { TAB_BOARD_MEMBERS, TAB_SHAREHOLDER } from './constants';
import Shareholder from './shareholder/component';
import BoardMembers from './boardMembers/component';
import _ from 'lodash';
import moment from 'moment';
import { MODULE_SHAREHOLDERS, MODULE_BOARD_MEMBERS } from '../../../constantsGlobal';

class TabComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabActive: TAB_SHAREHOLDER
        };
    }

    _handleItemClick(module) {
        this.setState({
            tabActive: module
        });
    }

    componentWillMount() {
        const { navBar } = this.props;
        if (_.get(navBar.get('mapModulesAccess'), MODULE_SHAREHOLDERS)) {
            this.setState({
                tabActive: TAB_SHAREHOLDER
            });
        } else {
            this.setState({
                tabActive: TAB_BOARD_MEMBERS
            });
        }
    }

    render() {
        const { navBar } = this.props;
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
                <div className="tab-pane quickZoomIn animated"
                    style={{ width: "100%", marginBottom: "70px" }}>
                    <Menu pointing secondary>
                        {_.get(navBar.get('mapModulesAccess'), MODULE_SHAREHOLDERS) &&
                            < Menu.Item name="Accionistas" active={this.state.tabActive === TAB_SHAREHOLDER} onClick={this._handleItemClick.bind(this, TAB_SHAREHOLDER)} />
                        }
                        {_.get(navBar.get('mapModulesAccess'), MODULE_BOARD_MEMBERS) &&
                            <Menu.Item name="Miembros de junta" active={this.state.tabActive === TAB_BOARD_MEMBERS} onClick={this._handleItemClick.bind(this, TAB_BOARD_MEMBERS)} />
                        }
                    </Menu>
                    <Segment>
                        {this.state.tabActive === TAB_SHAREHOLDER && <Shareholder />}
                        {this.state.tabActive === TAB_BOARD_MEMBERS && <BoardMembers />}
                    </Segment>
                </div>
            </div >
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({ navBar }, ownerProps) {
    return {
        navBar
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabComponent);