import React, {Component,PropTypes} from 'react';
import GridComponent from '../../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {DELETE_BUSINESS_VIEW} from './constants';
import {deleteBusiness} from './actions';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import _ from 'lodash';
import moment from 'moment';
import BtnCreateBusiness from '../btnCreateBusiness';

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
    var {pipelineBusinessReducer} = this.props;
    if(pipelineBusinessReducer.size > 0){
      var data = _.chain(pipelineBusinessReducer.toArray()).map(pipelineBusinessReducer => {
        const {uuid, businessType, businessIdType, businessFormat, descriptionBusiness,businessProduct,businessIdProduct, businessImplementation,
          statusBusiness,businessIdImplementation,businessTask,businessBenefits,businessIdResponsable, businessResponsable,businessDate,statusIdBusiness} = business;
        var descripcionNecesidad = descriptionBusiness.length > 120 ? descriptionBusiness.substring(0, 120) + "..." : descriptionBusiness;
        return _.assign({}, {
          'actions':  {
            actionView: true,
            business: pipelineBusinessReducer,
            urlServer: "./component",
            component : "VIEW_BUSINESS"
          },
          uuid: uuid, businessType :businessType, businessIdType :businessIdType, descriptionBusiness : descriptionBusiness,
          businessProduct : businessProduct,businessIdProduct : businessIdProduct, businessImplementation : businessImplementation,
          statusBusiness: statusBusiness,businessIdImplementation : businessIdImplementation,businessTask : businessTask,businessBenefits : businessBenefits,
          businessIdResponsable: businessIdResponsable, businessResponsable : businessResponsable,businessDate: businessDate,businessFormat: businessFormat,
          statusIdBusiness: statusIdBusiness,
          descripcionNecesidad :descripcionNecesidad,
          'delete':  {
            typeDelete : DELETE_BUSINESS_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar el negocio?"
          }
        });
      })
      .value();
      arrayValueBusiness = data;
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
    var actions = {
      actionView: true,
      business: businessDetails,
      urlServer: "./component",
      component : "VIEW_BUSINESS"
    }
    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesBusiness(businessData, idx){
    var {disabled} = this.props;
    return
      <tr key={idx}>
        <td className="collapsing">
          <i className="zoom icon" title="Ver detalle"
          onClick={this._viewDetailsBusiness.bind(this, businessData)}
          style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
        </td>
        <td>{businessData.businessType}</td>
        <td>{businessData.descripcionNecesidad}</td>
        <td>{businessData.statusBusiness}</td>
        <td  className="collapsing">
          <i className="remove icon" title="Eliminar necesidad"
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
    const modalTitle = 'Necesidad Detalle';
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
        title="Eliminación necesidad"
        text="¿Señor usuario, está seguro que desea eliminar la necesidad?"
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

function mapStateToProps({pipelineBusinessReducer}) {
    return {
        pipelineBusinessReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusiness);
