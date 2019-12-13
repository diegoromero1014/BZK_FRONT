import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { redirectUrl } from '../globalComponents/actions';
import { ComponentClientInformationURL } from '../../constantsAnalytics';
import HeaderPrevisita from './headerPrevisita';
import PrevisitFormComponent from './previsitFormComponent'
import { detailPrevisit, canEditPrevisita, disableBlockedReport, clearPrevisitDetail } from "./actions";
import { showLoading } from '../loading/actions';
import { TIME_REQUEST_BLOCK_REPORT, MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, EDITAR } from '../../constantsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { Row, Col } from 'react-flexbox-grid';
import { PREVISIT_TYPE } from '../selectsComponent/constants';
import { getMasterDataFields } from '../selectsComponent/actions';

export class PrevisitPage extends Component {

   constructor(props){
      super(props);      
   }

   state = {
      isEditable: false,
      showErrorBlockedPreVisit: false,
      showMessage: false,
      userEditingPrevisita: "",
      shouldRedirect: false,
      intervalId: null,
      isMounted: false,
      renderForm: false,
      previsitTypes: []
   };

   componentWillMount() {
      const { params: { id }, clientInformacion } = this.props;
      const infoClient = clientInformacion.get('responseClientInfo');
/* 
      if (_.isEmpty(infoClient)) {
         redirectUrl(ComponentClientInformationURL)
      } */

      this.getPrevisitTypes();
      this.getPrevisitData(id);  
      this.setState({
         renderForm: true
      })          
   }

   componentDidMount() {
      this.setState({
         isMounted: true
      });
   }

   componentWillUnmount() {
      const { dispatchDisabledBlockedReport, dispatchClearPrevisitDetail, params: { id } } = this.props;

      // Detener envio de peticiones para bloquear el informe
      clearInterval(this.state.intervalId)
      this.setState({
         isMounted: false
      });

      if (this.state.isEditable) {         
         dispatchDisabledBlockedReport(id);         
      }
      dispatchClearPrevisitDetail();
   }

   getPrevisitData = async (id)=> {
      const { dispatchDetailPrevisit } = this.props;
      if (id) {
         showLoading(true, "Cargando...");
         await dispatchDetailPrevisit(id); 
         showLoading(false, null);
         this.setState({
            isEditable: true      
         });
      }else{
         this.setState({
            isEditable: false           
         });
      }      
   }

   getPrevisitTypes = async () => {
      const {dispatchGetMasterDataFields, selectsReducer} = this.props;
      await dispatchGetMasterDataFields([PREVISIT_TYPE]);
      this.setState({
         previsitTypes: selectsReducer.get(PREVISIT_TYPE) || []
      });
   }

   validatePermissionsPrevisits = () => {
      const { reducerGlobal } = this.props;      
      return _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) && this.state.isEditable;
   }

   canUserEditPrevisita = (myUserName) => {          
      const { dispatchCanEditPrevisita, params: { id }, dispatchSwtShowMessage } = this.props;
      dispatchCanEditPrevisita(id).then((success) => {
         const username = success.payload.data.data.username
         const name = success.payload.data.data.name

         if (!this.state.isMounted) {
            clearInterval(this.state.intervalId);            
         }

         if (success.payload.data.data == null) {
            clearInterval(this.state.intervalId);
            this.setState({ 
               showErrorBlockedPreVisit: true, 
               userEditingPrevisita: "Error", 
               shouldRedirect: true 
            });            
         }

         if (_.isNull(username)) {            
            dispatchSwtShowMessage(MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT);            
         } else if (username.toUpperCase() === myUserName.toUpperCase()) {
            // Usuario pidiendo permiso es el mismo que esta bloqueando
            if (this.state.isEditable) {
               // Tengo permiso de editar y no estoy editando
               this.setState({
                  showErrorBlockedPreVisit: false,
                  showMessage: false,
                  isEditable: false,
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
         }
         showLoading(false, null);
      });
   }

   editPrevisit = () => {            
      showLoading(true, "Cargando...");
      const usernameSession = window.localStorage.getItem('userNameFront');      
      this.canUserEditPrevisita(usernameSession);      
   }

   submitForm = (data) => {

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
                        this.validatePermissionsPrevisits() && this.state.isEditable &&
                        <button type="button" onClick={this.editPrevisit}
                           className={'btn btn-primary modal-button-edit'}
                           style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>
                           Editar <i className={'icon edit'}></i>
                        </button>
                     }
                  </Col>
               </Row>
            </div>            
            {
               this.state.renderForm && previsitReducer ?
                  <PrevisitFormComponent 
                     previsitData={previsitReducer.get('detailPrevisit') ? 
                        previsitReducer.get('detailPrevisit').data : null} 
                     previsitTypes={this.state.previsitTypes}
                     isEditable={this.state.isEditable} 
                     onSubmit={this.submitForm}/>
               : null
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
      dispatchSwtShowMessage: swtShowMessage,
      dispatchDisabledBlockedReport: disableBlockedReport,
      dispatchClearPrevisitDetail: clearPrevisitDetail,
      dispatchGetMasterDataFields: getMasterDataFields
   }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, previsitReducer, selectsReducer }) {
   return {
      clientInformacion,
      previsitReducer,
      reducerGlobal,
      selectsReducer
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);