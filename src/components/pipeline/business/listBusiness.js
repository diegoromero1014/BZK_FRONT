import React, {Component,PropTypes} from 'react';
import GridComponent from '../../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {DELETE_BUSINESS_VIEW} from './constants';
import {ORIGIN_PIPELIN_BUSINESS} from '../constants';
import {deleteBusiness} from './actions';
import moment from 'moment';
import BtnCreateBusiness from '../btnCreateBusiness';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import _ from 'lodash';
import {PRODUCTS, PIPELINE_BUSINESS, PIPELINE_STATUS} from '../../selectsComponent/constants';
import {shorterStringValue} from '../../../actionsGlobal';
import BtnEditBusiness from '../btnEditBusiness';

var arrayValueBusiness = [];
var idBusinessSeleted = null;

class ListBusiness extends Component {

  constructor(props){
      super(props);
      this.state = {
        showConfirmDeleteBusiness: false,
        actions: {},
        modalIsOpen: false
      };
      this._mapValuesBusiness = this._mapValuesBusiness.bind(this);
      this._getValuesBusiness = this._getValuesBusiness.bind(this);
      this._deleteBusiness = this._deleteBusiness.bind(this);
      this.closeModal = this.closeModal.bind(this);
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  _getValuesBusiness(){
    var {pipelineBusinessReducer, selectsReducer} = this.props;
    if(pipelineBusinessReducer.size > 0){
      arrayValueBusiness = pipelineBusinessReducer.toArray();
    } else {
      arrayValueBusiness = [];
    }
  }

  _confirmDeleteBusiness(idBusiness){
    idBusinessSeleted = idBusiness;
    this.setState({
      showConfirmDeleteBusiness: true
    });
  }

  _deleteBusiness(){
    const {deleteBusiness, pipelineBusinessReducer} = this.props;
    var indexDelete = pipelineBusinessReducer.findIndex(function(item){
      return item.uuid === idBusinessSeleted;
    });
    deleteBusiness(indexDelete);
    this.setState({
      showConfirmDeleteBusiness: false
    });
    idBusinessSeleted= null;
  }

  _viewDetailsBusiness(businessDetails){
    console.log('editar');
    var actions = {
      actionView: true,
      component : "VIEW_BUSINESS",
      origin: ORIGIN_PIPELIN_BUSINESS,
      id: businessDetails.uuid
    };
    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesBusiness(businessData, idx){
    var {selectsReducer, disabled} = this.props;
    var products = selectsReducer.get(PRODUCTS);
    var business = selectsReducer.get(PIPELINE_BUSINESS);
    var states = selectsReducer.get(PIPELINE_STATUS);
    const {uuid, product, businessStatus, pipelineBusiness} = businessData;
    var nameProduct, nameBusiness, nameState;
    if(product !== null && product !== '' && product !== undefined){
      nameProduct = _.get(_.filter(products, ['id', parseInt(product)]), '[0].value');
    }
    nameBusiness = _.get(_.filter(business, ['id', parseInt(pipelineBusiness[0])]), '[0].value');
    nameState = _.get(_.filter(states, ['id', parseInt(businessStatus)]), '[0].value');
    return <tr key={idx}>
        <td className="collapsing">
          <BtnEditBusiness pipelineBusiness={businessData}/>
        </td>
        <td>{shorterStringValue(nameBusiness, 50)}</td>
        <td>{shorterStringValue(nameProduct, 50)}</td>
        <td>{shorterStringValue(nameState, 30)}</td>
        <td  className="collapsing">
          <i className="remove icon" title="Eliminar negocio"
            onClick={this._confirmDeleteBusiness.bind(this, businessData.uuid)}
            style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
        </td>
     </tr>
  }

  render() {
    var disabledButtonCreate= '';
    this._getValuesBusiness();
    const {pipelineBusinessReducer, disabled} = this.props;
    if(pipelineBusinessReducer.size === 10){
      disabledButtonCreate = 'disabled';
    }else{
      disabledButtonCreate = '';
    }
    const modalTitle = 'Negocio detalle';
    return (
      <div className = "tab-content break-word" style={{zIndex :0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial', marginTop: "10px"}}>
        {disabled === '' || disabled === undefined ?
          <BtnCreateBusiness disabled={disabledButtonCreate}/>
          : ''
        }
        {pipelineBusinessReducer.size > 0 ?
          <Row style={disabled === '' || disabled === undefined ? {marginTop: '20px'} : {}}>
            <Col xs>
              <table className="ui striped table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Negocio</th>
                    <th>Producto</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrayValueBusiness.map(this._mapValuesBusiness)}
                </tbody>
              </table>
            </Col>
          </Row> :
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
                <span className="form-item">Aún no se han adicionado negocios</span>
              </div>
            </Col>
          </Row>
        }
      <SweetAlert
        type= "warning"
        show={this.state.showConfirmDeleteBusiness}
        title="Eliminación negocio"
        text="¿Señor usuario, está seguro que desea eliminar el negocio?"
        confirmButtonColor= '#DD6B55'
        confirmButtonText= 'Sí, estoy seguro!'
        cancelButtonText = "Cancelar"
        showCancelButton= {true}
        onCancel= {() => this.setState({showConfirmDeleteBusiness: false })}
        onConfirm={this._deleteBusiness}/>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      deleteBusiness
    }, dispatch);
}

function mapStateToProps({pipelineBusinessReducer, selectsReducer}) {
    return {
        pipelineBusinessReducer,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusiness);
