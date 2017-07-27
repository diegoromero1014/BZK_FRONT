import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Menu, Segment} from 'semantic-ui-react';
import {MODULE_COVENANTS, MODULE_AEC, MODULE_QUALITATIVE_VARIABLES} from '../../constantsGlobal';
import {consultModulesAccess} from '../navBar/actions';
import ListCovenant from './covenants/listCovenants';
import ListAEC from './AEC/listAEC';
import {TAB_COVENANTS, TAB_AEC, TAB_QUALITATIVE_VARIABLE} from './constants';
import {updateTabSeletedRisksManagment} from './actions';
import ComponentSurvey from './qualitativeVariable/componentSurvey';
import _ from 'lodash';

class RisksManagementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCovenants: true,
            viewAEC: false
        };
    }

    _handleItemClick(module) {
        const {updateTabSeletedRisksManagment} = this.props;
        updateTabSeletedRisksManagment(module);
    }

    componentWillMount() {
        const {consultModulesAccess} = this.props;
        consultModulesAccess();
    }

    render() {
        const {navBar, tabRisksManagment} = this.props;
        let tabActive = tabRisksManagment.get('tabSelected');
        if (tabActive === null || tabActive === undefined || tabActive === "") {
            if (_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS)) {
                tabActive = TAB_COVENANTS;
            } else if (_.get(navBar.get('mapModulesAccess'), MODULE_AEC)) {
                tabActive = TAB_AEC;
            } else if (_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES)) {
                tabActive = TAB_QUALITATIVE_VARIABLE;
            }
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                 style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
                <Menu pointing secondary>
                    {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) &&
                    <Menu.Item name={MODULE_COVENANTS} active={tabActive === TAB_COVENANTS}
                               onClick={this._handleItemClick.bind(this, TAB_COVENANTS)}/>
                    }
                    {_.get(navBar.get('mapModulesAccess'), MODULE_AEC) &&
                    <Menu.Item name={MODULE_AEC} active={tabActive === TAB_AEC}
                               onClick={this._handleItemClick.bind(this, TAB_AEC)}/>
                    }
                    {_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES) &&
                    <Menu.Item name={MODULE_QUALITATIVE_VARIABLES} active={tabActive === TAB_QUALITATIVE_VARIABLE}
                               onClick={this._handleItemClick.bind(this, TAB_QUALITATIVE_VARIABLE)}/>
                    }
                </Menu>
                <Segment>
                    {_.get(navBar.get('mapModulesAccess'), MODULE_COVENANTS) && tabActive === TAB_COVENANTS &&
                    <ListCovenant />}
                    {_.get(navBar.get('mapModulesAccess'), MODULE_AEC) && tabActive === TAB_AEC && <ListAEC />}
                    {_.get(navBar.get('mapModulesAccess'), MODULE_QUALITATIVE_VARIABLES) && tabActive === TAB_QUALITATIVE_VARIABLE &&
                    <ComponentSurvey />}
                </Segment>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultModulesAccess,
        updateTabSeletedRisksManagment
    }, dispatch);
}

function mapStateToProps({navBar, tabRisksManagment}, ownerProps) {
    return {
        navBar,
        tabRisksManagment
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RisksManagementComponent);
