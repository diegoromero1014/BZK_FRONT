import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Row} from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { contactsFindServer, changePage } from './actions';
import { NUMBER_RECORDS } from './constants';
import { MESSAGE_LOAD_DATA } from '../../constantsGlobal';
import { changeStateSaveData } from '../main/actions';

class Pagination extends Component {

    _handlePaginar(page) {
        const { filterContactsReducer, contactsFindServer, changePage, changeStateSaveData } = this.props;
        var limInf = (page - 1) * NUMBER_RECORDS;
        const searchIntoAllContacts = filterContactsReducer.get('searchIntoAllContacts');
        changeStateSaveData(true, MESSAGE_LOAD_DATA);
        contactsFindServer(filterContactsReducer.get('keyword'), searchIntoAllContacts,limInf, NUMBER_RECORDS).then( (data) => {
            changeStateSaveData(false, "");
        });
        changePage(page);
    }

    render() {
        const { filterContactsReducer } = this.props;
        var page = filterContactsReducer.get('page');
        var firstPage = 1;
        if (page > 7) {
            firstPage = page - 6;
        }
        var countContacts = filterContactsReducer.get('countContacts');
        var lastPage = Math.ceil(countContacts / NUMBER_RECORDS);
        return (
            <Row style={{width: '100%'}}>
                {countContacts > NUMBER_RECORDS ?
                    <div style={{ borderTop: "2px solid #D9DEDF", width: "100%", marginTop: "15px", paddingTop: "15px", paddingBottom: "15px" }}>
                        <div style={{ textAlign: "center" }} >
                            <ul className="pagination">
                                {page !== 1 ? <li onClick={() => { this._handlePaginar(page - 1) }}><a>«</a></li> : ""}
                                {firstPage <= lastPage ?
                                    <li><a className={page === firstPage ? "active" : ""} onClick={() => { this._handlePaginar(firstPage) }}>{firstPage}</a></li>
                                    : ''}
                                {firstPage + 1 <= lastPage ?
                                    <li><a className={page === firstPage + 1 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 1) }}>{firstPage + 1}</a></li>
                                    : ''}
                                {firstPage + 2 <= lastPage ?
                                    <li><a className={page === firstPage + 2 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 2) }}>{firstPage + 2}</a></li>
                                    : ''}
                                {firstPage + 3 <= lastPage ?
                                    <li><a className={page === firstPage + 3 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 3) }}>{firstPage + 3}</a></li>
                                    : ''}
                                {firstPage + 4 <= lastPage ?
                                    <li><a className={page === firstPage + 4 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 4) }}>{firstPage + 4}</a></li>
                                    : ''}
                                {firstPage + 5 <= lastPage ?
                                    <li><a className={page === firstPage + 5 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 5) }}>{firstPage + 5}</a></li>
                                    : ''}
                                {firstPage + 6 <= lastPage ?
                                    <li><a className={page === firstPage + 6 ? "active" : ""} onClick={() => { this._handlePaginar(firstPage + 6) }}>{firstPage + 6}</a></li>
                                    : ''}
                                {page !== lastPage ?
                                    <li onClick={() => { this._handlePaginar(page + 1) }}><a>»</a></li>
                                    : ''}
                            </ul>
                        </div>
                    </div>
                    : <div></div>}
            </Row>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeStateSaveData,
        contactsFindServer,
        changePage,
    }, dispatch);
}

function mapStateToProps({ filterContactsReducer }, ownerProps) {
    return {
        filterContactsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
