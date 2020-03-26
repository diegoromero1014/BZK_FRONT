import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { updateTitleNavBar } from '../../navBar/actions';
import _ from 'lodash';
import { NUMBER_RECORDS, PAGE_INITIAL } from './constants';
import { changeStateSaveData } from '../../main/actions';
import ListLinkingRequests from './listLinkingRequests';
import { getLinkRequests, limitInf, changePage, clearLinkRequestPaginator, clearLinkRequests } from './actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import PaginationLinkingRequests from './paginationLinkingRequests';
import { validatePermissionsByModule } from '../../../actionsGlobal';
import { MODULE_CLIENTS, MESSAGE_SAVE_DATA, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, MESSAGE_ERROR } from '../../../constantsGlobal';

class ComponentAssigned extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keywordLinkingRequests: ''
        };

        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._findForKeyword = this._findForKeyword.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    _handleChangeKeyword(e) {
        const { getLinkRequests, changePage, changeStateSaveData } = this.props;
        if (e.keyCode === 13 || e.which === 13) {
            changeStateSaveData(true, "Cargando..");
            changePage(1);
            getLinkRequests(PAGE_INITIAL, NUMBER_RECORDS, this.state.keywordLinkingRequests).then((data) => {
                changeStateSaveData(false, "");
            }, (reason) => {
                changeStateSaveData(false, "");
                swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
            });
        } else {
            this.setState({
                keywordLinkingRequests: e.target.value,
            });
        }
    }

    _findForKeyword() {
        const { getLinkRequests, changePage, changeStateSaveData } = this.props;
        changeStateSaveData(true, "Cargando..");
        changePage(1);
        getLinkRequests(PAGE_INITIAL, NUMBER_RECORDS, this.state.keywordLinkingRequests).then(() => {
            changeStateSaveData(false, "");
        }, () => {
            changeStateSaveData(false, "");
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    _cleanSearch() {
        const { getLinkRequests, changePage } = this.props;
        changeStateSaveData(true, "Cargando..");
        changePage(1);
        getLinkRequests(PAGE_INITIAL, NUMBER_RECORDS, null).then(() => {
            this.setState({
                keywordLinkingRequests: '',
            });
            changeStateSaveData(false, "");
        }, () => {
            changeStateSaveData(false, "");
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
    }

    componentWillMount() {
        const { updateTitleNavBar, validatePermissionsByModule, getLinkRequests, swtShowMessage, changeStateSaveData } = this.props;
        updateTitleNavBar("Solicitudes de vinculación");
        validatePermissionsByModule(MODULE_CLIENTS);
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        getLinkRequests(PAGE_INITIAL, NUMBER_RECORDS).then(() => {
            changeStateSaveData(false, "");
        }, () => {
            changeStateSaveData(false, "");
            swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });

    }

    componentWillUnmount() {

        this.props.clearLinkRequestPaginator();
    }

    render() {
        const { linkRequestsReducer, getLinkRequests, swtShowMessage, changePage, limitInf,
            changeStateSaveData, reducerGlobal } = this.props;
        
        let visibleTable = 'none';
        let visibleMessage = 'block';
        if (linkRequestsReducer.get('rowCount') !== 0) {
            visibleTable = 'block';
            visibleMessage = 'none';
        }

        return (
            <div className="tab-pane quickZoomIn animated"
                style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <div style={{ padding: '10px', overflow: 'initial' }}>
                    <Row style={{ borderBottom: "2px solid #D9DEDF" }}>
                        <Col xs={12} sm={12} md={8} lg={8}>
                            <div className="InputAddOn">
                                <input type="text" style={{ padding: '0px 11px !important' }}
                                    id="searchExpression" onKeyPress={this._handleChangeKeyword}
                                    placeholder="Búsqueda por número de documento y nombre del cliente"
                                    value={this.state.keywordLinkingRequests}
                                    onChange={this._handleChangeKeyword}
                                    className="input-lg input InputAddOn-field"
                                />
                                <button id="searchClients" className="btn"
                                    title="Búsqueda por número de documento y nombre del cliente"
                                    type="button"
                                    onClick={this._findForKeyword} style={{ backgroundColor: "#E0E2E2" }}>
                                    <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                                </button>
                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={2} lg={2} style={{ width: '100%' }}>
                            <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                                <i className="erase icon"
                                    style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                            </button>
                        </Col>
                    </Row>
                </div>
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
                                    changeStateSaveData={changeStateSaveData} keywordLinkingRequests={this.state.keywordLinkingRequests} />
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
        validatePermissionsByModule,
        clearLinkRequestPaginator,
        clearLinkRequests
    }, dispatch);
}

function mapStateToProps({ linkRequestsReducer, reducerGlobal }) {
    return {
        linkRequestsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentAssigned);
