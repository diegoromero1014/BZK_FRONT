import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {
    REQUEST_ERROR,
    ERROR_MESSAGE_REQUEST,
    ERROR_MESSAGE_REQUEST_TITLE,
    MESSAGE_LOAD_DATA
} from '../../constantsGlobal';
import {OPTION_MANAGER, OPTION_OTHERS, OPTION_ASSISTANTS, MANAGER, OTHER, ASSISTANT} from './constants';
import {getClientTeam} from './actions';
import UserTeamCard from './userTeamCard';
import {showLoading} from '../loading/actions';
import {swtShowMessage} from '../sweetAlertMessages/actions';
import {Menu, Segment} from 'semantic-ui-react'

class ModalComponentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamManagers: [],
            teamOthers: [],
            teamAssistants: [],
            tabActive: OPTION_ASSISTANTS
        };
    }

    _mapTeam(item, idx) {
        return <UserTeamCard
            key={idx}
            name={item.name}
            position={item.position}
            email={item.email}
            company={item.company}
            assistant={item.assistant}
        />
    }

    handleItemClick = (e, {name}) => this.setState({tabActive: name});

    componentWillMount() {
        const {getClientTeam, showLoading, swtShowMessage} = this.props;
        this.setState({
            teamManagers: [],
            teamOthers: [],
            teamAssistants: []
        });
        showLoading(true, MESSAGE_LOAD_DATA);
        getClientTeam(window.localStorage.getItem('idClientSelected')).then((data) => {
            const status = data.payload.data.status;
            const validateLogin = data.payload.data.validateLogin;
            showLoading(false, '');
            if (status === REQUEST_ERROR) {
                swtShowMessage('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
            } else {
                if (validateLogin === false) {
                    swtShowMessage('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
                } else {
                    const team = data.payload.data.data;
                    const teamManagersArray = _.orderBy(_.filter(team, ['employeeType', MANAGER]), ['positionOrder', 'name'], ['asc', 'asc']);
                    const teamOthersArray = _.orderBy(_.filter(team, ['employeeType', OTHER]), ['positionOrder', 'name'], ['asc', 'asc']);
                    const teamAssistantsArray = _.orderBy(_.filter(team, ['employeeType', ASSISTANT]), ['positionOrder', 'name'], ['asc', 'asc']);
                    this.setState({
                        teamManagers: teamManagersArray,
                        teamOthers: teamOthersArray,
                        teamAssistants: teamAssistantsArray
                    });
                }
            }
        }, (reason) => {
            swtShowMessage('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
        });
    }

    render() {
        const {tabActive} = this.state;
        return (
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                 style={{overflow: "hidden"}}>
                <Row style={{padding: "15px"}}>
                    <Col xs>
                        <Menu attached='top' tabular>
                            <Menu.Item name={OPTION_MANAGER} active={tabActive === OPTION_MANAGER} onClick={this.handleItemClick}/>
                            <Menu.Item name={OPTION_ASSISTANTS} active={tabActive === OPTION_ASSISTANTS} onClick={this.handleItemClick}/>
                            <Menu.Item name={OPTION_OTHERS} active={tabActive === OPTION_OTHERS} onClick={this.handleItemClick}/>
                        </Menu>
                        <Segment attached='bottom' style={{height: "370px", overflowY: "auto"}}>
                            {tabActive === OPTION_MANAGER &&
                            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                                <div className="news-page content">
                                    <div className="team-modal">
                                        {this.state.teamManagers.length === 0 ?
                                            <div style={{textAlign: "center", marginTop: "15px"}}>
                                                <h4 className="form-item">Señor usuario, no se encontraron gerentes.</h4>
                                            </div> :
                                            this.state.teamManagers.map(this._mapTeam)}
                                    </div>
                                </div>
                            </div>
                            }
                            {tabActive === OPTION_ASSISTANTS &&
                            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                                <div className="news-page content">
                                    <div className="team-modal">
                                        {this.state.teamAssistants.length === 0 ?
                                            <div style={{textAlign: "center", marginTop: "15px"}}>
                                                <h4 className="form-item">Señor usuario, no se encontraron asistentes.</h4>
                                            </div> :
                                            this.state.teamAssistants.map(this._mapTeam)}
                                    </div>
                                </div>
                            </div>
                            }
                            {tabActive === OPTION_OTHERS &&
                            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                                <div className="news-page content">
                                    <div className="team-modal">
                                        {this.state.teamOthers.length === 0 ?
                                            <div style={{textAlign: "center", marginTop: "15px"}}><h4
                                                className="form-item">
                                                Señor usuario, no se encontraron otros participantes.</h4></div> :
                                            this.state.teamOthers.map(this._mapTeam)}
                                    </div>
                                </div>
                            </div>
                            }
                        </Segment>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getClientTeam,
        showLoading,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({teamParticipantsReducer}, ownerProps) {
    return {
        teamParticipantsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentTeam);
