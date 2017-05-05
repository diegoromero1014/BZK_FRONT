import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading} from '../../loading/actions';
import {groupFindServer, changePage} from './actions';
import {NUMBER_RECORDS} from './constants';
import {has} from 'lodash';

class Pagination extends Component{

  _handlePagination(page){
    const {groupFindServer,changePage,groupsFavoriteContacts,showLoading} = this.props;
      changePage(page);
      const keywordName = groupsFavoriteContacts.get('keywordName');
      showLoading(true, 'Cargando..');
      groupFindServer(keywordName, page, NUMBER_RECORDS).then((data) => {
          if (_.has(data, 'payload.data.data')) {
              showLoading(false, null);
          }
      });
  }

  render(){
    const {groupsFavoriteContacts} = this.props;
    var page = groupsFavoriteContacts.get('pageNum');
    var firstPage = 1;
    if(page > 7){
      firstPage = page - 6;
    }
    var countGroup = groupsFavoriteContacts.get('totalGroupByFiltered');
    var lastPage = Math.ceil(countGroup / NUMBER_RECORDS);
    return (
      <div>
        {countGroup > NUMBER_RECORDS ?
          <div style={{borderTop:"2px solid #D9DEDF", width:"100%", paddingTop: "15px", paddingBottom:"15px", backgroundColor: '#FFF'}}>
            <div style={{textAlign:"center"}} >
              <ul className="pagination">
                {page !== 1 ? <li onClick={() => {this._handlePagination(page - 1)}}><a>«</a></li> :"" }
                {firstPage <= lastPage ?
                  <li><a className={page === firstPage ? "active" :"" } onClick={() => {this._handlePagination(firstPage)}}>{firstPage}</a></li>
                : ''}
                {firstPage + 1 <= lastPage ?
                  <li><a className={page === firstPage + 1 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 1)}}>{firstPage + 1}</a></li>
                : ''}
                {firstPage + 2 <= lastPage ?
                  <li><a className={page === firstPage + 2 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 2 )}}>{firstPage + 2}</a></li>
                : ''}
                {firstPage + 3 <= lastPage ?
                  <li><a className={page === firstPage + 3 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 3)}}>{firstPage + 3}</a></li>
                : ''}
                {firstPage + 4 <= lastPage ?
                  <li><a className={page === firstPage + 4 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 4)}}>{firstPage + 4}</a></li>
                : ''}
                {firstPage + 5 <= lastPage ?
                  <li><a className={page === firstPage + 5 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 5)}}>{firstPage + 5}</a></li>
                : ''}
                {firstPage + 6 <= lastPage ?
                  <li><a className={page === firstPage + 6 ? "active" :"" } onClick={() => {this._handlePagination(firstPage + 6)}}>{firstPage + 6}</a></li>
                : ''}
                {page !== lastPage ?
                  <li onClick={() => {this._handlePagination(page + 1)}}><a>»</a></li>
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
      groupFindServer,
      changePage,
      showLoading
  }, dispatch);
}

function mapStateToProps({groupsFavoriteContacts}, ownerProps){
  return {
      groupsFavoriteContacts
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
