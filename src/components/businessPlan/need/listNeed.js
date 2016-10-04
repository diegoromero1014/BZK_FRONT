import React, {Component,PropTypes} from 'react';
import GridComponent from '../../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import BotonCreateNeed from './botonCreateNeed';
import {DELETE_NEED_VIEW} from './constants';
import {deleteNeed} from './actions';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import ModalNeed from './modalNeed';
import _ from 'lodash';
import moment from 'moment';

var arrayValueNeed = [];
var idNeedSeleted = null;

class ListNeed extends Component {

  constructor(props){
      super(props);
      this.state = {
        showConfirmDeleteNeed: false,
        actions: {},
        modalIsOpen: false
      };
      this._mapValuesNeed = this._mapValuesNeed.bind(this);
      this._getValuesNeed = this._getValuesNeed.bind(this);
      this._deleteNeed = this._deleteNeed.bind(this);
      this.closeModal = this.closeModal.bind(this);
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  _getValuesNeed(){
    var {needs} = this.props;
    if(needs.size > 0){
      var data = _.chain(needs.toArray()).map(need => {
        const {uuid, needType, needIdType, needFormat, descriptionNeed,needProduct,needIdProduct, needImplementation,
          statusNeed,needIdImplementation,needTask,needBenefits,needIdResponsable, needResponsable,needDate,statusIdNeed} = need;
        var descripcionNecesidad = descriptionNeed.length > 120 ? descriptionNeed.substring(0, 120) + "..." : descriptionNeed;
        return _.assign({}, {
          'actions':  {
            actionView: true,
            need: need,
            urlServer: "./component",
            component : "VIEW_NEED"
          },
          uuid: uuid, needType :needType, needIdType :needIdType, descriptionNeed : descriptionNeed,
          needProduct : needProduct,needIdProduct : needIdProduct, needImplementation : needImplementation,
          statusNeed: statusNeed,needIdImplementation : needIdImplementation,needTask : needTask,needBenefits : needBenefits,
          needIdResponsable: needIdResponsable, needResponsable : needResponsable,needDate: needDate,needFormat: needFormat,
          statusIdNeed: statusIdNeed,
          descripcionNecesidad :descripcionNecesidad,
          'delete':  {
            typeDelete : DELETE_NEED_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar la necesidad?"
          }
        });
      })
      .value();
      arrayValueNeed = data;
    } else {
      arrayValueNeed = [];
    }
  }

  _confirmDeleteNeed(idNeed){
    idNeedSeleted = idNeed;
    this.setState({
      showConfirmDeleteNeed: true
    });
  }

  _deleteNeed(){
    const {deleteNeed, needs} = this.props;
    var indexDelete = needs.findIndex(function(item){
      return item.uuid === idNeedSeleted;
    });
    deleteNeed(indexDelete);
    this.setState({
      showConfirmDeleteNeed: false
    });
    idNeedSeleted= null;
  }

  _viewDetailsNeed(needDetails){
    var actions = {
      actionView: true,
      need: needDetails,
      urlServer: "./component",
      component : "VIEW_NEED"
    }
    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesNeed(needData, idx){
    var {disabled} = this.props;
    return <tr key={idx}>
              <td className="collapsing">
                <i className="zoom icon" title="Ver detalle"
                onClick={this._viewDetailsNeed.bind(this, needData)}
                style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
              </td>
              <td>{needData.needType}</td>
              <td>{needData.descripcionNecesidad}</td>
              <td>{needData.statusNeed}</td>
              <td  className="collapsing">
                <i className="remove icon" title="Eliminar necesidad"
                  onClick={this._confirmDeleteNeed.bind(this, needData.uuid)}
                  style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
              </td>
           </tr>
  }

  render() {
    var disabledButtonCreate= '';
    this._getValuesNeed();
    const {needs, disabled} = this.props;
    if(needs.size === 10){
      disabledButtonCreate = 'disabled';
    }else{
      disabledButtonCreate = '';
    }
    const modalTitle = 'Necesidad Detalle';
    return (
      <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        {disabled === '' || disabled === undefined ?
        <Row xs={12} md={12} lg={12}>
          <BotonCreateNeed disabled={disabledButtonCreate}/>
        </Row>
        : ''}
        {needs.size > 0 ?
          <Row style={disabled === '' || disabled === undefined ? {marginTop: '20px'} : {}}>
            <Col xs>
              <table className="ui striped table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Necesidades</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrayValueNeed.map(this._mapValuesNeed)}
                </tbody>
              </table>
            </Col>
          </Row> :
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
                <span className="form-item">Aún no se han adicionado necesidades</span>
              </div>
            </Col>
          </Row>
        }
      <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">

        <div className="modalBt4-dialog modalBt4-lg">
          <div className="modalBt4-content modal-content">
            <div className="modalBt4-header modal-header">
              <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title" id="myModalLabel">{modalTitle}</h4>
            </div>
            <ModalNeed needEdit={this.state.actions.need} isOpen={this.closeModal}/>
          </div>
        </div>
      </Modal>
      <SweetAlert
        type= "warning"
        show={this.state.showConfirmDeleteNeed}
        title="Eliminación necesidad"
        text="¿Señor usuario, está seguro que desea eliminar la necesidad?"
        confirmButtonColor= '#DD6B55'
        confirmButtonText= 'Sí, estoy seguro!'
        cancelButtonText = "Cancelar"
        showCancelButton= {true}
        onCancel= {() => this.setState({showConfirmDeleteNeed: false })}
        onConfirm={this._deleteNeed}/>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      deleteNeed
    }, dispatch);
}

function mapStateToProps({needs}) {
    return {
        needs
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListNeed);
