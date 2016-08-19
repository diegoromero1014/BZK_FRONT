import React, {Component,PropTypes} from 'react';
import GridComponent from '../../grid/component';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import BotonCreateArea from './botonCreateArea';
import {DELETE_AREA_VIEW} from './constants';
import {deleteArea} from './actions';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import ModalArea from './modalArea';
import _ from 'lodash';
import moment from 'moment';

var arrayValueArea = [];
var idAreaSeleted = null;

class ListArea extends Component {

  constructor(props){
      super(props);
      this.state = {
        showConfirmDeleteArea: false,
        actions: {},
        modalIsOpen: false
      };
      this._mapValuesArea = this._mapValuesArea.bind(this);
      this._getValuesArea = this._getValuesArea.bind(this);
      this._deleteArea = this._deleteArea.bind(this);
      this.closeModal = this.closeModal.bind(this);
  }

  closeModal(){
    this.setState({modalIsOpen: false});
  }

  _getValuesArea(){
    var {areas} = this.props;
    if(areas.size > 0){
      var data = _.chain(areas.toArray()).map(area => {
        const {uuid, areaDes, actionArea, areaResponsable,areaIdResponsable ,areaDate ,statusIdArea , statusArea} = area;
        var areaD = areaDes.length > 120 ? areaDes.substring(0, 120) + "..." : areaDes;
        return _.assign({}, {
          'actions':  {
            actionView: true,
            area: area,
            urlServer: "./component",
            component : "VIEW_AREA"
          },
          uuid: uuid, areaDes: areaDes, actionArea: actionArea, areaResponsable: areaResponsable,areaIdResponsable:areaIdResponsable,
          areaDate: areaDate, statusIdArea: statusIdArea, statusArea: statusArea,areaD:areaD,
          'delete':  {
            typeDelete : DELETE_AREA_VIEW,
            id: uuid,
            mensaje: "¿Señor usuario, está seguro que desea eliminar el área?"
          }
        });
      })
      .value();
      arrayValueArea = data;
    } else {
      arrayValueArea = [];
    }
  }

  _confirmDeleteArea(idArea){
    idAreaSeleted = idArea;
    this.setState({
      showConfirmDeleteArea: true
    });
  }

  _deleteArea(){
    const {deleteArea, areas} = this.props;
    var indexDelete = areas.findIndex(function(item){
      return item.uuid === idAreaSeleted;
    });
    deleteArea(indexDelete);
    this.setState({
      showConfirmDeleteArea: false
    });
    idAreaSeleted= null;
  }

  _viewDetailsArea(areaDetails){
    var actions = {
      actionView: true,
      area: areaDetails,
      urlServer: "./component",
      component : "VIEW_AREA"
    }
    this.setState({
      actions,
      modalIsOpen: true
    });
  }

  _mapValuesArea(areaData, idx){
    var {disabled} = this.props;
    return <tr key={idx}>
              <td className="collapsing">
                <i className="zoom icon" title="Ver detalle"
                onClick={this._viewDetailsArea.bind(this, areaData)}
                style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
              </td>
              <td>{areaData.areaD}</td>
              <td>{areaData.areaResponsable}</td>
              <td>{areaData.statusArea}</td>
              <td  className="collapsing">
                <i className="remove icon" title="Eliminar área"
                  onClick={this._confirmDeleteArea.bind(this, areaData.uuid)}
                  style={disabled === 'disabled' ? {display:'none'} : {cursor: "pointer"}} />
              </td>
           </tr>
  }

  render() {
    var disabledButtonCreate= '';
    this._getValuesArea();
    const {areas, disabled} = this.props;
    if(areas.size === 10){
      disabledButtonCreate = 'disabled';
    }else{
      disabledButtonCreate = '';
    }
    const modalTitle = 'Area Detalle';
    return (
      <div className = "tab-content break-word" style={{zIndex :0,border: '1px solid #cecece',padding: '16px',borderRadius: '3px', overflow: 'initial'}}>
        {disabled === '' || disabled === undefined ?
        <Row xs={12} md={12} lg={12}>
          <BotonCreateArea disabled={disabledButtonCreate}/>
        </Row>
        : ''}
        {areas.size > 0 ?
          <Row style={disabled === '' || disabled === undefined ? {marginTop: '20px'} : {}}>
            <Col xs>
              <table className="ui striped table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Area</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arrayValueArea.map(this._mapValuesArea)}
                </tbody>
              </table>
            </Col>
          </Row> :
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
                <span className="form-item">Aún no se han adicionado áreas</span>
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
            <ModalArea areaEdit={this.state.actions.area} isOpen={this.closeModal}/>
          </div>
        </div>
      </Modal>
      <SweetAlert
        type= "warning"
        show={this.state.showConfirmDeleteArea}
        title="Eliminación área"
        text="¿Señor usuario, está seguro que desea eliminar el área?"
        confirmButtonColor= '#DD6B55'
        confirmButtonText= 'Sí, estoy seguro!'
        cancelButtonText = "Cancelar"
        showCancelButton= {true}
        onCancel= {() => this.setState({showConfirmDeleteArea: false })}
        onConfirm={this._deleteArea}/>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      deleteArea
    }, dispatch);
}

function mapStateToProps({areas}) {
    return {
        areas
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListArea);
