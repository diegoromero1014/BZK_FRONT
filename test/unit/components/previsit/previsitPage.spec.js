import React from 'react';
import Immutable from 'immutable';
import { PrevisitPage } from '../../../../src/components/previsita/previsitPage';
import HeaderPrevisita from '../../../../src/components/previsita/headerPrevisita';
import PermissionUserReports from '../../../../src/components/commercialReport/permissionsUserReports';
import PrevisitFormComponent from '../../../../src/components/previsita/previsitFormComponent';
import SweetAlert from '../../../../src/components/sweetalertFocus';
import { TITLE_PREVISIT_EDIT, TITLE_PREVISIT_CREATE, MESSAGE_PREVISIT_EDIT_SUCCESS, MESSAGE_PREVISIT_CREATE_SUCCESS, MESSAGE_PREVISIT_EDIT_ERROR, MESSAGE_PREVISIT_CREATE_ERROR, PROPUEST_OF_BUSINESS, TRACING } from '../../../../src/components/previsita/constants';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import { EDITAR, REQUEST_SUCCESS, REQUEST_INVALID_INPUT, REQUEST_ERROR } from '../../../../src/constantsGlobal';
import { PREVISIT_TYPE } from '../../../../src/components/selectsComponent/constants';


const validateEnter = true;
const ownerDraft = true;
const detailPrevisit = {
    data:{
        createdByName:"",
        updatedByName:"",
        positionCreatedBy:"",
        positionUpdatedBy:"",
        updatedTimestamp:"",
        createdTimestamp:""

    }
};
const previsitTypes = [
    {"id":1,"field":"previsitType","value":"Propuesta de negocio","parentId":null,"key":"Propuesta","description":""},
    {"id":2,"field":"previsitType","value":"Seguimiento","parentId":null,"key":"Seguimiento","description":""}];
let dispatchShowLoading;
let dispatchGetMasterDataFields;
let dispatchSetConfidential;
let dispatchValidateDatePrevisit;
let dispatchSwtShowMessage;
let dispatchPdfDescarga;
let dispatchCanEditPrevisita;
let dispatchDetailPrevisit;
let dispatchAddListParticipant;
let dispatchAddUsers;
let dispatchCreatePrevisit;
let defaultProps = {};
let redirectUrl;
let stubLocalStorage;
let setFieldValue;
let closeModal;
let selectsReducer;

describe('Test previsitPage', () => {        

    beforeEach(() => {                    
        dispatchShowLoading = spy(sinon.fake());
        dispatchSetConfidential = spy(sinon.fake());
        dispatchSwtShowMessage = spy(sinon.fake());
        dispatchPdfDescarga = sinon.fake();
        dispatchAddUsers = sinon.fake();
        dispatchAddListParticipant = spy(sinon.fake());
        dispatchCanEditPrevisita = sinon.stub();   
        dispatchDetailPrevisit = sinon.stub();
        dispatchCreatePrevisit = sinon.stub();        
        dispatchCreatePrevisit.resolves({
            payload: {
                data: {
                    validateLogin: true,
                    status: REQUEST_SUCCESS
                }
            }
        });
        selectsReducer = Immutable.Map({ previsitType: previsitTypes });
        
        dispatchGetMasterDataFields = sinon.stub();        
        dispatchGetMasterDataFields.resolves({
            masterDataDetailEntries: previsitTypes
        });
        redirectUrl = sinon.stub(globalActions, "redirectUrl");      
        setFieldValue = sinon.stub();        
        closeModal = spy(sinon.fake());
        defaultProps = {
            params: {},
            answers: [],
            questions: [],
            usersPermission: Immutable.List([{name: 'daegalle'}]),
            clientInformacion: Immutable.Map({responseClientInfo: {name: 'daniel'}}),
            previsitReducer: Immutable.Map({ detailPrevisit , ownerDraft}),
            reducerGlobal: Immutable.Map({ 
                validateEnter, 
                permissionsPrevisits: [EDITAR]
            }),      
            selectsReducer,            
            confidentialReducer: Immutable.Map({ }),
            dispatchShowLoading,
            dispatchGetMasterDataFields,
            dispatchSetConfidential,
            dispatchSwtShowMessage,
            dispatchPdfDescarga,
            dispatchDetailPrevisit,
            dispatchAddListParticipant,
            dispatchAddUsers,
            dispatchCreatePrevisit,
            participants: [],
            fromModal: false,
            closeModal
        };      
    });

    afterEach(() => {
        redirectUrl.restore();               
    })

    describe('Rendering unit test', () => {
        it('should render previsitPage', () => {
            itRenders(<PrevisitPage {...defaultProps}/>)
        });    

        it('should redirectUrl when render previsitPage', () => {
            defaultProps.clientInformacion = Immutable.Map({responseClientInfo: {}});
            itRenders(<PrevisitPage {...defaultProps}/>);                                                              
            sinon.assert.called(redirectUrl);
        });
    
        it('should render HeaderPrevisita', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            expect(wrapper.find(<HeaderPrevisita/>))
        });
    
        it('should render Editar button when validatePermissionsPrevisit is true and state isEditable is true', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);    
            wrapper.instance().validatePermissionsPrevisits = () => {
                return true;
            }        
            wrapper.update();
            wrapper.setState({ isEditable: true });
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(1);
        });
    
        it('shouldnt render Editar button when validatePermissionsPrevisit is false and state isEditable is true', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);    
            wrapper.instance().validatePermissionsPrevisits = () => {
                return false;
            }        
            wrapper.update();
            wrapper.setState({ isEditable: true });
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(0);
        });
    
        it('shouldnt render Editar button when validatePermissionsPrevisit is true and state isEditable is false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);    
            wrapper.instance().validatePermissionsPrevisits = () => {
                return true;
            }        
            wrapper.update();
            wrapper.setState({ isEditable: false });
            expect(wrapper.find('.modal-button-edit')).to.have.lengthOf(0);
        });
    
        it('should render PermissionUserReports', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            expect(wrapper.contains(<PermissionUserReports disabled={''}/>)).to.equal(true);                  
        });
    
        it('should render PrevisitFormComponent when state renderForm is true', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({renderForm: true});                
            expect(wrapper.find(PrevisitFormComponent)).to.have.lengthOf(1);
        });
    
        it('shouldnt render PrevisitFormComponent when state renderForm is false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({renderForm: false});                
            expect(wrapper.find(PrevisitFormComponent)).to.have.lengthOf(0);
        });
    
        it('should render SweetAlert child component', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            expect(wrapper.find(SweetAlert)).to.have.lengthOf(2);
        });    

        it('should render title previsit edit', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderTitleSubmitAlert(123);
            expect(result).to.equal(TITLE_PREVISIT_EDIT);
        });

        it('should render title previsit create', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderTitleSubmitAlert();
            expect(result).to.equal(TITLE_PREVISIT_CREATE);
        });

        it('should render title message submit alert success edit', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertSuccess(123);
            expect(result).to.equal(MESSAGE_PREVISIT_EDIT_SUCCESS);
        });

        it('should render title message submit alert success create', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertSuccess();
            expect(result).to.equal(MESSAGE_PREVISIT_CREATE_SUCCESS);
        });

        it('should render title message submit alert error edit', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertError(123);
            expect(result).to.equal(MESSAGE_PREVISIT_EDIT_ERROR);
        });

        it('should render title message submit alert error create', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const result = wrapper.instance().renderMessageSubmitAlertError();
            expect(result).to.equal(MESSAGE_PREVISIT_CREATE_ERROR);
        });
    });

    describe('Actions unit test', () => {
        it('validateDatePrevisit should return true', async () => {        
            const previsit = {
                date: new Date(),
                duration: '1'
            };    
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const response = await wrapper.instance().validateDatePrevisit(previsit);
            expect(response).to.equal(true);
        });

        it('validateDatePrevisit should return false', async () => {        
            const previsit = {
                date: new Date(),
                duration: '1'
            };    
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 500
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            const response = await wrapper.instance().validateDatePrevisit(previsit);
            expect(response).to.equal(false);
        });

        it('onClickCancelCommercialReport should change showConfirmationCancelPrevisit state to true', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            wrapper.instance().onClickCancelCommercialReport();
            expect(wrapper.state().showConfirmationCancelPrevisit).to.equal(true);
        });

        it('onClickDownloadPDF should call dispatchPdfDescarga', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            wrapper.instance().onClickDownloadPDF();            
            expect(dispatchValidateDatePrevisit.calledOnce).to.equal(true);
        });

        it('onClickConfirmCancelCommercialReport should call redirectUrl and change showConfirmationCancelPrevisit to false', () => {
            defaultProps.fromModal = false;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                          
            wrapper.instance().onClickConfirmCancelCommercialReport();               
            expect(wrapper.state().showConfirmationCancelPrevisit).to.equal(false);
            expect(redirectUrl.calledOnce).to.equal(true);
        });

        it('onClickConfirmCancelCommercialReport should call closeModal and change showConfirmationCancelPrevisit to false', () => {
            defaultProps.fromModal = true;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                          
            wrapper.instance().onClickConfirmCancelCommercialReport();               
            expect(wrapper.state().showConfirmationCancelPrevisit).to.equal(false);
            sinon.assert.notCalled(redirectUrl);
        });

        it('getPrevisitParticipants should return an object with participants lists', () => {            
            defaultProps.participants = Immutable.List([
                {
                    tipoParticipante: "banco",
                    uuid: "participant176",
                    order: 1,
                    fecha: 1576704981537,
                    estiloSocial: "",
                    actitudBanco: "",
                    idParticipante: 4998695,
                    nombreParticipante: "Monica Castillo",
                    cargo: " - Gerente de Cuenta Banco",
                    empresa: " - Bancolombia"
                }
            ]);
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                          
            const result = wrapper.instance().getPrevisitParticipants();                 
            expect(result).not.to.equal(null);
        });

        it('getPrevisitTypes should call getMasterDataFields service', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitTypes();
            expect(dispatchGetMasterDataFields.called).to.equal(true);
        });

        it('validatePermissionsPrevisits should return true when isEditable state is true', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({isEditable: true});
            const result = wrapper.instance().validatePermissionsPrevisits();
            expect(result).to.equal(true);
        });

        it('validatePermissionsPrevisits should return false when isEditale state is false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({isEditable: false});
            const result = wrapper.instance().validatePermissionsPrevisits();
            expect(result).to.equal(false);
        });

        it('validatePermissionsPrevisits should return false when permissionsPrevisits doesnt contains Editar', () => {
            defaultProps.reducerGlobal = Immutable.Map({ 
                validateEnter, 
                permissionsPrevisits: []
            }); 
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>); 
            wrapper.setState({isEditable: true});
            const result = wrapper.instance().validatePermissionsPrevisits();
            expect(result).to.equal(false);
        });

        it('editPrevisit should call canUserEditPrevisita', () => {                   
            dispatchCanEditPrevisita.resolves({
                payload: {
                    data:{
                        data: {
                            username: 'daegalle',
                            name: 'daniel'
                        }
                    }
                }
            });
            defaultProps.dispatchCanEditPrevisita = dispatchCanEditPrevisita;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("daegalle");
            wrapper.instance().editPrevisit();
            stubLocalStorage.restore();     
            expect(dispatchShowLoading).to.have.been.called.twice;
            expect(dispatchCanEditPrevisita.called).to.equal(true);
        });    

        it('getPrevisitData should call service getDetailPrevisit', async () => {            
            dispatchDetailPrevisit.resolves({
                payload: {
                    data: {
                        data: {
                            participatingContacts: [],
                            participatingEmployees: [],
                            relatedEmployees: [],
                            commercialReport: {
                                isConfidential: false,
                                usersWithPermission: []
                            },
                            answers: []
                        }
                    }
                }
            });
            defaultProps.dispatchDetailPrevisit = dispatchDetailPrevisit;            
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                        
            await wrapper.instance().getPrevisitData(1234);                        
            expect(dispatchSetConfidential).to.have.been.called.twice;            
            expect(wrapper.state().isEditable).to.equal(true);
        });
        
        it('getPrevisitData shouldnt call service getDetailPrevisit', async () => {            
            dispatchDetailPrevisit.resolves({
                payload: {
                    data: {
                        data: {
                            participatingContacts: [],
                            participatingEmployees: [],
                            relatedEmployees: [],
                            commercialReport: {
                                isConfidential: false,
                                usersWithPermission: []
                            }
                        }
                    }
                }
            });
            defaultProps.dispatchDetailPrevisit = dispatchDetailPrevisit;            
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                        
            await wrapper.instance().getPrevisitData();                        
            expect(dispatchSetConfidential).to.have.been.called.twice;            
            expect(wrapper.state().isEditable).to.equal(false);            
        });

        it('submitForm shouldnt call savePrevisit service when bankParticipants quantity is equal to zero', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH'
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;            
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.notCalled(dispatchCreatePrevisit);
            expect(dispatchSwtShowMessage).to.have.been.called.once;
        });

        it('submitForm shouldnt call savePrevisit service when validateDatePrevisitResponse is false', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH'
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 500
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [{ name: 'daniel'}],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.notCalled(dispatchCreatePrevisit);            
        });

        it('submitForm should call savePrevisit service', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH',
                answers: []
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            defaultProps.fromModal = true;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [{ name: 'daniel'}],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePrevisit);  
            expect(dispatchShowLoading).to.have.been.called.exactly(4);                
        });

        it('submitForm should call savePrevisit service and respond a validateLogin false', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH',
                answers: []
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            dispatchCreatePrevisit.resolves({
                payload: {
                    data: {
                        validateLogin: false,
                        status: REQUEST_SUCCESS
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            defaultProps.dispatchCreatePrevisit = dispatchCreatePrevisit;
            defaultProps.fromModal = false;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [{ name: 'daniel'}],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePrevisit);  
            expect(dispatchShowLoading).to.have.been.called.exactly(4);     
            expect(redirectUrl.calledOnce).to.equal(true);    
        });

        it('submitForm should call savePrevisit service and response status 422', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH',
                answers: []
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            dispatchCreatePrevisit.resolves({
                payload: {
                    data: {
                        validateLogin: true,
                        status: REQUEST_INVALID_INPUT
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            defaultProps.dispatchCreatePrevisit = dispatchCreatePrevisit;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [{ name: 'daniel'}],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePrevisit);  
            expect(dispatchShowLoading).to.have.been.called.exactly(4);                     
        });

        it('submitForm should call savePrevisit service and response status 500', async () => {
            const request = {
                id: 1,
                visitTime: new Date(),
                endTime: '1',
                documentType: 312312,
                visitLocation: 'CEOH',
                answers: []
            };
            dispatchValidateDatePrevisit = sinon.stub();
            dispatchValidateDatePrevisit.resolves({
                payload: {
                    data: {
                        status: 200
                    }
                }
            });
            dispatchCreatePrevisit.resolves({
                payload: {
                    data: {
                        validateLogin: true,
                        status: REQUEST_ERROR
                    }
                }
            });
            defaultProps.dispatchValidateDatePrevisit = dispatchValidateDatePrevisit;
            defaultProps.dispatchCreatePrevisit = dispatchCreatePrevisit;
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.instance().getPrevisitParticipants = () =>{
                return {
                    clientParticipants: [],
                    bankParticipants: [{ name: 'daniel'}],
                    otherParticipants: []
                }
            };
            wrapper.update();
            await wrapper.instance().submitForm(request);
            sinon.assert.calledOnce(dispatchCreatePrevisit);  
            expect(dispatchShowLoading).to.have.been.called.exactly(4);                     
        });

        it('onClickSaveHandler should set state documentDraft in 1', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({ formValid: true });
            wrapper.instance().onClickSaveHandler(1);
            expect(wrapper.state().documentDraft).to.equal(1);
        });

        it('onClickSaveHandler should set state documentDraft in 0', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({ formValid: true });
            wrapper.instance().onClickSaveHandler(0);
            expect(wrapper.state().documentDraft).to.equal(0);
        });

        it('onClickSaveHandler shouldnt change state documentDraft', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({ formValid: false, documentDraft: null });
            wrapper.instance().onClickSaveHandler(0);
            expect(wrapper.state().documentDraft).to.equal(null);
        });

        it('cancelChangeTypePrevisit should set state showConfirmChangeTypeVisit in false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({ showConfirmChangeTypeVisit: true, setFieldValue});
            wrapper.instance().cancelChangeTypePrevisit();
            expect(wrapper.state().showConfirmChangeTypeVisit).to.equal(false);
            expect(wrapper.state().setFieldValue.called).to.equal(true);
        });

        it('confirmChangeTypePrevisit should set state showConfirmChangeTypeVisit in false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);
            wrapper.setState({ showConfirmChangeTypeVisit: true, setFieldValue});
            wrapper.instance().confirmChangeTypePrevisit();
            expect(wrapper.state().showConfirmChangeTypeVisit).to.equal(false);            
        });

        it('showChallengerSection should call validateSelectionPrevisitType when oldPrevisitTypeKeySelected is null', async () => {
            const previsitTypeId = 1;
            const setFieldValue = () => true;            
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            await wrapper.instance().showChallengerSection(previsitTypeId, setFieldValue);                 
            expect(wrapper.state().oldPrevisitTypeSelectedId).to.equal(previsitTypes[0].id);
            expect(wrapper.state().oldPrevisitTypeSelected).to.equal(PROPUEST_OF_BUSINESS.toUpperCase());
        });

        it('showChallengerSection should change showConfirmChangeTypeVisit state to true', async () => {
            const previsitTypeId = 2;
            const setFieldValue = () => true;                        
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            wrapper.setState({
                oldPrevisitTypeSelected: PROPUEST_OF_BUSINESS
            });
            await wrapper.instance().showChallengerSection(previsitTypeId, setFieldValue);                 
            expect(wrapper.state().currentPrevisitTypeSelected).to.equal(TRACING.toUpperCase());
            expect(wrapper.state().oldPrevisitTypeSelected).to.equal(TRACING.toUpperCase());
            expect(wrapper.state().showConfirmChangeTypeVisit).to.equal(true);
        });

        it('showChallengerSection should validateSelectionPrevisitType when oldPrevisitTypeKeySelected is TRACING', async () => {
            const previsitTypeId = 1;
            const setFieldValue = () => true;                        
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);            
            wrapper.setState({
                oldPrevisitTypeSelected: TRACING 
            });
            await wrapper.instance().showChallengerSection(previsitTypeId, setFieldValue);                 
            expect(wrapper.state().currentPrevisitTypeSelected).to.equal(PROPUEST_OF_BUSINESS.toUpperCase());
            expect(wrapper.state().oldPrevisitTypeSelected).to.equal(PROPUEST_OF_BUSINESS.toUpperCase());            
        });

        
    });
    
});