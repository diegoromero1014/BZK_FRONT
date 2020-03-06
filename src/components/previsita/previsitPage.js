import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid';
import SweetAlert from "../sweetalertFocus";

import HeaderPrevisita from './headerPrevisita';
import PrevisitFormComponent from './previsitFormComponent'
import PermissionUserReports from "../commercialReport/permissionsUserReports";
import { buildJsoncommercialReport, fillUsersPermissions } from '../commercialReport/functionsGenerics';
import CommercialReportButtonsComponent from '../globalComponents/commercialReportButtonsComponent';

import { detailPrevisit, canEditPrevisita, disableBlockedReport, clearPrevisitDetail, validateDatePreVisit, createPrevisit, pdfDescarga } from "./actions";
import { TIME_REQUEST_BLOCK_REPORT, MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT, EDITAR, REQUEST_ERROR, MESSAGE_SAVE_DATA, REQUEST_INVALID_INPUT, REQUEST_SUCCESS, AFIRMATIVE_ANSWER, CANCEL, SAVE_PUBLISHED } from '../../constantsGlobal';
import { showLoading } from '../loading/actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import { getMasterDataFields } from '../selectsComponent/actions';
import { redirectUrl } from '../globalComponents/actions';
import { setConfidential, addUsers } from '../commercialReport/actions';
import { addListParticipant, clearParticipants } from '../participantsVisitPre/actions';
import { changeStateSaveData } from '../main/actions';
import { getAnswerQuestionRelationship, clearAnswer, addAnswer, getAllQuestions } from '../challenger/actions';

import { PREVISIT_TYPE, FILTER_SOCIAL_STYLE } from '../selectsComponent/constants';
import { KEY_PARTICIPANT_CLIENT, KEY_PARTICIPANT_BANCO, KEY_PARTICIPANT_OTHER } from '../participantsVisitPre/constants';
import { TITLE_ERROR_PARTICIPANTS, MESSAGE_ERROR_PARTICIPANTS, TITLE_PREVISIT_CREATE, MESSAGE_PREVISIT_CREATE_SUCCESS, MESSAGE_PREVISIT_CREATE_ERROR, TITLE_PREVISIT_EDIT, MESSAGE_PREVISIT_EDIT_SUCCESS, MESSAGE_PREVISIT_EDIT_ERROR, MESSAGE_PREVISIT_INVALID_INPUT, TITLE_EXIT_CONFIRMATION, MESSAGE_EXIT_CONFIRMATION, TITLE_ERROR_VALIDITY_DATES, TITLE_VISIT_TYPE, MESSAGE_VISIT_TYPE_CHANGED, PROPUEST_OF_BUSINESS, TITLE_ERROR_EDIT_PREVISIT, MESSAGE_ERROR_EDIT_PREVISIT } from './constants';
import { ComponentClientInformationURL, LoginComponentURL } from '../../constantsAnalytics';
import { participantIsClient, changeParticipantClientDataStructure, participantIsBank, participantIsOther, changeParticipantBankDataStructure, changeParticipantOtherDataStructure, fillParticipants } from './participantsActions';
import CommercialReportInfoFooter from '../globalComponents/commercialReportInfoFooter';

import { getLinkedClientDetails, combineClientDetails } from '../listaObjetos/ListaObjetos';

import { cleanList, addToList, createList, linkedRecords } from '../elements/actions';
import { OPPORTUNITIES, WEAKNESSES } from '../opportunitiesWeaknesses/constants';

import { clientInformationToReducer, createObjectiveClientDetailRequestFromReducer } from '../fieldList/mapListsToEntities';
import { changeListState } from '../fieldList/actions';
import { listName } from '../fieldList/Objetives/utils';


const changeObjectiveState = changeListState(listName);

export class PrevisitPage extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isEditable: false,
         showMessage: false,
         userEditingPrevisita: "",
         shouldRedirect: false,
         intervalId: null,
         isMounted: false,
         renderForm: false,
         previsitTypes: [],
         showErrorBlockedPreVisit: false,
         showConfirmationCancelPrevisit: false,
         showConfirmChangeTypeVisit: false,
         showChallengerSection: false,
         oldPrevisitTypeSelected: null,
         oldPrevisitTypeSelectedId: null,
         currentPrevisitTypeSelected: null,
         setFieldValue: null,
         documentDraft: 0,
         documentCreatedInfo: {
            createdBy: null,
            updatedBy: null,
            positionCreatedBy: null,
            positionUpdatedBy: null,
            createdTimestamp: null,
            updatedTimestamp: null,
            datePrevisitLastReview: null
         },
         commercialReport: null
      };
   }

   clearList = () => {
      const { dispatchCleanList, dispatchCreateList } = this.props;

      dispatchCleanList(OPPORTUNITIES);
      dispatchCreateList(OPPORTUNITIES);

      dispatchCleanList(WEAKNESSES);
      dispatchCreateList(WEAKNESSES);
   }

   componentWillMount() {
      const { clientInformacion } = this.props;
      const infoClient = clientInformacion.get('responseClientInfo');
      if (_.isEmpty(infoClient)) {
         redirectUrl(ComponentClientInformationURL)
      }

      this.clearList();
   }


   componentDidMount() {

      const { params: { id }, dispatchShowLoading, clientInformacion, dispatchAddToList, dispatchLinkedRecords, dispatchChangeObjectivesState } = this.props;

      dispatchShowLoading(true, "Cargando...");
      //IMPORTANTE: MANTENER EL ORDEN DEL LLAMADO A GETPREVISITDATA PORQUE AFECTA EL LLAMADO A DATA[1];
      Promise.all([this.masterDataFields(), this.getPrevisitData(id), this.getChallengerQuestions()]).then((data) => {
         this.setState({
            renderForm: true,
            isMounted: true
         });

         dispatchShowLoading(false, "");

         let weaknesses = clientInformacion.get('responseClientInfo').clientDetailsRequest.weaknesses;
         let opportunities = clientInformacion.get('responseClientInfo').clientDetailsRequest.opportunities;
         let objectives = clientInformacion.get('responseClientInfo').clientDetailsRequest.objectives;

         //IMPORTANTE: MANTENER EL ORDEN DEL LLAMADO A GETPREVISITDATA PORQUE AFECTA EL LLAMADO A DATA[1];
         if (!data[1]) {
            this.clearList();

            opportunities.forEach((element, index) => dispatchAddToList({ data: Object.assign({}, element, { order: (index + 1), associated: false }), name: OPPORTUNITIES, old: null }));
            weaknesses.forEach((item, index) => dispatchAddToList({ data: Object.assign({}, item, { order: (index + 1), associated: false }), name: WEAKNESSES, old: null }));

            dispatchChangeObjectivesState({
               elements: clientInformationToReducer(objectives)
            })

         } else {
            let linkedClientDetails = data[1].payload.data.data.clientDetails;

            let linkedWeaknesses = linkedClientDetails.weaknesses;
            let linkedOpportunities = linkedClientDetails.opportunities;

            linkedWeaknesses = linkedWeaknesses.map(weakness => Object.assign({}, weakness, { editable: weakness.status !== -1 }));
            linkedOpportunities = linkedOpportunities.map(opportunity => Object.assign({}, opportunity, { editable: opportunity.status !== -1 }));

            weaknesses = combineClientDetails(linkedWeaknesses, weaknesses);
            opportunities = combineClientDetails(linkedOpportunities, opportunities);

            this.clearList();

            opportunities.sort((a, b) => (a.status > b.status) ? -1 : 1).forEach((element, index) => dispatchAddToList({ data: Object.assign({}, element, { order: (index + 1) }), name: OPPORTUNITIES, old: null }));
            weaknesses.sort((a, b) => (a.status > b.status) ? -1 : 1).forEach((item, index) => dispatchAddToList({ data: Object.assign({}, item, { order: (index + 1) }), name: WEAKNESSES, old: null }));

            dispatchChangeObjectivesState({
               elements: clientInformationToReducer(combineClientDetails(linkedClientDetails.objectives, objectives))
            })
         }

         dispatchLinkedRecords(OPPORTUNITIES);
         dispatchLinkedRecords(WEAKNESSES);
      });
   }

   componentWillUnmount() {
      const {
         dispatchDisabledBlockedReport,
         dispatchClearPrevisitDetail,
         dispatchSetConfidential,
         dispatchClearParticipants,
         dispatchClearAnswer,
         params: { id }
      } = this.props;

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
      dispatchClearParticipants();
      dispatchClearAnswer();
   }

   getPrevisitData = async (id) => {
      const { dispatchDetailPrevisit, dispatchSetConfidential, dispatchAddUsers, dispatchAddListParticipant, dispatchAddAnswer, selectsReducer } = this.props;
      if (id) {
         const response = await dispatchDetailPrevisit(id);
         const previsitDetail = response.payload.data.data;
         let participantsList = [];

         let participants = fillParticipants(
            participantsList.concat(
               previsitDetail.participatingContacts.map(value => Object.assign(value, { tipoParticipante: KEY_PARTICIPANT_CLIENT })),
               previsitDetail.participatingEmployees.map(value => Object.assign(value, { tipoParticipante: KEY_PARTICIPANT_BANCO })),
               previsitDetail.relatedEmployees.map(value => Object.assign(value, { tipoParticipante: KEY_PARTICIPANT_OTHER }))
            ));

         const previsitTypeInfo = _.find(selectsReducer.get(PREVISIT_TYPE), ['id', previsitDetail.documentType]);

         dispatchAddListParticipant(participants);
         dispatchSetConfidential(previsitDetail.commercialReport.isConfidential);
         fillUsersPermissions(previsitDetail.commercialReport.usersWithPermission, dispatchAddUsers);

         previsitDetail.answers.forEach(element => {
            dispatchAddAnswer(null, { id: element.id, [element.field]: element.answer });
         });
         this.setDatesOnPrevisitDetailState(previsitDetail);
         this.setState({
            isEditable: true,
            oldPrevisitTypeSelected: null,
            currentPrevisitTypeSelected: previsitTypeInfo ? previsitTypeInfo.key.toUpperCase() : '',
            formValid: true,
            documentDraft: previsitDetail.documentStatus,
            documentCreatedInfo: Object.assign({}, this.state.documentCreatedInfo, {
               createdBy: previsitDetail.createdByName,
               updatedBy: previsitDetail.updatedByName,
               positionCreatedBy: previsitDetail.positionCreatedBy,
               positionUpdatedBy: previsitDetail.positionUpdatedBy
            }),
            commercialReport: previsitDetail.commercialReport
         });
         return response;
      } else {
         dispatchSetConfidential(false);
         this.setState({
            isEditable: false,
            commercialReport: null
         });
      }
   }

   masterDataFields = async () => {
      const { dispatchGetMasterDataFields } = this.props;
      return await dispatchGetMasterDataFields([PREVISIT_TYPE, FILTER_SOCIAL_STYLE]);
   }

   getChallengerQuestions = async () => {
      const { dispatchGetAllQuestions } = this.props;
      return await dispatchGetAllQuestions();
   }

   validatePermissionsPrevisits = () => {
      const { reducerGlobal } = this.props;
      return _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), EDITAR), false) && this.state.isEditable;
   }

   canUserEditPrevisita = async (myUserName) => {
      const { dispatchCanEditPrevisita, params: { id }, dispatchSwtShowMessage } = this.props;
      const success = await dispatchCanEditPrevisita(id);
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
      } else {
         const username = success.payload.data.data.username;
         const name = success.payload.data.data.name;
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
      }
   }

   editPrevisit = async () => {
      const usernameSession = window.localStorage.getItem('userNameFront');
      await this.canUserEditPrevisita(usernameSession);
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

   validateParticipantsByClient = () => {
      const { participants, dispatchSwtShowMessage } = this.props;
      const participantsList = participants ? participants.toArray() : [];

      let names = "";

      participantsList.filter(participantIsClient)
         .forEach(element => {
            if (!element.interlocutorObjs || !element.interlocutorObjs.length || !element.socialStyleId) {
               names = names + ' - ' + element.nombreParticipante + ' \n';
            }
         });

      if (names !== "") {
         dispatchSwtShowMessage('error', "Error", "Señor usuario, los siguientes participantes tienen campos obligatorios sin diligenciar: " + names);
         return false;
      }

      return true;
   }

   errorClientDetails = (previsit) => {
      const { elementsReducer, fieldListReducer } = this.props;

      let errors = [];

      if (previsit.documentStatus == SAVE_PUBLISHED) {
         if (getLinkedClientDetails(elementsReducer[OPPORTUNITIES].elements).length === 0) {
            errors.push("Oportunidades (externas)");
         }

         if (getLinkedClientDetails(elementsReducer[WEAKNESSES].elements).length === 0) {
            errors.push("Debilidades (internas del cliente)");
         }

         if (getLinkedClientDetails(fieldListReducer[listName].elements).length === 0) {
            errors.push("Objetivos del cliente")
         }
      }
      return errors;
   }

   renderErrorMessage = (errors) => {
      let errorMessage = "";
      for (let index = 0; index < errors.length; index++) {
         const error = errors[index];
         errorMessage += error;
         if (index < errors.length - 1) {
            errorMessage += ', ';
         }
      }
      return errorMessage;
   }

   submitForm = async (previsit) => {
      const { params: { id }, dispatchShowLoading, dispatchCreatePrevisit, dispatchSwtShowMessage, usersPermission, confidentialReducer, answers, questions, fromModal, closeModal, elementsReducer, fieldListReducer } = this.props;
      const validateDatePrevisitResponse = await this.validateDatePrevisit(previsit);
      if (validateDatePrevisitResponse) {
         const previsitParticipants = this.getPrevisitParticipants();
         const client = window.sessionStorage.getItem('idClientSelected');

         if (!this.validateParticipantsByClient()) {
            return;
         }

         const clientDetailsErrors = this.errorClientDetails(previsit);

         if (clientDetailsErrors.length != 0) {
            dispatchSwtShowMessage("error", "Error", "Señor usuario, para guardar una previsita como definitivo debe asociar información en las siguientes secciones: " + this.renderErrorMessage(clientDetailsErrors));
            return;
         }

         if (!previsitParticipants.bankParticipants.length && previsit.documentStatus) {
            dispatchSwtShowMessage('error', TITLE_ERROR_PARTICIPANTS, MESSAGE_ERROR_PARTICIPANTS);
            return;
         }

         /* let clientDetailsRequest = buildLinkedClientDetailsRequestForSubmit(objectListReducer, window.sessionStorage.getItem('idClientSelected')); */

         let clientDetailsRequest = {
            weaknesses: elementsReducer[WEAKNESSES].elements.map(element => Object.assign({}, element, { client })) || [],
            opportunities: elementsReducer[OPPORTUNITIES].elements.map(item => Object.assign({}, item, { client })) || [],
            objectives: createObjectiveClientDetailRequestFromReducer(fieldListReducer, listName, client)
         }



         const previsitRequest = {
            "id": id,
            "client": window.sessionStorage.getItem('idClientSelected'),
            "clientDetails": clientDetailsRequest,
            "visitTime": parseInt(moment(previsit.visitTime).format('x')),
            "participatingContacts": previsitParticipants.clientParticipants.length ? previsitParticipants.clientParticipants : null,
            "participatingEmployees": previsitParticipants.bankParticipants.length ? previsitParticipants.bankParticipants : null,
            "relatedEmployees": previsitParticipants.otherParticipants.length ? previsitParticipants.otherParticipants : null,
            "principalObjective": previsit.principalObjective,
            "documentType": previsit.documentType,
            "visitLocation": previsit.visitLocation,
            "observations": previsit.observations,
            "clientTeach": previsit.clientTeach,
            "adaptMessage": previsit.adaptMessage,
            "controlConversation": previsit.controlConversation,
            "constructiveTension": previsit.constructiveTension,
            "documentStatus": previsit.documentStatus,
            "endTime": previsit.endTime,
            "commercialReport": buildJsoncommercialReport(this.state.commercialReport, usersPermission.toArray(), confidentialReducer.get('confidential'), previsit.documentStatus),
            "answers": getAnswerQuestionRelationship(answers, questions)
         };
         dispatchShowLoading(true, MESSAGE_SAVE_DATA);
         const responseCreatePrevisit = await dispatchCreatePrevisit(previsitRequest);
         dispatchShowLoading(false, "");

         if (!_.get(responseCreatePrevisit, 'payload.data.validateLogin') || _.get(responseCreatePrevisit, 'payload.data.validateLogin') === 'false') {
            if (fromModal) {
               closeModal();
            } else {
               redirectUrl(LoginComponentURL);
            }
         } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_SUCCESS) {
            this.redirectionAfterSubmit(id, ComponentClientInformationURL)
         } else if (_.get(responseCreatePrevisit, 'payload.data.status') === REQUEST_INVALID_INPUT) {
            dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), MESSAGE_PREVISIT_INVALID_INPUT);
         } else {
            dispatchSwtShowMessage('error', this.renderTitleSubmitAlert(id), this.renderMessageSubmitAlertError(id));
         }
      }
   }

   redirectionAfterSubmit = (previsitId, url) => {
      const { fromModal, closeModal, dispatchSwtShowMessage } = this.props;
      if (fromModal) {
         dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(previsitId), this.renderMessageSubmitAlertSuccess(previsitId), { onConfirmCallback: () => closeModal() });
      } else {
         dispatchSwtShowMessage('success', this.renderTitleSubmitAlert(previsitId), this.renderMessageSubmitAlertSuccess(previsitId), { onConfirmCallback: () => redirectUrl(url) });
      }
   }

   onClickCancelCommercialReport = () => {
      this.setState({ showConfirmationCancelPrevisit: true });
   }

   onClickDownloadPDF = () => {
      const { dispatchChangeStateSaveData, dispatchPdfDescarga, params: { id } } = this.props;
      dispatchPdfDescarga(dispatchChangeStateSaveData, id);
   }

   onClickConfirmCancelCommercialReport = () => {
      const { fromModal, closeModal } = this.props;
      this.setState({ showConfirmationCancelPrevisit: false });
      if (fromModal) {
         closeModal();
      } else {
         redirectUrl(ComponentClientInformationURL);
      }
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

   showChallengerSection = async (previsitTypeId, setFieldValue) => {
      const { selectsReducer } = this.props;
      const previsitTypeInfo = selectsReducer.get(PREVISIT_TYPE).find((previsit) => previsit.id == previsitTypeId);
      const oldPrevisitTypeKeySelected = this.state.oldPrevisitTypeSelected ? this.state.oldPrevisitTypeSelected.toUpperCase() : null;
      const previsitTypeKeySelected = previsitTypeInfo.key.toUpperCase();
      const previsitTypeIdSelected = previsitTypeInfo.id;

      this.setState({
         setFieldValue
      });

      if (oldPrevisitTypeKeySelected == null) {
         this.setState({
            oldPrevisitTypeSelected: previsitTypeKeySelected,
            oldPrevisitTypeSelectedId: previsitTypeIdSelected
         });
         this.validateSelectionPrevisitType(previsitTypeKeySelected);
      } else if (oldPrevisitTypeKeySelected != previsitTypeKeySelected) {
         this.setState({
            currentPrevisitTypeSelected: previsitTypeKeySelected,
            oldPrevisitTypeSelected: previsitTypeKeySelected
         });
         if (oldPrevisitTypeKeySelected == PROPUEST_OF_BUSINESS.toUpperCase()) {
            this.setState({
               showConfirmChangeTypeVisit: true
            });
         } else {
            this.validateSelectionPrevisitType(previsitTypeKeySelected);
         }
      }
   }

   validateSelectionPrevisitType = (previsitTypeKey) => {
      if (previsitTypeKey === PROPUEST_OF_BUSINESS.toUpperCase()) {
         this.setState({
            showChallengerSection: true
         });
      } else {
         this.setState({
            showChallengerSection: false
         });
      }
   }

   setDatesOnPrevisitDetailState = (previsitDetail) => {
      let createdTimestamp = null;
      let updatedTimestamp = null;

      if (previsitDetail.createdTimestamp) {
         createdTimestamp = moment(previsitDetail.createdTimestamp).locale('es');
         createdTimestamp = createdTimestamp.format("DD") + " " + createdTimestamp.format("MMM") + " " + createdTimestamp.format("YYYY") + ", " + createdTimestamp.format("hh:mm a");
      }

      if (previsitDetail.updatedTimestamp) {
         updatedTimestamp = moment(previsitDetail.updatedTimestamp).locale('es');
         updatedTimestamp = updatedTimestamp.format("DD") + " " + updatedTimestamp.format("MMM") + " " + updatedTimestamp.format("YYYY") + ", " + updatedTimestamp.format("hh:mm a");
      }

      this.setState({
         documentCreatedInfo: {
            createdTimestamp,
            updatedTimestamp,
            datePrevisitLastReview: moment(previsitDetail.reviewedDate, "x").locale('es').format("DD MMM YYYY")
         }
      });
   }

   confirmChangeTypePrevisit = () => {
      this.validateSelectionPrevisitType(this.state.currentPrevisitTypeSelected);
      this.setState({
         showConfirmChangeTypeVisit: false
      });
   }

   cancelChangeTypePrevisit = () => {
      const { setFieldValue, oldPrevisitTypeSelectedId } = this.state;
      this.setState({
         showConfirmChangeTypeVisit: false
      });
      setFieldValue("documentType", oldPrevisitTypeSelectedId, false);
   }

   validateDatePrevisit = async (previsit) => {
      const { params: { id }, dispatchValidateDatePrevisit, dispatchSwtShowMessage } = this.props;
      let visitTime = parseInt(moment(previsit.visitTime).startOf('minute').format('x'));
      let endVisitTime = parseInt(moment(visitTime).add(previsit.endTime, 'h').startOf('minute').format('x'));
      const response = await dispatchValidateDatePrevisit(visitTime, endVisitTime, id);
      if (response.payload.data.status == REQUEST_ERROR) {
         dispatchSwtShowMessage(MESSAGE_ERROR, TITLE_ERROR_VALIDITY_DATES, response.payload.data.data);
         return false;
      }
      return true;
   }

   closeShowErrorBlockedPrevisit = () => {
      this.setState({ showErrorBlockedPreVisit: false })
      if (this.state.shouldRedirect) {
         redirectUrl(ComponentClientInformationURL)
      }
   }

   renderForm = () => {
      const { params: { id }, previsitReducer, selectsReducer, fromModal, questions, answers } = this.props;
      const previsitDetail = previsitReducer.get('detailPrevisit') ? previsitReducer.get('detailPrevisit').data : null;
      return (
         <PrevisitFormComponent
            previsitData={previsitDetail}
            previsitTypes={selectsReducer.get(PREVISIT_TYPE)}
            onChangeShowChallengerSection={this.showChallengerSection}
            showChallengerSection={this.state.showChallengerSection}
            isEditable={this.state.isEditable}
            onSubmit={this.submitForm}
            questions={questions}
            answers={answers}
            previsitType={this.state.oldPrevisitTypeSelected}
            commercialReportButtons={(setFieldValue) => (
               <CommercialReportButtonsComponent
                  onClickSave={draft => setFieldValue('documentStatus', draft, true)}
                  onClickDownloadPDF={id ? this.onClickDownloadPDF : null}
                  cancel={this.onClickCancelCommercialReport}
                  fromModal={fromModal}
                  isEditable={this.state.isEditable}
                  documentDraft={this.state.documentDraft}
                  creatingReport={id ? false : true}
               />)} />
      )
   }

   render() {
      const { params: { id } } = this.props;
      const { documentCreatedInfo, isEditable } = this.state;
      return (
         <div className='previsit-container'>
            <HeaderPrevisita />
            <div style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>
               <Row style={{ padding: "5px 10px 0px 20px" }}>
                  <Col xs={10} sm={10} md={10} lg={10}>
                     <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2}>
                     {
                        this.validatePermissionsPrevisits() && isEditable &&
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
                     <PermissionUserReports disabled={isEditable ? 'disabled' : ''} />
                  </Col>
               </Row>
            </div>
            {
               this.state.renderForm ? this.renderForm() : null
            }
            {id && <CommercialReportInfoFooter documentCreatedInfo={documentCreatedInfo} />}
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
               onConfirm={this.onClickConfirmCancelCommercialReport} />
            <SweetAlert
               type="warning"
               show={this.state.showConfirmChangeTypeVisit}
               title={TITLE_VISIT_TYPE}
               text={MESSAGE_VISIT_TYPE_CHANGED}
               confirmButtonColor='#DD6B55'
               confirmButtonText={AFIRMATIVE_ANSWER}
               cancelButtonText={CANCEL}
               showCancelButton={true}
               onCancel={this.cancelChangeTypePrevisit}
               onConfirm={this.confirmChangeTypePrevisit} />
            <SweetAlert
               type="error"
               show={this.state.showErrorBlockedPreVisit}
               title={TITLE_ERROR_EDIT_PREVISIT}
               text={MESSAGE_ERROR_EDIT_PREVISIT(this.state.userEditingPrevisita)}
               onConfirm={this.closeShowErrorBlockedPrevisit} />
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
      dispatchAddUsers: addUsers,
      dispatchAddListParticipant: addListParticipant,
      dispatchPdfDescarga: pdfDescarga,
      dispatchChangeStateSaveData: changeStateSaveData,
      dispatchClearParticipants: clearParticipants,
      dispatchClearAnswer: clearAnswer,
      dispatchAddAnswer: addAnswer,
      dispatchGetAllQuestions: getAllQuestions,
      dispatchCleanList: cleanList,
      dispatchAddToList: addToList,
      dispatchCreateList: createList,
      dispatchLinkedRecords: linkedRecords,
      dispatchChangeObjectivesState: changeObjectiveState
   }, dispatch);
}

function mapStateToProps({ clientInformacion, reducerGlobal, previsitReducer, selectsReducer, usersPermission, confidentialReducer, participants, questionsReducer: { answers, questions }, objectListReducer, elementsReducer, fieldListReducer }) {
   return {
      clientInformacion,
      previsitReducer,
      reducerGlobal,
      selectsReducer,
      usersPermission,
      confidentialReducer,
      participants,
      answers,
      questions,
      objectListReducer,
      elementsReducer,
      fieldListReducer
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitPage);