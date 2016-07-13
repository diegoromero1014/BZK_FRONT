import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {pipelineByClientFindServer,changePage,limitiInf,clearPipeline,clearPipelineOrder} from './actions';
import {NUMBER_RECORDS} from './constants';


let v1 = "";

class PaginationPipelineComponent extends Component{


  constructor(props){
     super(props)
     this._handlePipelineByClientsFind = this._handlePipelineByClientsFind.bind(this);
  }

  componentWillMount(){
    const{clearPipeline} = this.props;
    clearPipeline();
  }

  componentWillReceiveProps(nextProps){
    const {
        value1
    } = nextProps;
    if ((v1 !== nextProps.value1)){
      v1 = nextProps.value1;
      const {clearPipelineOrder} = this.props;
      clearPipelineOrder();
      this._handlePipelineByClientsFind(0);
      }
  }

  _handlePaginar(page){
    const {changePage,limitiInf} = this.props;
    var limInf = (page - 1);
    limitiInf(limInf);
    this._handlePipelineByClientsFind(limInf);
    changePage(page);
  }

  _handlePipelineByClientsFind(limInf){
    const {pipelineByClientFindServer,pipelineReducer} = this.props;
    pipelineByClientFindServer(window.localStorage.getItem('idClientSelected'),limInf,NUMBER_RECORDS,pipelineReducer.get('columnPipeline'),pipelineReducer.get('orderPipeline'),v1);
  }

  render(){
    const {pipelineReducer, config} = this.props;
    var page = pipelineReducer.get('page');
    var firstPage = 1;
    if(page > 7){
      firstPage = page - 6;
    }
    var rowCount = pipelineReducer.get('rowCount');
    var lastPage = Math.ceil(rowCount / NUMBER_RECORDS);
    return (
      <div>
        {rowCount > NUMBER_RECORDS ?
          <div style={{borderTop:"2px solid #D9DEDF", width:"100%", marginTop:"15px", paddingTop: "15px"}}>
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
    pipelineByClientFindServer,changePage, limitiInf,clearPipeline,clearPipelineOrder
  }, dispatch);
}

function mapStateToProps({pipelineReducer}, ownerProps){
  return {
    pipelineReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationPipelineComponent);
