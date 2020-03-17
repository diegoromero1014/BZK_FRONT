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
import {
    OPTION_MANAGER,
    OPTION_OTHERS,
    OPTION_ASSISTANTS,
    MANAGER,
    OTHER,
    ASSISTANT,
    SENIOR_BANKER_BACK_UP
} from './constants';
import {getClientTeam, saveSeniorBanker} from './actions';
import UserTeamCard from './userTeamCard';
import {showLoading} from '../loading/actions';
import {swtShowMessage} from '../sweetAlertMessages/actions';
import {Menu, Segment} from 'semantic-ui-react'
import {Checkbox} from "semantic-ui-react";
import {filterUsersBanco} from "../participantsVisitPre/actions";
import {consultInfoClient} from '../clientInformation/actions';



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

    handledChangeCheck = async (e, {checked}) => {
        const {saveSeniorBankerDispatch, showLoadingDispatch, swtShowMessageDispatch, dispatchConsultInfoClient} = this.props;
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
        const data = await saveSeniorBankerDispatch(checked);
        const status = data.payload.data.status;
        const validateLogin = data.payload.data.validateLogin;
        if(status === REQUEST_ERROR){
            swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
        }
        if (validateLogin === false) {
            swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
        }

        await dispatchConsultInfoClient(window.sessionStorage.getItem('idClientSelected'));
        showLoadingDispatch(false, MESSAGE_LOAD_DATA);

    };

    componentWillMount() {
        const {getClientTeamDispatch, showLoadingDispatch, swtShowMessageDispatch, filterUsersBancoDispatch, infoClient} = this.props;
        this.setState({
            teamManagers: [],
            teamOthers: [],
            teamAssistants: []
        });
        showLoadingDispatch(true, MESSAGE_LOAD_DATA);
        getClientTeamDispatch(window.sessionStorage.getItem('idClientSelected')).then((data) => {
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

                    filterUsersBancoDispatch(window.localStorage.getItem('userNameFront')).then((data) => {
                        let users = _.get(data, 'payload.data.data');
                        this.user = users.find(usr => usr.description.toLowerCase() === window.localStorage.getItem('userNameFront').toLowerCase());
                        const seniorBanker = this.state.teamManagers.find(seniorBankerTeam =>  seniorBankerTeam.id ===  this.user.idUsuario);
                        if(seniorBanker !== undefined && SENIOR_BANKER_BACK_UP !== seniorBanker.position && this.user.cargo === 'Banquero Senior'){
                            if (null === infoClient.seniorBankerId) {
                                this.setState({
                                    checkActive: false,
                                    checkDisable: false,
                                })
                            } else if (this.user.idUsuario === infoClient.seniorBankerId ) {
                                this.setState({
                                    checkActive: true,
                                    checkDisable: false,
                                    userSession: infoClient.seniorBanker
                                })
                            } else {
                                this.setState({
                                    checkActive: true,
                                    userSession: infoClient.seniorBanker
                                })
                            }
                        }else if(null !== infoClient.seniorBankerId){
                            this.setState({
                                checkActive: true,
                                userSession: infoClient.seniorBanker
                            })
                        }else{
                            this.setState({
                                checkActive: false,
                                userSession: infoClient.seniorBanker
                            })
                        }
                    })
                }
            }
        }, (reason) => {
            swtShowMessageDispatch('error', ERROR_MESSAGE_REQUEST_TITLE, ERROR_MESSAGE_REQUEST);
        });


    }

    render() {
        const {tabActive} = this.state;

        let label = '¿El cliente es gerenciado por un Banquero senior? ' + this.state.userSession;
        return (
            <div className="modalBt4-body modal-body business-content editable-form-content clearfix"
                 style={{overflow: "hidden"}}>
                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Checkbox
                            id="checkbox-banquero"
                            className="checkBankerSeniorDisable"
                            label={label}
                            style={{padding: "15px 10px 0px 20px"}}
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
        getClientTeamDispatch: getClientTeam,
        saveSeniorBankerDispatch: saveSeniorBanker,
        showLoadingDispatch: showLoading,
        swtShowMessageDispatch: swtShowMessage,
        filterUsersBancoDispatch: filterUsersBanco,
        dispatchConsultInfoClient: consultInfoClient
    }, dispatch);
}

function mapStateToProps({teamParticipantsReducer, clientInformacion}, ownerProps) {
    return {
        teamParticipantsReducer,
        infoClient: Object.assign({}, clientInformacion.get('responseClientInfo'))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentTeam);
