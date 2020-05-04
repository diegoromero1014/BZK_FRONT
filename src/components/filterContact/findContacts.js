import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NUMBER_RECORDS, MESSAGE_PLACEHOLDER} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import {changeKeyword, contactsFindServer, changePage, clearContacts, changeSearchAllIntoContacts} from './actions';
import SweetAlert from '../sweetalertFocus';
import {updateTitleNavBar} from '../navBar/actions';
import ContactListItem from './contactListItem';
import {MESSAGE_LOAD_DATA} from '../../constantsGlobal';
import {changeStateSaveData} from '../main/actions';
import Pagination from './pagination';
import _ from 'lodash';
import Tooltip from '../toolTip/toolTipComponent';
import {Checkbox} from 'semantic-ui-react';
import {validateResponse} from '../../actionsGlobal';
import {swtShowMessage} from '../sweetAlertMessages/actions';

import '../../../styles/app/placeholder.scss';


class SearchContacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._handleContactsFind = this._handleContactsFind.bind(this);
        this._handleChangeSearchAllIntoContacts = this._handleChangeSearchAllIntoContacts.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else {
            const {clearContacts, updateTitleNavBar} = this.props;
            clearContacts();
            updateTitleNavBar("Mis contactos");
        }
    }

    _handleChangeKeyword(e) {
        const {changeKeyword} = this.props;
        changeKeyword(e.target.value);
        if (e.keyCode === 13 || e.which === 13) {
            if (e.target.value.length >= 3) {
                this._handleContactsFind(e);
            } else {
                this.setState({showEr: true});
            }
        }
    }

    _handleChangeSearchAllIntoContacts(e) {
        const {changeSearchAllIntoContacts, filterContactsReducer, contactsFindServer, changeStateSaveData, swtShowMessage, changePage} = this.props;
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        changeSearchAllIntoContacts();
        const keyword = filterContactsReducer.get('keyword');
        if (!_.isEmpty(keyword) && !_.isUndefined(keyword) && !_.isNull(keyword) && keyword.length > 2) {
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            contactsFindServer(keyword, !searchIntoAllContacts, 0, NUMBER_RECORDS).then((data) => {
                changeStateSaveData(false, "");
                if (validateResponse(data)) {
                    if (_.isNull(_.get(data, 'payload.data.data', null))) {
                        swtShowMessage('error', 'Búsqueda de contactos', 'Señor usuario, ocurrió un error consultando el contacto.');
                    } else {
                        changePage(1);
                    }
                }
            });
        }
    }

    _handleContactsFind(e) {
        const {filterContactsReducer, contactsFindServer, changePage, changeStateSaveData, swtShowMessage} = this.props;
        const keyword = filterContactsReducer.get('keyword');
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        if (_.isEmpty(keyword) || _.isUndefined(keyword) || _.isNull(keyword) || keyword.length < 3) {
            this.setState({showEr: true});
        } else {
            const {changePage} = this.props;
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            contactsFindServer(keyword, searchIntoAllContacts, 0, NUMBER_RECORDS).then((data) => {
                changeStateSaveData(false, "");
                if (validateResponse(data)) {
                    if (_.isNull(_.get(data, 'payload.data.data', null))) {
                        swtShowMessage('error', 'Búsqueda de contactos', 'Señor usuario, ocurrió un error consultando el contacto.');
                    } else {
                        changePage(1);
                    }
                }
            });
        }
    }

    _cleanSearch() {
        const {clearContacts} = this.props;
        clearContacts();
    }

    _mapContactsItems(item, idx) {
        return <ContactListItem
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
        const {filterContactsReducer} = this.props;
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
                            <input type="text" style={{padding: '0px 11px !important'}}
                                   placeholder={MESSAGE_PLACEHOLDER}
                                   value={keyword} onKeyPress={this._handleChangeKeyword}
                                   onChange={this._handleChangeKeyword}
                                   className="input-lg input InputAddOn-field"/>
                            <button id="searchContacts" className="btn" title="Buscar contactos" type="button"
                                    onClick={this._handleContactsFind} style={{backgroundColor: "#E0E2E2"}}>
                                <i className="search icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                            </button>
                        </div>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <Tooltip text="Consultar en todo el universo de contactos de Biztrack">
                            <Checkbox
                                onClick={this._handleChangeSearchAllIntoContacts}
                                checked={searchIntoAllContacts} style={{marginTop: '5pt'}}
                                label={'Consultar en todo Biztrack'} toggle/>
                        </Tooltip>
                    </Col>
                    <Col xs={12} sm={12} md={1} lg={1}>
                        <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{marginLeft: "17px"}}>
                            <i className="erase icon"
                               style={{color: "white", margin: '0em', fontSize: '1.2em'}}/>
                        </button>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <button className="btn btn-primary" type="button"
                                onClick={() => redirectUrl("/dashboard/searchContactsByFunctionOrType")}
                                title="Cambiar búsqueda">
                            <i className="refresh icon"
                               style={{color: "white", margin: '0em', fontSize: '1.2em'}}/>
                            Cambiar tipo de búsqueda
                        </button>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={12} lg={12}>
                        <Grid style={{display: visibleListContacts, width: "98%"}}>
                            <Row>
                                <Col xs>
                                    <div className="news-page content">
                                        <div className="team-modal">
                                            {contactItems.map(this._mapContactsItems)}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Pagination />
                        </Grid>
                        <Grid style={{padding: '15pt', display: visibleMsgNoContacts, width: "100%"}}>
                            <Row center="xs">
                                <Col xs={12} sm={8} md={12} lg={12}>
                                    <span style={{fontWeight: 'bold', color: '#4C5360'}}>
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
                    onConfirm={() => this.setState({showEr: false})}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeKeyword,
        contactsFindServer,
        changePage,
        clearContacts,
        updateTitleNavBar,
        changeStateSaveData,
        changeSearchAllIntoContacts,
        swtShowMessage
    }, dispatch);
}

function mapStateToProps({clientR, filterContactsReducer, tabReducer}, ownerProps) {
    return {
        clientR,
        filterContactsReducer,
        tabReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContacts);