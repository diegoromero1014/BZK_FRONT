import React from 'react';
import Immutable from 'immutable';
import { PrevisitPage } from '../../../../src/components/previsita/previsitPage';
import HeaderPrevisita from '../../../../src/components/previsita/headerPrevisita';
import PermissionUserReports from '../../../../src/components/commercialReport/permissionsUserReports';
import PrevisitFormComponent from '../../../../src/components/previsita/previsitFormComponent';
import SweetAlert from '../../../../src/components/sweetalertFocus';
import { TITLE_PREVISIT_EDIT, TITLE_PREVISIT_CREATE, MESSAGE_PREVISIT_EDIT_SUCCESS, MESSAGE_PREVISIT_CREATE_SUCCESS, MESSAGE_PREVISIT_EDIT_ERROR, MESSAGE_PREVISIT_CREATE_ERROR } from '../../../../src/components/previsita/constants';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import { EDITAR } from '../../../../src/constantsGlobal';


const validateEnter = true;
const ownerDraft = true;
const previsitType = "";
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
let dispatchShowLoading;
let dispatchGetMasterDataFields;
let dispatchSetConfidential;
let dispatchValidateDatePrevisit;
let dispatchSwtShowMessage;
let dispatchPdfDescarga;
let dispatchCanEditPrevisita;
let defaultProps = {};
let redirectUrl;
let stubLocalStorage;

describe('Test previsitPage', () => {        

    beforeEach(() => {                    
        dispatchShowLoading = spy(sinon.fake());
        dispatchSetConfidential = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        dispatchPdfDescarga = sinon.fake();
        dispatchCanEditPrevisita = sinon.stub();        
        dispatchGetMasterDataFields = sinon.stub();
        dispatchGetMasterDataFields.resolves({
            masterDataDetailEntries: [
                {"id":1,"field":"previsitType","value":"Propuesta de negocio","parentId":null,"key":"Propuesta","description":""},
                {"id":2,"field":"previsitType","value":"Seguimiento","parentId":null,"key":"Seguimiento","description":""}]
        });
        redirectUrl = sinon.stub(globalActions, "redirectUrl");              
        defaultProps = {
            params: {},
            clientInformacion: Immutable.Map({responseClientInfo: {name: 'daniel'}}),
            previsitReducer: Immutable.Map({ detailPrevisit , ownerDraft}),
            reducerGlobal: Immutable.Map({ 
                validateEnter, 
                permissionsPrevisits: [EDITAR]
            }),      
            selectsReducer: Immutable.Map({ previsitType }),            
            confidentialReducer: Immutable.Map({ }),
            dispatchShowLoading,
            dispatchGetMasterDataFields,
            dispatchSetConfidential,
            dispatchSwtShowMessage,
            dispatchPdfDescarga,
            participants: []
        }        
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
            expect(redirectUrl.never).to.equal(true);
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
            expect(wrapper.contains(<PermissionUserReports/>)).to.equal(true);                  
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
            expect(wrapper.find(SweetAlert)).to.have.lengthOf(1);
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

        it('redirectToClientInformation should call redirectUrl and change showConfirmationCancelPrevisit to false', () => {
            const wrapper = shallow(<PrevisitPage {...defaultProps}/>);                          
            wrapper.instance().redirectToClientInformation();               
            expect(wrapper.state().showConfirmationCancelPrevisit).to.equal(false);
            expect(redirectUrl.calledOnce).to.equal(true);
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
        
        
    });
    
});