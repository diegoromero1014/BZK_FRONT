import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {
    REQUEST_ERROR,
    ERROR_MESSAGE_REQUEST,
    ERROR_MESSAGE_REQUEST_TITLE,
    MESSAGE_LOAD_DATA
} from '../../constantsGlobal';
import {OPTION_MANAGER, OPTION_OTHERS, OPTION_ASSISTANTS, MANAGER, OTHER, ASSISTANT} from './constants';
import {getClientTeam, saveSeniorBanker} from './actions';
import UserTeamCard from './userTeamCard';
import {showLoading} from '../loading/actions';
import {swtShowMessage} from '../sweetAlertMessages/actions';
import {Menu, Segment} from 'semantic-ui-react'
import {Checkbox} from "semantic-ui-react";
import {filterUsersBanco} from "../participantsVisitPre/actions";



export class ModalComponentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamManagers: [],
            teamOthers: [],
            teamAssistants: [],
            tabActive: OPTION_MANAGER,
            checkActive: true,
            checkDisable: true,
            userSession: ""
        };
        this.user = null

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

    handledChangeCheck = (e, {checked}) => {
        const {saveSeniorBankerDispatch, showLoadingDispatch,swtShowMessageDispatch} = this.props;
        if (checked) {
            this.setState({
                checkActive: false,
                userSession: ""
            })
        } else if (this.user.cargo === 'Banquero Senior') {
            this.setState({
                checkActive: !this.state.checkActive,
                userSession: this.user.title
            })
        }
        showLoadingDispatch(true, MESSAGE_LOAD_DATA);
        saveSeniorBankerDispatch(checked).then((data) => {

            const status = data.payload.data.status;
            const validateLogin = data.payload.data.validateLogin;
            if(status === REQUEST_ERROR){
                swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
            }
            if (validateLogin === false) {
                swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
            }
            showLoadingDispatch(false, MESSAGE_LOAD_DATA);
        });

    };

    componentWillMount() {
        const {getClientTeam, showLoadingDispatch, swtShowMessageDispatch, filterUsersBancoDispatch, infoClient} = this.props;
        this.setState({
            teamManagers: [],
            teamOthers: [],
            teamAssistants: []
        });
        showLoadingDispatch(true, MESSAGE_LOAD_DATA);
        getClientTeam(window.sessionStorage.getItem('idClientSelected')).then((data) => {
            const status = data.payload.data.status;
            const validateLogin = data.payload.data.validateLogin;
            showLoadingDispatch(false, '');
            if (status === REQUEST_ERROR) {
                swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
            } else {
                if (validateLogin === false) {
                    swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
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
            swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
        });

        filterUsersBancoDispatch(window.localStorage.getItem('userNameFront')).then((data) => {
            let users = _.get(data, 'payload.data.data');
            this.user = users.find(usr => usr.description === window.localStorage.getItem('userNameFront'));

            if (null === infoClient.seniorBankerId && this.user.cargo === 'Banquero Senior') {
                this.setState({
                    checkActive: false,
                    checkDisable: false,
                })
            } else if (this.user.idUsuario === infoClient.seniorBankerId && this.user.cargo === 'Banquero Senior') {
                this.setState({
                    checkActive: true,
                    checkDisable: false,
                    userSession: infoClient.seniorBanker
                })
            } else {
                this.setState({
                    checkActive: false,
                    userSession: infoClient.seniorBanker
                })
            }
        })
    }

    render() {
        const {tabActive} = this.state; 

        let label = 'El cliente es gerenciado por un Banquero senior : ' + this.state.userSession;
        return (
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                 style={{overflow: "hidden"}}>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Checkbox
                            id="checkbox-banquero"
                            label={label}
                            readOnly={false}
                            style={{padding: "15px 10px 0px 20px", backgroundColor: '#ffffff '}}
                            checked={this.state.checkActive}
                            disabled={this.state.checkDisable}
                            onClick={this.handledChangeCheck}
                            toggle
                        />
                    </Col>
                </Row>
                <Row style={{padding: "15px"}}>
                    <Col xs>
                        <Menu attached='top' tabular>
                            <Menu.Item name={OPTION_MANAGER} active={tabActive === OPTION_MANAGER}
                                       onClick={this.handleItemClick}/>
                            <Menu.Item name={OPTION_ASSISTANTS} active={tabActive === OPTION_ASSISTANTS}
                                       onClick={this.handleItemClick}/>
                            <Menu.Item name={OPTION_OTHERS} active={tabActive === OPTION_OTHERS}
                                       onClick={this.handleItemClick}/>
                        </Menu>
                        <Segment attached='bottom' style={{height: "370px", overflowY: "auto"}}>
                            {tabActive === OPTION_MANAGER &&
                            <div className="horizontal-scroll-wrapper" style={{overflow: 'hidden', background: '#fff'}}>
                                <div className="news-page content">
                                    <div className="team-modal">
                                        {this.state.teamManagers.length === 0 ?
                                            <div style={{textAlign: "center", marginTop: "15px"}}>
                                                <h4 className="form-item">Señor usuario, no se encontraron
                                                    gerentes.</h4>
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
                                                <h4 className="form-item">Señor usuario, no se encontraron
                                                    asistentes.</h4>
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
        saveSeniorBankerDispatch: saveSeniorBanker,
        showLoadingDispatch: showLoading,
        swtShowMessageDispatch: swtShowMessage,
        filterUsersBancoDispatch: filterUsersBanco,
    }, dispatch);
}

function mapStateToProps({teamParticipantsReducer, clientInformacion}, ownerProps) {
    return {
        teamParticipantsReducer,
        infoClient: Object.assign({}, clientInformacion.get('responseClientInfo'))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentTeam);
