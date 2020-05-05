import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NUMBER_RECORDS } from './constants';
import { redirectUrl } from '../globalComponents/actions';
import { changeKeyword, contactsFindServer, changePage, clearContacts, changeSearchAllIntoContacts } from './actions';
import SweetAlert from '../sweetalertFocus';
import { updateTitleNavBar } from '../navBar/actions';
import ContactListItem from './contactListItem';
import { MESSAGE_LOAD_DATA } from '../../constantsGlobal';
import { changeStateSaveData } from '../main/actions';
import Pagination from './pagination';
import _ from 'lodash';
import Tooltip from '../toolTip/toolTipComponent';
import { Checkbox } from 'semantic-ui-react';
import { validateResponse } from '../../actionsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';

export class SearchContacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this.handleChangeKeyword = this.handleChangeKeyword.bind(this);
        this.handleContactsFind = this.handleContactsFind.bind(this);
        this.handleChangeSearchAllIntoContacts = this.handleChangeSearchAllIntoContacts.bind(this);
        this.cleanSearch = this.cleanSearch.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else {
            const { dispatchClearContacts, dispatchUpdateTitleNavBar } = this.props;
            dispatchClearContacts();
            dispatchUpdateTitleNavBar("Mis contactos");
        }
    }

    handleChangeKeyword = e => {
        const { dispatchChangeKeyword } = this.props;
        dispatchChangeKeyword(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            if (e.target.value.length >= 3) {
                this.handleContactsFind(e);
            } else {
                this.setState({ showEr: true });
            }
        }
    }

    handleChangeSearchAllIntoContacts = () => {
        const {
            dispatchChangeSearchAllIntoContacts,
            filterContactsReducer,
            dispatchContactsFindServer,
            dispatchChangeStateSaveData,
            dispatchSwtShowMessage,
            dispatchChangePage
        } = this.props;
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        dispatchChangeSearchAllIntoContacts();
        const keyword = filterContactsReducer.get('keyword');
        if (!_.isEmpty(keyword) && !_.isUndefined(keyword) && !_.isNull(keyword) && keyword.length > 2) {
            dispatchChangeStateSaveData(true, MESSAGE_LOAD_DATA);
            dispatchContactsFindServer(keyword, !searchIntoAllContacts, 0, NUMBER_RECORDS).then((data) => {
                dispatchChangeStateSaveData(false, "");
                if (validateResponse(data)) {
                    if (_.isNull(_.get(data, 'payload.data.data', null))) {
                        dispatchSwtShowMessage('error', 'Búsqueda de contactos', 'Señor usuario, ocurrió un error consultando el contacto.');
                    } else {
                        dispatchChangePage(1);
                    }
                }
            });
        }
    }

    handleContactsFind = () => {
        const { filterContactsReducer, dispatchContactsFindServer, dispatchChangeStateSaveData, dispatchSwtShowMessage } = this.props;
        const keyword = filterContactsReducer.get('keyword');
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        if (_.isEmpty(keyword) || _.isUndefined(keyword) || _.isNull(keyword) || keyword.length < 3) {
            this.setState({ showEr: true });
        } else {
            const { dispatchChangePage } = this.props;
            dispatchChangeStateSaveData(true, MESSAGE_LOAD_DATA);
            dispatchContactsFindServer(keyword, searchIntoAllContacts, 0, NUMBER_RECORDS).then((data) => {
                dispatchChangeStateSaveData(false, "");
                if (validateResponse(data)) {
                    if (_.isNull(_.get(data, 'payload.data.data', null))) {
                        dispatchSwtShowMessage('error', 'Búsqueda de contactos', 'Señor usuario, ocurrió un error consultando el contacto.');
                    } else {
                        dispatchChangePage(1);
                    }
                }
            });
        }
    }

    cleanSearch = () => {
        const { dispatchClearContacts } = this.props;
        dispatchClearContacts();
    }

    mapContactsItems = (item, idx) => {
        <ContactListItem
            key={idx}
            id={item.id}
            typeDocument={item.typeDocument}
            numberDocument={item.numberDocument}
            firstName={item.firstName}
            middleName={item.middleName}
            firstLastName={item.firstLastName}
            secondLastName={item.secondLastName}
        />
    }

    render() {
        const { filterContactsReducer } = this.props;
        const keyword = filterContactsReducer.get('keyword');
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        const contactItems = filterContactsReducer.get('responseContacts');
        let visibleListContacts;
        let visibleMsgNoContacts;
        if (filterContactsReducer.get('countContacts') === 0 && filterContactsReducer.get('status') === 'processed') {
            visibleListContacts = 'none';
            visibleMsgNoContacts = 'block';
        } else {
            visibleListContacts = 'block';
            visibleMsgNoContacts = 'none';
        }

        return (
            <div>
                <Row style={{
                    borderBottom: "2px solid #D9DEDF",
                    paddingTop: "15px",
                    paddingBottom: "0px",
                    paddingLeft: "17px",
                    paddingRight: "5px"
                }}>
                    <Col xs={12} sm={12} md={5} lg={5}>
                        <div className="InputAddOn">
                            <input type="text" style={{ padding: '0px 11px !important' }}
                                placeholder="Búsqueda por documento o nombre del contacto"
                                value={keyword} onKeyPress={this.handleChangeKeyword}
                                onChange={this.handleChangeKeyword}
                                className="input-lg input InputAddOn-field" />
                            <button id="searchContacts" className="btn" title="Buscar contactos" type="button"
                                onClick={this.handleContactsFind} style={{ backgroundColor: "#E0E2E2" }}>
                                <i className="search icon" style={{ margin: '0em', fontSize: '1.2em' }} />
                            </button>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <Tooltip text="Consultar en todo el universo de contactos de Biztrack">
                            <Checkbox
                                onClick={this.handleChangeSearchAllIntoContacts}
                                checked={searchIntoAllContacts} style={{ marginTop: '5pt' }}
                                label={'Consultar en todo Biztrack'} toggle />
                        </Tooltip>
                    </Col>
                    <Col xs={12} sm={12} md={1} lg={1}>
                        <button className="btn btn-primary" type="button" onClick={this.cleanSearch}
                            title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                            <i className="erase icon"
                                style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                        </button>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <button className="btn btn-primary" type="button"
                            onClick={() => redirectUrl("/dashboard/searchContactsByFunctionOrType")}
                            title="Cambiar búsqueda">
                            <i className="refresh icon"
                                style={{ color: "white", margin: '0em', fontSize: '1.2em' }} />
                            Cambiar tipo de búsqueda
                        </button>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{ display: visibleListContacts, width: "98%" }}>
                            <Row>
                                <Col xs>
                                    <div className="news-page content">
                                        <div className="team-modal">
                                            {contactItems.map(this.mapContactsItems)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Pagination />
                        </Grid>
                        <Grid style={{ padding: '15pt', display: visibleMsgNoContacts, width: "100%" }}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12}>
                                    <span style={{ fontWeight: 'bold', color: '#4C5360' }}>
                                        Señor usuario, no se encontraron contactos que cumplan el criterio de búsqueda.
                                    </span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                </Row>
                <SweetAlert
                    type="error"
                    show={this.state.showEr}
                    title="Error de búsqueda"
                    text="Señor usuario, para realizar la búsqueda de contactos debe ingresar por lo menos tres caracteres."
                    onConfirm={() => this.setState({ showEr: false })}
                />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    dispatchChangeKeyword: changeKeyword,
    dispatchContactsFindServer: contactsFindServer,
    dispatchChangePage: changePage,
    dispatchClearContacts: clearContacts,
    dispatchUpdateTitleNavBar: updateTitleNavBar,
    dispatchChangeStateSaveData: changeStateSaveData,
    dispatchChangeSearchAllIntoContacts: changeSearchAllIntoContacts,
    dispatchSwtShowMessage: swtShowMessage
}, dispatch);


const mapStateToProps = ({ clientR, filterContactsReducer, tabReducer }) => ({
    clientR,
    filterContactsReducer,
    tabReducer
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContacts);