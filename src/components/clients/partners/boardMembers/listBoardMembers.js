import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import GridComponent from '../../../grid/component';
import { joinName, validateResponse } from '../../../../actionsGlobal';
import { deleteBoardMemberByClient, getBoardMembers, clearFilters, changeKeyword } from './actions';
import { swtShowMessage } from '../../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../../main/actions';
import { VIEW_BOARD_MEMBERS } from '../../../modal/constants';
import { NUMBER_RECORDS, LOWER_INITIAL_LIMIT } from './constants';
import {
  TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT, ELIMINAR,
  MESSAGE_LOAD_DATA
} from '../../../../constantsGlobal';

class ListBoardMembers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actions: {},
      modalIsOpen: false
    };

    this.closeModal = this.closeModal.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this._renderCellView = this._renderCellView.bind(this);
    this._deleteBoardMember = this._deleteBoardMember.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  /**
   * Elimina la relación de un miembro de junta con el cliente y refresca la lista
   * @param {*} idClientBoardMember 
   */
  _deleteBoardMember(idClientBoardMember) {
    const { 
      deleteBoardMemberByClient, swtShowMessage, getBoardMembers, changeStateSaveData, clearFilters, changeKeyword
    } = this.props;

    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    deleteBoardMemberByClient(idClientBoardMember).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      } else {
        swtShowMessage('success', "Miembro de junta", 'Señor usuario, el miembro de junta se eliminó exitosamente');
        clearFilters();
        changeKeyword('');
        getBoardMembers(window.sessionStorage.getItem('idClientSelected'), LOWER_INITIAL_LIMIT, NUMBER_RECORDS, '').then((data) => {
          if (!validateResponse(data)) {
            swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
          }
        }, (reason) => {
          swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
        });
      }
    }, (reason) => {
      changeStateSaveData(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actions",
        width: '20px'
      },
      {
        title: "Tipo de documento",
        key: "typeOfDocument"
      },
      {
        title: "Número de documento",
        key: "numberDocument"
      },
      {
        title: "Nombre",
        key: "name"
      },
      {
        title: "",
        key: "deleteNew"
      }
    ]
  }

  _renderCellView(data = []) {
    const { reducerGlobal } = this.props;
    const thisSelf = this;
    return _.map(data, item => {
      const deleteNew = {
        message: 'Señor usuario ¿está seguro que desea eliminar el miembro de junta: ' + joinName(item.firstName, item.middleName, item.firstLastName, item.secondLastName) + "?",
        fn: thisSelf._deleteBoardMember,
        argsFn: [item.idClientBoardMember]
      };
      const jsonRow = {
        actions: {
          actionView: true,
          boardMember: item,
          urlServer: "./component",
          component: VIEW_BOARD_MEMBERS
        },
        typeOfDocument: item.typeOfDocument,
        numberDocument: item.numberDocument,
        name: joinName(item.firstName, item.middleName, item.firstLastName, item.secondLastName)
      }
      if (_.get(reducerGlobal.get('permissionsBoardMembers'), _.indexOf(reducerGlobal.get('permissionsBoardMembers'), ELIMINAR), false)) {
        _.set(jsonRow, 'deleteNew', deleteNew);
      }
      return jsonRow;
    })
  }

  render() {
    const { listBoardMembers } = this.props;
    const modalTitle = 'Detalle del miembro de junta';
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(listBoardMembers)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    deleteBoardMemberByClient,
    swtShowMessage,
    getBoardMembers,
    changeStateSaveData,
    clearFilters,
    changeKeyword
  }, dispatch);
}

function mapStateToProps({ selectsReducer, reducerGlobal, boardMembersReducer }, ownerProps) {
  return {
    selectsReducer,
    reducerGlobal,
    boardMembersReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBoardMembers);