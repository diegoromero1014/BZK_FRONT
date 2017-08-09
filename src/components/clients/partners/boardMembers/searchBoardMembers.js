import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeKeyword, getBoardMembers, clearFilters } from './actions';
import { FIRST_PAGE, NUMBER_RECORDS, LOWER_INITIAL_LIMIT } from './constants';
import { changeStateSaveData } from '../../../dashboard/actions';
import { validateResponse } from '../../../../actionsGlobal';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import { MESSAGE_LOAD_DATA } from '../../../../constantsGlobal';

class SearchBoardMembers extends Component {
  constructor(props) {
    super(props);
    this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
    this._handleBoardMembersByClientsFind = this._handleBoardMembersByClientsFind.bind(this);
  }

  _handleChangeKeyword(e) {
    if (e.keyCode === 13 || e.which === 13) {
      this._handleBoardMembersByClientsFind();
    } else {
      const { changeKeyword } = this.props;
      changeKeyword(e.target.value);
    }
  }

  _handleBoardMembersByClientsFind() {
    const { boardMembersReducer, getBoardMembers, clearFilters, changeStateSaveData, swtShowMessage } = this.props;
    var keyword = boardMembersReducer.get('keywordBoardMembers');
    clearFilters();
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    getBoardMembers(window.localStorage.getItem('idClientSelected'), LOWER_INITIAL_LIMIT, NUMBER_RECORDS, keyword).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      }
    }, (reason) => {
      changeStateSaveData(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  render() {
    const { disabled, boardMembersReducer } = this.props;
    return (
      <div className="InputAddOn">
        <input style={{ padding: '0px 11px !important' }} disabled={disabled} id="searchExpression"
          onKeyPress={this._handleChangeKeyword} type="text"
          placeholder="Búsqueda por número de documento o nombre" value={boardMembersReducer.get('keywordBoardMembers')}
          onChange={this._handleChangeKeyword} className="input InputAddOn-field" />
        <button onClick={this._handleBoardMembersByClientsFind} disabled={disabled}
          className="button InputAddOn-item">
          <i className="search icon" />
        </button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeKeyword,
    getBoardMembers,
    clearFilters,
    changeStateSaveData,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ boardMembersReducer }, ownerProps) {
  return {
    boardMembersReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBoardMembers);
