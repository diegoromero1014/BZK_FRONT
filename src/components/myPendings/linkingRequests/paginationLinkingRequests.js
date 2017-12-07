import React, { Component } from 'react';
import { NUMBER_RECORDS } from './constants';
import {
  TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, MESSAGE_LOAD_DATA
} from '../../../constantsGlobal';
import { validateResponse } from '../../../actionsGlobal';

class PaginationLinkingRequests extends Component {

  constructor(props) {
    super(props)
    this._handleFind = this._handleFind.bind(this);
  }

  _handleFind(limInf) {
    const { getLinkRequests, changeStateSaveData, swtShowMessage } = this.props;
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    getLinkRequests(limInf, NUMBER_RECORDS).then((data) => {
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
    const { changePage, limitInf } = this.props;
    var limInf = (page - 1);
    limitInf(limInf);
    changePage(page);
    this._handleFind(limInf);
  }

  render() {
    const { linkRequestsReducer } = this.props;
    var page = linkRequestsReducer.get('page');
    var firstPage = 1;
    if (page > 4) {
      firstPage = page - 3;
    }
    var rowCount = linkRequestsReducer.get('rowCount');
    var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
    return (
      <div>
        {rowCount > NUMBER_RECORDS &&
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
        }
      </div>
    )
  }
}

export default PaginationLinkingRequests;
