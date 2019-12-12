import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { redirectUrl } from '../globalComponents/actions';
import { ComponentClientInformationURL } from '../../constantsAnalytics';
import HeaderPrevisita from './headerPrevisita';
import PrevisitFormComponent from './previsitFormComponent'
import { detailPrevisit, canEditPrevisita } from "./actions";
import { showLoading } from '../loading/actions';
import { TIME_REQUEST_BLOCK_REPORT, MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, EDITAR } from '../../constantsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { Row, Col } from 'react-flexbox-grid';

export class PrevisitPage extends Component {

   state = {
      isEditable: false,
      showErrorBlockedPreVisit: false,
      showMessage: false,
      userEditingPrevisita: "",
      shouldRedirect: false, 
      intervalId: null,
   };

   componentWillMount() {
      const { params: { id }, clientInformacion } = this.props;
      const infoClient = clientInformacion.get('responseClientInfo');
/* 
      if (_.isEmpty(infoClient)) {
         redirectUrl(ComponentClientInformationURL)
      } */

      this.getPrevisitData(id);
   }

   componentWillUnmount() {
   }

   getPrevisitData = id => {
      const { dispatchDetailPrevisit } = this.props;
      if (id) {
         dispatchDetailPrevisit(id).then(() => {
            this.setState({
               isEditable: true
            });
         });
      }
   }

   validatePermissionsPrevisits = () => {
      const { reducerGlobal } = this.props;
      return _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) && (!this.state.isEditable);
   }

   canUserEditPrevisita(myUserName) {
      const { dispatchCanEditPrevisita, params: { id }, dispatchSwtShowMessage } = this.props;

      return dispatchCanEditPrevisita(id).then((success) => {
         let username = success.payload.data.data.username
         let name = success.payload.data.data.name

         if (!this._ismounted) {
            clearInterval(this.state.intervalId);
            return;
         }

         if (success.payload.data.data == null) {
            clearInterval(this.state.intervalId);
            this.setState({ showErrorBlockedPreVisit: true, userEditingPrevisita: "Error", shouldRedirect: true })
            return;
         }

         if (_.isNull(username)) {
            // Error servidor
            dispatchSwtShowMessage(MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT);
            return Promise.reject(new Error('Error interno del servidor'))
         } else if (username.toUpperCase() === myUserName.toUpperCase()) {
            // Usuario pidiendo permiso es el mismo que esta bloqueando
            if (!this.state.isEditable) {
               // Tengo permiso de editar y no estoy editando

               this.setState({
                  showErrorBlockedPreVisit: false,
                  showMessage: false,
                  isEditable: true,
                  intervalId: setInterval(
                     () => { this.canUserEditPrevisita(myUserName) },
                     TIME_REQUEST_BLOCK_REPORT
                  )
               })
            }
         } else {
            // El reporte esta siendo editado por otra persona

            if (this.state.isEditable) {
               // Estoy editando pero no tengo permisos
               // Salir de edicion y detener intervalo
               this.setState({
                  showErrorBlockedPreVisit: true, 
                  userEditingPrevisita: name,
                  shouldRedirect: true, 
                  isEditable: false
               });

               clearInterval(this.state.intervalId);
            } else {
               // Mostar mensaje de el usuario que tiene bloqueado el informe
               this.setState({ showErrorBlockedPreVisit: true, userEditingPrevisita: name, shouldRedirect: false })
            }

            return Promise.reject(new Error('el reporte se encuentra bloqueado por otro usuario'));
         }

         return success
      })

   }

   editPrevisit = () => {
      showLoading(true, "Cargando...");
      const usernameSession = window.localStorage.getItem('userNameFront')

      this.canUserEditPrevisita(usernameSession).then(() => {
         showLoading(false, null);
      }).catch(() => {
         showLoading(false, null);
      })
   }

   render() {
      const { previsitReducer } = this.props;
      return (
         <div>
            <HeaderPrevisita />
            <div style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
               <Row style={{ padding: "5px 10px 0px 20px" }}>
                  <Col xs={10} sm={10} md={10} lg={10}>
                     <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2}>
                     {
                        this.validatePermissionsPrevisits() &&
                        <button type="button" onClick={this.editPreVisit}
                           className={'btn btn-primary modal-button-edit'}
                           style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>
                           Editar <i className={'icon edit'}></i>
                        </button>
                     }
                  </Col>
               </Row>
            </div>
            {
               previsitReducer.get('detailPrevisit') ?
                  <PrevisitFormComponent previsitReducer={previsitReducer} isEditable={this.state.isEditable} /> : null
            }
         </div>
      )
   }
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators({
      dispatchDetailPrevisit: detailPrevisit,
      dispatchShowLoading: showLoading,
      dispatchCanEditPrevisita: canEditPrevisita,
      dispatchSwtShowMessage: swtShowMessage
   }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, previsitReducer }) {
   return {
      clientInformacion,
      previsitReducer,
      reducerGlobal
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);