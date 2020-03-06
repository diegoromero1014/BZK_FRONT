import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NUMBER_RECORDS } from './constants';
import { getBoardMembers, lowerLimit, changePage } from './actions';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import {
  TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT,
  MESSAGE_LOAD_DATA
} from '../../../../constantsGlobal';
import { validateResponse } from '../../../../actionsGlobal';
import { changeStateSaveData } from '../../../main/actions';

class PaginationBoardMembers extends Component {

  constructor(props) {
    super(props)
    this._handleFind = this._handleFind.bind(this);
  }

  _handleFind(limInf) {
    const { getBoardMembers, swtShowMessage, changeStateSaveData, boardMembersReducer } = this.props;
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    getBoardMembers(window.sessionStorage.getItem('idClientSelected'), limInf, NUMBER_RECORDS, boardMembersReducer.get('keywordBoardMembers')).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      }
    }, (reason) => {
      changeStateSaveData(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  _handlePaginar(page) {
    const { changePage, lowerLimit } = this.props;
    var limit = (page - 1);
    lowerLimit(limit);
    changePage(page);
    this._handleFind(limit);
  }

  render() {
    const { boardMembersReducer } = this.props;
    var page = boardMembersReducer.get('page');
    var firstPage = 1;
    if (page > 4) {
      firstPage = page - 3;
    }
    var rowCount = boardMembersReducer.get('rowCount');
    var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
    return (
      <div>
        {rowCount > NUMBER_RECORDS ?
          <div style={{ borderTop: "2px solid #D9DEDF", width: "100%", marginTop: "15px", paddingTop: "15px", marginLeft: '5px' }}>
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
    getBoardMembers,
    lowerLimit,
    changePage,
    swtShowMessage,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({ boardMembersReducer }, ownerProps) {
  return {
    boardMembersReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationBoardMembers);
