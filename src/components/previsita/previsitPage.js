import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HeaderPrevisita from './headerPrevisita';
import PrevisitFormComponent from './previsitFormComponent'
import { detailPrevisit, canEditPrevisita, disableBlockedReport, clearPrevisitDetail, validateDatePreVisit, createPrevisit } from "./actions";
import { showLoading } from '../loading/actions';
import { TIME_REQUEST_BLOCK_REPORT, MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, EDITAR, REQUEST_ERROR, MESSAGE_SAVE_DATA, REQUEST_INVALID_INPUT, REQUEST_SUCCESS } from '../../constantsGlobal';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { Row, Col } from 'react-flexbox-grid';
import { PREVISIT_TYPE } from '../selectsComponent/constants';
import { getMasterDataFields } from '../selectsComponent/actions';
import { redirectUrl } from '../globalComponents/actions';
import { PermissionUserReports } from '../commercialReport/permissionsUserReports';
import { buildJsoncommercialReport } from '../commercialReport/functionsGenerics';
import moment from 'moment';

export class PrevisitPage extends Component {

   constructor(props) {
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
      const { clientInformacion } = this.props;
      const infoClient = clientInformacion.get('responseClientInfo');
      /* 
            if (_.isEmpty(infoClient)) {
               redirectUrl(ComponentClientInformationURL)
            } */
   }

   componentDidMount() {
      const { params: { id }, dispatchShowLoading } = this.props;
      dispatchShowLoading(true, "Cargando...");

      Promise.all([this.getPrevisitTypes(), this.getPrevisitData(id)]).then(() => {
         this.setState({
            renderForm: true,
            isMounted: true
         });
         dispatchShowLoading(false, "");
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

   getPrevisitData = async (id) => {
      const { dispatchDetailPrevisit } = this.props;
      if (id) {
         await dispatchDetailPrevisit(id);
         this.setState({
            isEditable: true
         });
      } else {
         this.setState({
            isEditable: false
         });
      }
   }

   getPrevisitTypes = async () => {
      const { dispatchGetMasterDataFields } = this.props;
      await dispatchGetMasterDataFields([PREVISIT_TYPE]);
   }

   validatePermissionsPrevisits = () => {
      const { reducerGlobal } = this.props;
      return _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) && this.state.isEditable;
   }

   canUserEditPrevisita = (myUserName) => {
      const { dispatchCanEditPrevisita, params: { id }, dispatchSwtShowMessage, dispatchShowLoading } = this.props;
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
         dispatchShowLoading(false, "");
      });
   }

   editPrevisit = () => {
      const { dispatchShowLoading } = this.props;
      dispatchShowLoading(true, "Cargando...");
      const usernameSession = window.localStorage.getItem('userNameFront');
      this.canUserEditPrevisita(usernameSession);
      dispatchShowLoading(false, "");
   }

   submitForm = async (previsit, isDraft) => {
      const { dispatchShowLoading, dispatchCreatePrevisit, usersPermission, confidentialReducer } = this.props;
      const validateDatePrevisitResponse = await this.validateDatePrevisit(previsit);      

      try {
         if (validateDatePrevisitResponse) {
            const previsitRequest = {
               "id": null,
               "client": window.sessionStorage.getItem('idClientSelected'),
               "visitTime": parseInt(moment(previsit.datePreVisit).format('x')),
               "participatingContacts": previsit.dataClient.length === 0 ? null : dataClient,
               "participatingEmployees": previsit.dataBanco.length === 0 ? null : dataBanco,
               "relatedEmployees": previsit.dataOthers.length === 0 ? null : dataOthers,
               "principalObjective": previsit.targetPrevisit,
               "documentType": previsit.typePreVisit,
               "visitLocation": previsit.lugarPrevisit,
               "observations": previsit.pendingPrevisit,
               "clientTeach": previsit.clientTeach,
               "adaptMessage": previsit.adaptMessage,
               "controlConversation": previsit.controlConversation,
               "constructiveTension": previsit.constructiveTension,
               "documentStatus": typeButtonClick,
               "endTime": previsit.durationPreVisit,
               "commercialReport": buildJsoncommercialReport(null, usersPermission.toArray(), confidentialReducer.get('confidential'), isDraft)
            };            
            dispatchShowLoading(true, MESSAGE_SAVE_DATA);
            const responseCreatePrevisit = await dispatchCreatePrevisit(previsitRequest);
            dispatchShowLoading(false, "");
            if (!_.get(responseCreatePrevisit, 'payload.data.validateLogin') || _.get(responseCreatePrevisit, 'payload.data.validateLogin') === 'false') {
               redirectUrl("/login");
            } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_SUCCESS) {
               swtShowMessage('success', "Creación previsita", "Señor usuario, la previsita se creó de forma exitosa.", { onConfirmCallback: redirectUrl("/dashboard/clientInformation") });
            } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_INVALID_INPUT) {
               swtShowMessage('error', "Creación previsita", "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.");
            } else {
               swtShowMessage('error', "Creación previsita", "Señor usuario, ocurrió un error creando la previsita.");
            }
         }
      } catch (error) {
         swtShowMessage('error', "Creación previsita", "Señor usuario, ocurrió un error creando la previsita.");
      }
   }

   validateDatePrevisit = async (previsit) => {
      const { dispatchValidateDatePrevisit, dispatchSwtShowMessage } = this.props;
      let visitTime = parseInt(moment(previsit.visitTime).startOf('minute').format('x'));
      let endVisitTime = parseInt(moment(previsit.visitTime).add(previsit.endTime, 'h').startOf('minute').format('x'));
      const response = await dispatchValidateDatePrevisit(visitTime, endVisitTime);
      if (response.status == REQUEST_ERROR) {
         dispatchSwtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', response.data);
         return false;
      }
      return true;
   }

   renderForm = () => {
      const { previsitReducer, selectsReducer } = this.props;
      return (
         <div>            
            <PrevisitFormComponent
               previsitData={previsitReducer.get('detailPrevisit') ? previsitReducer.get('detailPrevisit').data : null}
               previsitTypes={selectsReducer.get(PREVISIT_TYPE)}
               isEditable={this.state.isEditable}
               onSubmit={this.submitForm} />
         </div>);
   }

   render() {
      return (
         <div>
            <HeaderPrevisita />
            <div>
               <Row>
                  <Col xs={12} md={12} lg={12}>
                     <PermissionUserReports />
                  </Col>
               </Row>
            </div>
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
               this.state.renderForm ? this.renderForm() : null
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
      dispatchGetMasterDataFields: getMasterDataFields,
      dispatchValidateDatePrevisit: validateDatePreVisit,
      dispatchCreatePrevisit: createPrevisit
   }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, previsitReducer, selectsReducer, usersPermission, confidentialReducer }) {
   return {
      clientInformacion,
      previsitReducer,
      reducerGlobal,
      selectsReducer,
      usersPermission,
      confidentialReducer
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);