import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer, changePage, limitiInf} from './actions';
import {NUMBER_RECORDS} from './constants';

let v1 = "";
let v2 = "";
let v3 = "";
let limInf1 = 0;

class PaginationContactComponent extends Component{

  constructor(props){
     super(props)
     this.state = {
       limInf: 0
     };
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
      this._handleContactsByClientsFind();
      }
  }


  _handlePaginar(page){
    const {changePage,limitiInf} = this.props;
    var limInf = (page - 1);
    this.setState({
      limInf: limInf
    });
    console.log('limi' + limInf);
    limitiInf(limInf);
    changePage(page);
    this._handleContactsByClientsFind();
  }

  _handleContactsByClientsFind(){
      const {contactsByClient,contactsByClientFindServer} = this.props;
      contactsByClientFindServer(this.state.limInf,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,contactsByClient.get('keyword'),v1,
    v2,
    v3);
  }

  render(){
    const {contactsByClient, config} = this.props;
    var page = contactsByClient.get('page');
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
    contactsByClientFindServer, changePage, limitiInf
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
  return {
    contactsByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationContactComponent);
