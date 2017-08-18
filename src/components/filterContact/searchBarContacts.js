import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NUMBER_RECORDS} from './constants';
import {redirectUrl} from '../globalComponents/actions';
import {changeKeyword, contactsFindServer, changePage, clearContacts} from './actions';
import SweetAlert from 'sweetalert-react';
import {updateTitleNavBar} from '../navBar/actions';
import ContactListItem from './contactListItem';
import {MESSAGE_LOAD_DATA} from '../../constantsGlobal';
import {changeStateSaveData} from '../dashboard/actions';
import Pagination from './pagination';
import _ from 'lodash';

class SearchBarContacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEr: false,
        };
        this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
        this._handleContactsFind = this._handleContactsFind.bind(this);
        this._cleanSearch = this._cleanSearch.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "") {
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

    _handleContactsFind(e) {
        const {filterContactsReducer, contactsFindServer, changePage, changeStateSaveData} = this.props;
        const keyword = filterContactsReducer.get('keyword');
        if (_.isEmpty(keyword) || _.isUndefined(keyword) || _.isNull(keyword) || keyword.length < 3) {
            this.setState({showEr: true});
        } else {
            const {changePage} = this.props;
            changeStateSaveData(true, MESSAGE_LOAD_DATA);
            contactsFindServer(keyword, 0, NUMBER_RECORDS).then((data) => {
                changeStateSaveData(false, "");
                if (!_.get(data, 'payload.data.validateLogin')) {
                    redirectUrl("/login");
                }
            });
            changePage(1);
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
        const contactItems = filterContactsReducer.get('responseContacts');
        return (
            <div>
                <Row style={{ borderBottom: "2px solid #D9DEDF", paddingTop: "15px", paddingBottom: "17px", paddingLeft: "17px", paddingRight: "17px" }}>
                    <Col xs={12} sm={12} md={8} lg={8} style={{ width: '100%' }}>
                        <div className="InputAddOn">
                            <input type="text" style={{padding: '0px 11px !important'}}
                                   placeholder="Búsqueda por documento o nombre del contacto"
                                   value={keyword} onKeyPress={this._handleChangeKeyword}
                                   onChange={this._handleChangeKeyword}
                                   className="input-lg input InputAddOn-field"/>
                            <button id="searchContacts" className="btn" title="Buscar contactos" type="button"
                                    onClick={this._handleContactsFind} style={{backgroundColor: "#E0E2E2"}}>
                                <i className="search icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                            </button>
                        </div>
                    </Col>

                    <Col xs={12} sm={12} md={1} lg={1} style={{ width: '100%' }}>
                        <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                                title="Limpiar búsqueda" style={{marginLeft: "17px"}}>
                            <i className="erase icon"
                               style={{color: "white", margin: '0em', fontSize: '1.2em'}}></i>
                        </button>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3} style={{ width: '100%' }}>
                        <button className="btn btn-primary" type="button"
                                onClick={() => redirectUrl("/dashboard/searchContactsByFunctionOrType")}
                                title="Cambiar búsqueda">
                            <i className="refresh icon" style={{color: "white", margin: '0em', fontSize: '1.2em'}}></i>
                            Cambiar tipo de búsqueda
                        </button>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={12} style={{paddingLeft: "10px"}}>
                        <div className="news-page content">
                            <div className="team-modal">
                                {filterContactsReducer.get('countContacts') === 0 && filterContactsReducer.get('status') === 'processed' ?
                                    <div style={{textAlign: "center", marginTop: "15px"}}>
                                        <h4 className="form-item">
                                            Señor usuario, no se encontraron contactos que cumplan el criterio de
                                            búsqueda.
                                        </h4>
                                    </div> :
                                    contactItems.map(this._mapContactsItems)}
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        <Pagination />
                    </Col>
                    <SweetAlert
                        type="error"
                        show={this.state.showEr}
                        title="Error de búsqueda"
                        text="Señor usuario, para realizar la búsqueda de contactos debe ingresar por lo menos tres caracteres."
                        onConfirm={() => this.setState({showEr: false})}
                    />
                </Row>
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
        changeStateSaveData
    }, dispatch);
}

function mapStateToProps({clientR, filterContactsReducer, tabReducer}, ownerProps) {
    return {
        clientR,
        filterContactsReducer,
        tabReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarContacts);