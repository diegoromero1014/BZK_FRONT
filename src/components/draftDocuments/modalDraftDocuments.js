import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import {updateTabSeleted} from '../clientDetailsInfo/actions';
import {draftsDocumentsByUser, clearDraftDocumentOrder, clearDraftDocumentPaginator, clearDraftDocument} from './actions';
import ListDraftDocuments from './listDraftDocuments';
import PaginationDraftDocument from './paginationDraftDocuments';
import {NUMBER_RECORDS} from './constants';
import _ from 'lodash';


class ModalDraftDocuments extends Component {

  constructor(props){
    super(props);
    this.state ={
      keywordDraftDocument: '',
    }
    this.consultInfoDraftDocuments = this.consultInfoDraftDocuments.bind(this);
    this._handleDraftDcoumentsFind = this._handleDraftDcoumentsFind.bind(this);
    this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
  }

  _handleChangeKeyword(e){
    if(e.keyCode === 13 || e.which === 13){
      this.consultInfoDraftDocuments();
    }else{
      this.setState({
        keywordDraftDocument: e.target.value
      });
    }
  }

  componentWillMount(){
    const {clearDraftDocument} = this.props;
    clearDraftDocument();
    this.consultInfoDraftDocuments();

  }

  consultInfoDraftDocuments(){
    const {draftsDocumentsByUser, clearDraftDocumentPaginator} = this.props;
    clearDraftDocumentPaginator();
    draftsDocumentsByUser(0, NUMBER_RECORDS, this.state.keywordDraftDocument).then( (data) => {
      if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
      }
    });
  }

  _handleDraftDcoumentsFind(){
      const {draftsDocumentsByUser, clearDraftDocumentPaginator, clearDraftDocumentOrder} = this.props;
      clearDraftDocumentPaginator();
      clearDraftDocumentOrder();
      draftsDocumentsByUser(0, NUMBER_RECORDS, this.state.keywordDraftDocument, null, "");
  }

  render(){
    const {draftDocumentsReducer} = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if(draftDocumentsReducer.get('pendingTaskListByUser') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className = "tab-pane quickZoomIn animated" style={{width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px"}}>
        <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial', marginLeft: '10px', marginRight: '10px'}}>
          <Grid style={{ width: "100%"}}>
            <Row>
              <Col xs={12} sm={12} md={8} lg={8}>
                <div className="InputAddOn">
                  <input style={{padding: '0px 11px !important'}} id="searchExpression" onKeyPress={this._handleChangeKeyword} type="text" placeholder="Búsqueda por tipo de documento, nit y nombre del cliente"  value={this.state.keywordDraftDocument} onChange={this._handleChangeKeyword} className="input InputAddOn-field"/>
                  <button onClick={this._handleDraftDcoumentsFind} className="button InputAddOn-item">
                    <i className="search icon" />
                  </button>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style= {{display:visibleTable, width: "100%"}}>
          <Row>
            <Col xs>
              <ListDraftDocuments value1={this.state.keywordDraftDocument} />
              <PaginationDraftDocument value1={this.state.keywordDraftDocument} />
          </Col>
          </Row>
        </Grid>
        <Grid style= {{display:visibleMessage, width: "100%"}}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}>
              <span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado resultados para la búsqueda</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    redirectUrl,
    clearDraftDocument,
    draftsDocumentsByUser,
    clearDraftDocumentOrder,
    clearDraftDocumentPaginator
  }, dispatch);
}

function mapStateToProps({draftDocumentsReducer}, ownerProps){
  return {
    draftDocumentsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDraftDocuments);
