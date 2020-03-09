import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import SearchBoardMembers from './searchBoardMembers';
import { getBoardMembers, clearFilters, changeKeyword } from './actions';
import { NUMBER_RECORDS, LOWER_INITIAL_LIMIT } from './constants';
import {
    MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
    CREAR, MODULE_BOARD_MEMBERS
} from '../../../../constantsGlobal';
import { validateResponse, validatePermissionsByModule } from '../../../../actionsGlobal';
import { changeStateSaveData } from '../../../main/actions';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import _ from 'lodash';
import { getMasterDataFields } from '../../../selectsComponent/actions';
import * as constantsSelects from '../../../selectsComponent/constants';
import ListBoardMembers from './listBoardMembers';
import PaginationBoardMembers from './paginationBoardMembers';
import AlertWithoutPermissions from '../../../globalComponents/alertWithoutPermissions';
import BtnCreateBoardMembers from './createEditBoardMembers/btnCreateBoardMembers';
import { nombreflujoAnalytics, _BOARDMEMBERS, BIZTRACK_MY_CLIENTS } from '../../../../constantsAnalytics';

class ComponentBoardMembers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openMessagePermissions: false
        };
    }

    componentWillMount() {
        window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_MY_CLIENTS + _BOARDMEMBERS,
            'pagina':_BOARDMEMBERS

          });
        const { boardMembersReducer, getBoardMembers, changeStateSaveData, swtShowMessage, getMasterDataFields,
            validatePermissionsByModule, clearFilters, changeKeyword } = this.props;
        var idClient = window.sessionStorage.getItem('idClientSelected');
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        clearFilters();
        changeKeyword('');
        validatePermissionsByModule(MODULE_BOARD_MEMBERS).then((data) => {
            if (!validateResponse(data)) {
                swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            } else {
                if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                    this.setState({
                        openMessagePermissions: true
                    });
                } else {
                    getBoardMembers(idClient, LOWER_INITIAL_LIMIT, NUMBER_RECORDS, '').then((data) => {
                        if (!validateResponse(data)) {
                            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                        }
                        changeStateSaveData(false, "");
                    }, (reason) => {
                        changeStateSaveData(false, "");
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    });
                    getMasterDataFields([constantsSelects.CONTACT_ID_TYPE]).then((data) => {
                    }, (reason) => {
                        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                    });
                }
            }
        }, (reason) => {
            changeStateSaveData(false, "");
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    render() {
        const { boardMembersReducer, reducerGlobal } = this.props;
        const listBoardMembers = boardMembersReducer.get('boardMembers');
        var visibleTable = 'none';
        var visibleMessage = 'block';
        if (boardMembersReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }
        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginBottom: "70px" }}>
                <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial' }}>
                    <Grid style={{ width: "100%" }}>
                        <Row>
                            <Col xs={10} sm={10} md={11} lg={11}>
                                <SearchBoardMembers />
                            </Col>
                            {_.get(reducerGlobal.get('permissionsBoardMembers'), _.indexOf(reducerGlobal.get('permissionsBoardMembers'), CREAR), false) &&
                                <BtnCreateBoardMembers />
                            }
                        </Row>
                    </Grid>
                </div>
                <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px' }}>
                    <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
                        <Col style={{ width: '100%' }}>
                            <ListBoardMembers listBoardMembers={listBoardMembers} />
                            <div style={{ marginBottom: '10px' }}>
                                <PaginationBoardMembers />
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Grid style={{ display: visibleMessage, width: "100%" }}>
                    <Row center="xs">
                        <Col xs={12} sm={8} md={12} lg={12}><span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span></Col>
                    </Row>
                </Grid>
                <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBoardMembers,
        changeStateSaveData,
        swtShowMessage,
        getMasterDataFields,
        validatePermissionsByModule,
        clearFilters,
        changeKeyword
    }, dispatch);
}

function mapStateToProps({ navBar, boardMembersReducer, clientInformacion, reducerGlobal }, ownerProps) {
    return {
        navBar,
        boardMembersReducer,
        clientInformacion,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentBoardMembers);