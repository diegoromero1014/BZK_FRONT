import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByClientFindServer, changeKeywordUserTask, clearUserTaskPaginator, clearUserTaskOrder} from './actions';
import {NUMBER_RECORDS} from './constants';
import _ from 'lodash';

let v1 = "";
let v2 = "";
let v3 = "";
let limInf1 = 0;

class SearchUserTaskComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
        keywordUserTask: ''
      };
      this._handleUserTasksByClientsFind = this._handleUserTasksByClientsFind.bind(this);
      this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
        value1,
        value2,
        value3
    } = nextProps;
    if ((v1 !== nextProps.value1)  ||  (v2 !== nextProps.value2)  ||
        (v3 !== nextProps.value3)) {
    v1 = nextProps.value1;
    v2 = nextProps.value2;
    v3 = nextProps.value3;
    const {clearUserTaskOrder} = this.props;
    clearUserTaskOrder();
    this._handleUserTasksByClientsFind();
    }
  }

  _handleChangeKeyword(e) {
    if(e.keyCode == 13 || e.which == 13) {
      this._handleUserTasksByClientsFind(e);
    } else {
      this.setState({
        keywordUserTask: e.target.value
      });
      const {changeKeywordUserTask} = this.props;
      changeKeywordUserTask(e.target.value);
    }
  }

  _handleUserTasksByClientsFind() {
    const {tasksByClientFindServer, tasksByClient, clearUserTaskPaginator, clearUserTaskOrder} = this.props;
    clearUserTaskPaginator();
    clearUserTaskOrder();
    if(this.state.keywordUserTask === '' || this.state.keywordUserTask === undefined) {
      tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, "");
    } else {
      tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, "", 0, this.state.keywordContact);
    }
  }

  render() {
    return (
      <div className="InputAddOn">
      <input style={{padding: '0px 11px !important'}} id="searchExpression" type="text" onKeyPress={this._handleChangeKeyword} className="input InputAddOn-field" placeholder="Búsqueda por número, nombre, cargo" value={this.state.keywordUserTask} onChange={this._handleChangeKeyword}/>
        <button onClick={this._handleUserTasksByClientsFind} className="button InputAddOn-item">
          <i className="search icon" />
        </button>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer, changeKeywordUserTask, clearUserTaskPaginator, clearUserTaskOrder
  }, dispatch);
}

function mapStateToProps({tasksByClient}, ownerProps) {
  return {
    tasksByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserTaskComponent);
