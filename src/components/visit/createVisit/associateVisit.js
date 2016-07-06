import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {previsitByClientFindServer, clearPrevisit} from '../../previsita/actions';
import {changeIdPrevisit} from '../actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import $ from 'jquery';
import _ from 'lodash';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';

var labelPrevistVist = "En esta sección podrá asociar un informe de previsita (registrado previamente) "
    + "al informe de visita que se esté realizando.\n Asociar una previsita a la visita te permitirá llevar "
    + "trazabilidad entre los informes y se diligenciará automáticamente la información de los participantes, "
    + "fecha y hora de la visita";

class ButtonAssociateComponent extends Component {

  constructor(props){
      super(props);
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
      this._renderRow = this._renderRow.bind(this);
      this._associtate = this._associtate.bind(this);
      this._idPrevisit = this._idPrevisit.bind(this);
      this.state = {
        show: false,
        idPrevisit : 0,
        showEx:false,
        modalIsOpen: false
      };
  }

  openModal(){
    this.setState({modalIsOpen: true});
    const {previsitByClientFindServer, clearPrevisit,previsitReducer} = this.props;
    clearPrevisit();
    previsitByClientFindServer(window.localStorage.getItem('idClientSelected'), 0, 5, "pvd.visitTime", 1, "");
  }

  _renderRow(){
        const {previsitReducer,changeIdPrevisit} = this.props;
	      const data = previsitReducer.get('previsitList');
        return data.map((value, index) => {
          var dateVisitFormat = moment(value.datePrevisit).locale('es');
            return (
              <a className="item" key={index}>
              <div className="ui prueba slider checkbox"
                ref={checkbox => {
                  $(checkbox).checkbox({
                    onChecked: () => this._idPrevisit(value.id)
                  });
                }}
              >
              <input type="radio" name="frequency"/>
                <label>{dateVisitFormat.format("DD") + " " + dateVisitFormat.format("MMM") + " " + dateVisitFormat.format("YYYY")+ ", " + dateVisitFormat.format("hh:mm a")}</label>
              </div>
              </a>
            );

        });
    }

    _idPrevisit(id){
      var self = this;
      setTimeout(function(){
        self.setState({idPrevisit: id,show:true});
      }, 500);
    }


    _associtate(){
      const {changeIdPrevisit,visitReducer} = this.props;
      changeIdPrevisit(this.state.idPrevisit);
      this.setState({showEx:true});
    }


  closeModal(){
    this.setState({show: false });
    this.setState({showEx: false });
    this.setState({modalIsOpen: false});
  }

  render() {
    const {changeIdPrevisit,visitReducer} = this.props;
    let visibleTable = 'none';
    let visibleMessage = 'block';
    const {previsitReducer} = this.props;
    if(previsitReducer.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <Col xs={2} sm={2} md={2} lg={2}>
          <button type="button" onClick={this.openModal} className={'btn btn-primary modal-button-edit'} style={{marginRight:'15px', float:'right', marginTop:'-15px'}}>Asociar previsita</button>
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                className="modalBt4-fade modal fade contact-detail-modal in">
                <div className="modalBt4-dialog">
                    <div className="modalBt4-content modal-content">
                      <div className="modalBt4-header modal-header">
                          <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Asociar previsita</h4>
                          <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                            <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                            <span className="sr-only">Close</span>
                          </button>
                      </div>
                      <form>
                      <div style= {{display: visibleTable, margin: '20px 20px 20px 20px'}}>
                        <span style={{fontWeight: 'normal', color: '#4C5360'}}>{labelPrevistVist}</span>
                      </div>
                      <div className="ui divided selection list" style={{margin: '20px 20px 20px 20px',border: '1px solid',borderColor: '#DDDDDD',display: visibleTable}}>
                          {this._renderRow()}
                      </div>

                      <div style= {{display: visibleMessage,margin: '20px 20px 20px 20px'}}><span style={{fontWeight: 'bold', color: '#4C5360'}}>No se han encontrado previsitas a asociar</span>
                      </div>
                      <SweetAlert
                        type= "warning"
                        show={this.state.show}
                        title="Confirmación asociación"
                        confirmButtonColor= '#DD6B55'
                        confirmButtonText= 'Sí, estoy seguro!'
                        cancelButtonText = "Cancelar"
                        text="Señor usuario ¿seguro que desea asociar la previsita seleccionada?"
                        showCancelButton= {true}
                        onCancel= {() => this.setState({show: false })}
                        onConfirm={() => this._associtate()}/>
                        <SweetAlert
                         type= "success"
                         show={this.state.showEx}
                         title="Asociada"
                         onConfirm={() => this.closeModal()}
                         />
                      </form>
                  </div>
                    </div>
            </Modal>
          </Col>
    );
  }
}



function mapDispatchToProps(dispatch){
  return bindActionCreators({
    previsitByClientFindServer, clearPrevisit,changeIdPrevisit
  }, dispatch);
}

function mapStateToProps({previsitReducer,visitReducer}, ownerProps){
    return {
        previsitReducer,visitReducer
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(ButtonAssociateComponent);
