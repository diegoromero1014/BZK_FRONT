import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer, changePage, limitiInf,clearContact} from './actions';
import {NUMBER_RECORDS} from './constants';

let v1 = "";
let v2 = "";
let v3 = "";

class PaginationContactComponent extends Component{

  constructor(props){
     super(props)
    this._handleContactsByClientsFind = this._handleContactsByClientsFind.bind(this);
  }

  componentWillReceiveProps(nextProps){
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
      this._handleContactsByClientsFind(0);
      }
  }

  componentWillMount(){
    const{clearContact} = this.props;
    clearContact();
  }

  _handlePaginar(page){
    const {changePage,limitiInf,contactsByClient} = this.props;
    var limInf = (page - 1);
    limitiInf(limInf);
    changePage(page);
    this._handleContactsByClientsFind(limInf);
  }

  _handleContactsByClientsFind(limInf){
      const {contactsByClient,contactsByClientFindServer} = this.props;
      contactsByClientFindServer(limInf,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,contactsByClient.get('column'),contactsByClient.get('order'),contactsByClient.get('keywordContact'),v1,
    v2,
    v3);
  }

  render(){
    const {contactsByClient, config} = this.props;
    var page = contactsByClient.get('page');
    var limInf = contactsByClient.get('limInf');
    var firstPage = 1;
    if(page > 7){
      firstPage = page - 6;
    }
    var rowCount = contactsByClient.get('rowCount');
    var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
    return (
      <div>
        {rowCount > NUMBER_RECORDS ?
          <div style={{borderTop:"2px solid #D9DEDF", width:"100%", marginTop:"15px", paddingTop: "15px"}}>
            <span style={{fontWeight: 'bold'}}>Pág. {page} de {lastPage}</span>
            <div style={{textAlign:"center"}} >
              <ul className="pagination">
                {page != 1 ? <li onClick={() => {this._handlePaginar(page - 1)}}><a>«</a></li> :"" }
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
                {page != lastPage ?
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
    contactsByClientFindServer, changePage, limitiInf,clearContact
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
  return {
    contactsByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationContactComponent);
