import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NUMBER_RECORDS } from '../constants';
import {
  getContactsByTypeOrFunction, lowerLimitContactsByFunctionOrType, pageNumContactsByFunctionOrType
} from '../actions';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import {
  TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, MESSAGE_LOAD_DATA
} from '../../../../constantsGlobal';
import { validateResponse, stringValidate } from '../../../../actionsGlobal';
import { changeStateSaveData } from '../../../main/actions';

class PaginationContactsByFunctionOrType extends Component {

  constructor(props) {
    super(props)
    this._handleFind = this._handleFind.bind(this);
  }

  _handleFind(limInf) {
    const { groupsFavoriteContacts, getContactsByTypeOrFunction, swtShowMessage, changeStateSaveData } = this.props;
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    var functions = groupsFavoriteContacts.get('functionContactsByFunctionOrTpe');
    const obj = {
      functions: stringValidate(functions) ? [functions] : null,
      typeOfContact: groupsFavoriteContacts.get('typeContactsByFunctionOrType'),
      keyword: groupsFavoriteContacts.get('keywordContactsByFunctionOrType'),
      pageNum: limInf,
      maxRows: NUMBER_RECORDS
    }
    getContactsByTypeOrFunction(obj).then((data) => {
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
    const { lowerLimitContactsByFunctionOrType, pageNumContactsByFunctionOrType } = this.props;
    var limit = (page - 1);
    lowerLimitContactsByFunctionOrType(limit);
    pageNumContactsByFunctionOrType(page);
    this._handleFind(page);
  }

  render() {
    const { groupsFavoriteContacts } = this.props;
    var page = groupsFavoriteContacts.get('pageNumContactsByFunctionOrType');
    var firstPage = 1;
    if (page > 4) {
      firstPage = page - 3;
    }
    var rowCount = groupsFavoriteContacts.get('totalContactsByFunctionOrType');
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
          </div>}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getContactsByTypeOrFunction,
    lowerLimitContactsByFunctionOrType,
    pageNumContactsByFunctionOrType,
    swtShowMessage,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({ groupsFavoriteContacts }, ownerProps) {
  return {
    groupsFavoriteContacts
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationContactsByFunctionOrType);
