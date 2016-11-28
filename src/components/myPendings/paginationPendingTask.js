import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NUMBER_RECORDS} from './constants';
import {tasksByUser, limitiInf, changePage, clearPendingTask, clearMyPendingsOrder} from './actions';

let v1 = "";
class PaginationPendingTask extends Component{

  constructor(props){
     super(props)
     this._handleFindPendingtask = this._handleFindPendingtask.bind(this);
  }

  _handleFindPendingtask(limInf){
      const {tasksByUser, myPendingsReducer} = this.props;
      tasksByUser(limInf, NUMBER_RECORDS, v1, myPendingsReducer.get('orderMyPending'), myPendingsReducer.get('columnMyPending')).then( (data) => {
        if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        }
      });
  }

  componentWillMount(){
    const{clearPendingTask} = this.props;
    clearPendingTask();
  }

  componentWillReceiveProps(nextProps){
    const { value1 } = nextProps;
    if ((v1 !== nextProps.value1)){
      v1 = nextProps.value1;
      const {clearMyPendingsOrder} = this.props;
      clearMyPendingsOrder();
      this._handleFindPendingtask(0);
    }
  }

  _handlePaginar(page){
    const {changePage, limitiInf} = this.props;
    var limInf = (page - 1);
    limitiInf(limInf);
    changePage(page);
    this._handleFindPendingtask(limInf);
  }

  render(){
    const {myPendingsReducer, config} = this.props;
    var page = myPendingsReducer.get('page');
    var firstPage = 1;
    if(page > 4){
      firstPage = page - 3;
    }
    var rowCount = myPendingsReducer.get('rowCount');
    var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
    return (
      <div>
        {rowCount > NUMBER_RECORDS ?
          <div style={{borderTop:"2px solid #D9DEDF", width:"100%", marginTop:"15px", paddingTop: "15px", marginLeft: '5px'}}>
            <span style={{fontWeight: 'bold'}}>Pág. {page} de {lastPage}</span>
            <div style={{textAlign:"center"}} >
              <ul className="pagination">
                {page !== 1 ? <li onClick={() => {this._handlePaginar(page - 1)}}><a>«</a></li> :"" }
                {firstPage <= lastPage ?
                  <li><a className={page === firstPage ? "active" :"" } onClick={() => {this._handlePaginar(firstPage)}}>{firstPage}</a></li>
                : ''}
                {firstPage + 1 <= lastPage ?
                  <li><a className={page === firstPage + 1 ? "active" :"" }  onClick={() => {this._handlePaginar(firstPage + 1)}}>{firstPage + 1}</a></li>
                : ''}
                {firstPage + 2 <= lastPage ?
                  <li><a className={page === firstPage + 2 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 2)}}>{firstPage + 2}</a></li>
                : ''}
                {firstPage + 3 <= lastPage ?
                  <li><a className={page === firstPage + 3 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 3)}}>{firstPage + 3}</a></li>
                : ''}
                {firstPage + 4 <= lastPage ?
                  <li><a className={page === firstPage + 4 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 4)}}>{firstPage + 4}</a></li>
                : ''}
                {firstPage + 5 <= lastPage ?
                  <li><a className={page === firstPage + 5 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 5)}}>{firstPage + 5}</a></li>
                : ''}
                {firstPage + 6 <= lastPage ?
                  <li><a className={page === firstPage + 6 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 6)}}>{firstPage + 6}</a></li>
                : ''}
                {page !== lastPage ?
                  <li onClick={() => {this._handlePaginar(page + 1)}}><a>»</a></li>
                : ''}
              </ul>
            </div>
          </div>
      : <div></div>}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    tasksByUser,
    limitiInf,
    changePage,
    clearPendingTask,
    clearMyPendingsOrder
  }, dispatch);
}

function mapStateToProps({myPendingsReducer}, ownerProps){
  return {
    myPendingsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationPendingTask);
