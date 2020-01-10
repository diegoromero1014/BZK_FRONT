import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changePageAssociateVisit } from '../actions';
import { NUMBER_RECORDS } from '../constants';

class PaginationAssociateVisit extends Component {

    constructor(props) {
        super(props)
    }

    _handlePaginar(page) {
        const { changePageAssociateVisit } = this.props;
        changePageAssociateVisit(page);
    }

    render() {
        const { visitReducer, previsitReducer, config } = this.props;
        var page = visitReducer.get('pageAssociateVisit');
        var firstPage = 1;
        if (page > 7) {
            firstPage = page - 6;
        }
        var rowCount = previsitReducer.get('rowCount');
        var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
        return (
            <div>
                {rowCount > NUMBER_RECORDS ?
                    <div style={{ borderTop: "2px solid #D9DEDF", width: "100%", marginTop: "15px", paddingTop: "15px" }}>
                        <span style={{ fontWeight: 'bold' }}>Pág. {page} de {lastPage}</span>
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
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changePageAssociateVisit
    }, dispatch);
}

function mapStateToProps({ visitReducer, previsitReducer }, ownerProps) {
    return {
        visitReducer,
        previsitReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationAssociateVisit);
