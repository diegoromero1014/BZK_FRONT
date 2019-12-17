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
import PermissionUserReports from "../commercialReport/permissionsUserReports";
import { buildJsoncommercialReport, fillUsersPermissions } from '../commercialReport/functionsGenerics';
import moment from 'moment';
import _ from 'lodash';
import { ComponentClientInformationURL, LoginComponentURL } from '../../constantsAnalytics';
import { participantIsClient, changeParticipantClientDataStructure, participantIsBank, participantIsOther, changeParticipantBankDataStructure, changeParticipantOtherDataStructure } from './participantsActions';
import { TITLE_ERROR_PARTICIPANTS, MESSAGE_ERROR_PARTICIPANTS, TITLE_PREVISIT_CREATE, MESSAGE_PREVISIT_CREATE_SUCCESS, MESSAGE_PREVISIT_CREATE_ERROR, TITLE_PREVISIT_EDIT, MESSAGE_PREVISIT_EDIT_SUCCESS, MESSAGE_PREVISIT_EDIT_ERROR, MESSAGE_PREVISIT_INVALID_INPUT } from './constants';
import { setConfidential, addUsers } from '../commercialReport/actions';
import CommercialReportButtonsComponent from '../globalComponents/commercialReportButtonsComponent';

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
      previsitTypes: [],
      showConfirmationCancelPrevisit: false
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
      const { dispatchDisabledBlockedReport, dispatchClearPrevisitDetail, dispatchSetConfidential, params: { id } } = this.props;

      // Detener envio de peticiones para bloquear el informe
      clearInterval(this.state.intervalId)
      this.setState({
         isMounted: false
      });

      if (this.state.isEditable) {
         dispatchDisabledBlockedReport(id);
      }
      dispatchClearPrevisitDetail();
      dispatchSetConfidential(false);
   }

   getPrevisitData = async (id) => {
      const { dispatchDetailPrevisit, dispatchSetConfidential, dispatchAddUsers } = this.props;
      if (id) {
         const previsitDetail = await dispatchDetailPrevisit(id);
         dispatchSetConfidential(previsitDetail.payload.data.data.commercialReport.isConfidential);         
         fillUsersPermissions(previsitDetail.payload.data.data.commercialReport.usersWithPermission, dispatchAddUsers);
         this.setState({
            isEditable: true
         });
      } else {
         dispatchSetConfidential(false);
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

   getPrevisitParticipants = () => {
      const { participants } = this.props;
      const participantsList = participants ? participants.toArray() : [];
      let previsitParticipants = {
         clientParticipants: [],
         bankParticipants: [],
         otherParticipants: []
      };
      previsitParticipants.clientParticipants = participantsList
         .filter(participantIsClient)
         .map(changeParticipantClientDataStructure);

      previsitParticipants.bankParticipants = participantsList
         .filter(participantIsBank)
         .map(changeParticipantBankDataStructure);

      previsitParticipants.otherParticipants = participantsList
         .filter(participantIsOther)
         .map(changeParticipantOtherDataStructure);      
      return previsitParticipants;
   }

   submitForm = async (previsit, documentStatus) => {
      const { params: { id }, dispatchShowLoading, dispatchCreatePrevisit, dispatchSwtShowMessage, usersPermission, confidentialReducer } = this.props;
      const validateDatePrevisitResponse = await this.validateDatePrevisit(previsit);      
      if (validateDatePrevisitResponse) {                  
         const previsitParticipants = this.getPrevisitParticipants();         
         if(!previsitParticipants.bankParticipants.length){
            dispatchSwtShowMessage('error', TITLE_ERROR_PARTICIPANTS, MESSAGE_ERROR_PARTICIPANTS);
            return; 
         }
         const previsitRequest = {
            "id": id,
            "client": window.sessionStorage.getItem('idClientSelected'),
            "visitTime": parseInt(moment(previsit.date).format('x')),
            "participatingContacts": previsitParticipants.clientParticipants.length ? previsitParticipants.clientParticipants : null,
            "participatingEmployees": previsitParticipants.bankParticipants.length ? previsitParticipants.bankParticipants : null,
            "relatedEmployees": previsitParticipants.otherParticipants.length ? previsitParticipants.otherParticipants : null,
            "principalObjective": previsit.targetPrevisit,
            "documentType": previsit.typeVisit,
            "visitLocation": previsit.place,
            "observations": previsit.pendingPrevisit,
            "clientTeach": previsit.clientTeach,
            "adaptMessage": previsit.adaptMessage,
            "controlConversation": previsit.controlConversation,
            "constructiveTension": previsit.constructiveTension,
            "documentStatus": documentStatus,
            "endTime": previsit.duration,
            "commercialReport": buildJsoncommercialReport(null, usersPermission.toArray(), confidentialReducer.get('confidential'), documentStatus)
         };         
         dispatchShowLoading(true, MESSAGE_SAVE_DATA);
         const responseCreatePrevisit = await dispatchCreatePrevisit(previsitRequest);
         dispatchShowLoading(false, "");

         if (!_.get(responseCreatePrevisit, 'payload.data.validateLogin') || _.get(responseCreatePrevisit, 'payload.data.validateLogin') === 'false') {
            redirectUrl(LoginComponentURL);
         } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_SUCCESS) {
            dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(id), this.renderMessageSubmitAlertSuccess(id), { onConfirmCallback: redirectUrl(ComponentClientInformationURL) });
         } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_INVALID_INPUT) {
            dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), MESSAGE_PREVISIT_INVALID_INPUT);
         } else {
            dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), this.renderMessageSubmitAlertError(id));
         }
      }
   }

   onClickSaveCommercialReport = (isDraft) => {
      this.submitForm({}, isDraft);
   }

   onClickCancelCommercialReport = () => {
      this.setState({ showConfirmationCancelPrevisit: true });
   }

   redirectToClientInformation = () => {
      this.setState({ showConfirmationCancelPrevisit: false });
      redirectUrl(ComponentClientInformationURL);
   }


   renderTitleSubmitAlert = (id) => {      
      return id ? TITLE_PREVISIT_EDIT : TITLE_PREVISIT_CREATE;
   }

   renderMessageSubmitAlertSuccess = (id) => {
      return id ? MESSAGE_PREVISIT_EDIT_SUCCESS : MESSAGE_PREVISIT_CREATE_SUCCESS;
   }

   renderMessageSubmitAlertError = (id) => {
      return id ? MESSAGE_PREVISIT_EDIT_ERROR : MESSAGE_PREVISIT_CREATE_ERROR;
   }

   validateDatePrevisit = async previsit => {
      const { dispatchValidateDatePrevisit, dispatchSwtShowMessage } = this.props;
      let visitTime = parseInt(moment(previsit.date).startOf('minute').format('x'));
      let endVisitTime = parseInt(moment(visitTime).add(previsit.duration, 'h').startOf('minute').format('x'));
      const response = await dispatchValidateDatePrevisit(visitTime, endVisitTime);
      if (response.payload.data.status == REQUEST_ERROR) {
         dispatchSwtShowMessage(MESSAGE_ERROR, 'Vigencia de fechas', response.payload.data.data);
         return false;
      }
      return true;
   }

   renderForm = () => {
      const { previsitReducer, selectsReducer } = this.props;
      return <PrevisitFormComponent
               previsitData={previsitReducer.get('detailPrevisit') ? previsitReducer.get('detailPrevisit').data : null}
               previsitTypes={selectsReducer.get(PREVISIT_TYPE)}
               isEditable={this.state.isEditable}
               onSubmit={this.submitForm} />;
   }

   render() {
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
               <Row>
                  <Col xs={12} md={12} lg={12}>
                     <PermissionUserReports />
                  </Col>
               </Row>
            </div>
            {
               this.state.renderForm ? this.renderForm() : null
            }
            <div>
               <CommercialReportButtonsComponent onClickSave={this.onClickSaveCommercialReport} cancel={this.onClickCancelCommercialReport}/>
            </div>
            <SweetAlert
               type="warning"
               show={this.state.showConfirmationCancelPrevisit}
               title={TITLE_EXIT_CONFIRMATION}
               text={MESSAGE_EXIT_CONFIRMATION}
               confirmButtonColor='#DD6B55'
               confirmButtonText={AFIRMATIVE_ANSWER}
               cancelButtonText={CANCEL}
               showCancelButton={true}
               onCancel={() => this.setState({ showConfirmationCancelPrevisit: false })}
               onConfirm={this.redirectToClientInformation} />
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
      dispatchCreatePrevisit: createPrevisit,
      dispatchSetConfidential: setConfidential,
      dispatchAddUsers: addUsers
   }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, previsitReducer, selectsReducer, usersPermission, confidentialReducer, participants }) {
   return {
      clientInformacion,
      previsitReducer,
      reducerGlobal,
      selectsReducer,
      usersPermission,
      confidentialReducer,
      participants
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);