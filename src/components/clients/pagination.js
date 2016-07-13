import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clientsFindServer, changePage} from './actions';
import {NUMBER_RECORDS} from './constants';

class Pagination extends Component{

  _handlePaginar(page){
    const {clientsFindServer} = this.props;
    const {changePage} = this.props;
    const {clientR,valueCertification,valueTeam} = this.props;
    var keyword = clientR.get('keyword');
    var limInf = (page - 1) * NUMBER_RECORDS;
    clientsFindServer(clientR.get('keyword'), limInf, NUMBER_RECORDS,valueCertification,valueTeam);
    changePage(page);
  }

  render(){
    const {clientR} = this.props;
    var page = clientR.get('page');
    var firstPage = 1;
    if(page > 7){
      firstPage = page - 6;
    }
    var countClients = clientR.get('countClients');
    var lastPage = Math.ceil(countClients / NUMBER_RECORDS);
    return (
      <div>
        {countClients > NUMBER_RECORDS ?
          <div style={{borderTop:"2px solid #D9DEDF", width:"100%", marginTop:"15px", paddingTop: "15px", paddingBottom:"15px"}}>
            <div style={{textAlign:"center"}} >
              <ul className="pagination">
                {page !== 1 ? <li onClick={() => {this._handlePaginar(page - 1)}}><a>«</a></li> :"" }
                {firstPage <= lastPage ?
                  <li><a className={page === firstPage ? "active" :"" } onClick={() => {this._handlePaginar(firstPage)}}>{firstPage}</a></li>
                : ''}
                {firstPage + 1 <= lastPage ?
                  <li><a className={page === firstPage + 1 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 1)}}>{firstPage + 1}</a></li>
                : ''}
                {firstPage + 2 <= lastPage ?
                  <li><a className={page === firstPage + 2 ? "active" :"" } onClick={() => {this._handlePaginar(firstPage + 2 )}}>{firstPage + 2}</a></li>
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
    clientsFindServer, changePage
  }, dispatch);
}

function mapStateToProps({clientR}, ownerProps){
  return {
    clientR
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
