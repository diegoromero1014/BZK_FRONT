import Immutable from 'immutable';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ParticipantsByClientReactComponent, { ParticipantsByClient } from "../../../../src/components/participants/ParticipantsByClient";
import { KEY_PARTICIPANT_CLIENT } from '../../../../src/components/participants/constants';
import { KEY_PARTICIPANT_BANCO } from '../../../../src/components/participantsVisitPre/constants';
import { CREAR } from '../../../../src/constantsGlobal';
import { shallow } from 'enzyme';
import BotonCreateContactComponent from '../../../../src/components/contact/createContact/botonCreateContactComponent';
import ListParticipantsByClient from '../../../../src/components/participants/ListParticipantsByClient';

let dispatchContactsByClient;
let dispatchValidatePermissionsByModule;
let dispatchShowAlert;
let dispatchAddParticipant;
let dispatchDeleteParticipant;
let limitParticipantsByClient;
let participants;
let reducerGlobal;
let contacts;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;
let defaultProps;

describe('Test participants/ParticipantsByClient', () => {
    
    beforeEach(() => {
        dispatchContactsByClient = sinon.fake();
        dispatchValidatePermissionsByModule = sinon.fake();
        dispatchShowAlert = sinon.fake();
        dispatchAddParticipant = sinon.fake();
        dispatchDeleteParticipant = sinon.fake();
        limitParticipantsByClient = 0;
        participants = Immutable.List([]);
        reducerGlobal = Immutable.Map({
            validateEnter: true,
            permissionsPropsect: [],
            permissionsClients: [],
            permissionsContacts: [],
            permissionsShareholders: [],
            permissionsPrevisits: [],
            permissionsTasks: [],
            permissionsPipeline: [],
            permissionsBussinessPlan: [],
            permissionsManagerialView: [],
            permissionsRiskGroup: [],
            permissionsBoardMembers: [],
            permissionsCovenants: [],
            permissionsStudyCredit: [],
            securityMessage: ''
        });
        contacts = [{
            id: 5898771,
            nameComplet: 'Daniel',
            contactPosition:  'Developer',
            contactSocialStyle: '',
            contactActitudeCompany: ''
        }];        

        defaultProps = {
            dispatchContactsByClient,
            dispatchValidatePermissionsByModule,
            dispatchShowAlert,
            dispatchAddParticipant,
            dispatchDeleteParticipant,
            limitParticipantsByClient,
            participants,
            reducerGlobal,
            contacts
        };

        store = mockStore({
            defaultProps,
            contactsByClient: Immutable.Map({
                contacts: []
            })
        });
    });

    describe('Render test', () => {
        it('should render ParticipantsByClient component', () => {
            itRenders(<ParticipantsByClient {...defaultProps}/>);
        });

        it('should render BotonCreateContactComponent when reducerGlobal has permissionsContacts CREAR', () => {
            reducerGlobal = Immutable.Map({
                permissionsContacts: [CREAR]
            });
            defaultProps.reducerGlobal = reducerGlobal;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            expect(wrapper.find(BotonCreateContactComponent)).to.have.length(1);
        });

        it('should render ParticipantsByClient component when disabled prop is true', () => {
            defaultProps.disabled = true;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);            
            expect(wrapper.find({name: 'txtContactoCliente'})).to.have.length(1);
            expect(wrapper.find({name: 'txtContactoCliente'}).prop('disabled')).to.equal('disabled');
        });

        it('should render ListParticipantsByClient when data.length is greater than 0', () => {
            participants = Immutable.List([{
                idParticipante: 5898771,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);            
            defaultProps.participants = participants;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);      
            wrapper.find(ListParticipantsByClient).prop('handleOpenModal')({
                idParticipante: 59890
            });            
            expect(wrapper.find(ListParticipantsByClient)).to.have.length(1);
            expect(wrapper.state().open).to.equal(true);            
            expect(wrapper.state().selectedContactInformation.idParticipante).to.equal(59890);            
            expect(wrapper.instance().editing).to.equal(true);
        });
    });
    
    describe('Actions test', () => {

        it('handleSetInformation should set existingContact with selectedContact', () => {
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            const id = 5898771;            
            wrapper.instance().handleSetInformation(id);                        
            expect(wrapper.state().selectedContactInformation).not.to.equal(null);
            expect(wrapper.state().selectedContactInformation.idParticipante).to.equal(id);
        });

        it('handleSetInformation when selectedContact is not a number', () => {
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            wrapper.instance().handleSetInformation(selectedContact);
            expect(wrapper.state().selectedContactInformation.idParticipante).to.equal(selectedContact.idParticipante);
        });

        it('handleSetInformation when selectedContact should dispatchShowAlert', () => {            
            const id = 5898771;      
            contacts = [{
                id: 5898771,
                nameComplet: 'Daniel',
                contactPosition:  '',
                contactSocialStyle: 'Alguno',
                contactActitudeCompany: 'IAS'
            }];
            participants = Immutable.List([{
                idParticipante: 5898771
            }]);
            defaultProps.contacts = contacts;
            defaultProps.participants = participants;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().handleSetInformation(id);
            expect(dispatchShowAlert.calledOnce).to.equal(true);
            expect(wrapper.state().open).to.equal(false);
            expect(wrapper.state().selectedContact).to.equal(''); 
        });

        it('lengthParticipants should return participants filtered size 1', () => {
            participants = Immutable.List([{
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            const response = wrapper.instance().lengthParticipants();
            expect(response).to.equal(1);
        });

        it('lengthParticipants should return participants filtered size 0', () => {
            participants = Immutable.List([{
                tipoParticipante: KEY_PARTICIPANT_BANCO
            }]);
            defaultProps.participants = participants;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            const response = wrapper.instance().lengthParticipants();
            expect(response).to.equal(0);
        });

        it('addContact should dispatchShowAlert when limitParticipantsByClient is not null and lengthParticipants is greater than limitParticipantsByClient and editing is false', () => {
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 1;
            participants = Immutable.List([{
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().editing = false;
            wrapper.update();
            wrapper.instance().addContact(selectedContact);
            expect(dispatchShowAlert.calledOnce).to.equal(true); 
        });

        it('addContact should dispatchShowAlert when limitParticipantsByClient is not null and lengthParticipants is lower than limitParticipantsByClient and editing is false', () => {
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 10;
            participants = Immutable.List([{
                idParticipante: 8965652,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                idParticipante: 489988,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().editing = false;
            wrapper.update();
            wrapper.instance().addContact(selectedContact);
            expect(dispatchShowAlert.calledOnce).to.equal(true); 
            expect(wrapper.state().selectedContact).to.equal('');            
        });

        it('addContact should dispatchShowAlert when limitParticipantsByClient is not null and lengthParticipants is lower than limitParticipantsByClient and editing is true', () => {
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 10;
            participants = Immutable.List([{
                idParticipante: 8965652,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                idParticipante: 489988,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().editing = true;
            wrapper.update();
            wrapper.instance().addContact(selectedContact);
            expect(dispatchDeleteParticipant.calledOnce).to.equal(true);
            expect(dispatchAddParticipant.calledOnce).to.equal(true) ;           
        });

        it('addContact should dispatchShowAlert when limitParticipantsByClient is not null and lengthParticipants is lower than limitParticipantsByClient and editing is false', () => {
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 10;
            participants = Immutable.List([{
                idParticipante: 4987849,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                idParticipante: 489988,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().editing = false;
            wrapper.update();
            wrapper.instance().addContact(selectedContact);            
            sinon.assert.notCalled(dispatchDeleteParticipant);
            expect(dispatchAddParticipant.calledOnce).to.equal(true) ;           
        });

        it('addContact should do anything because selectedContact is null', () => {
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().addContact(null);
            sinon.assert.notCalled(dispatchShowAlert);
            sinon.assert.notCalled(dispatchDeleteParticipant);
            sinon.assert.notCalled(dispatchAddParticipant);        
        });

        it('handleOnChange should do anything because value is empty', () => {
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().handleOnChange('');
            sinon.assert.notCalled(dispatchShowAlert);
            expect(wrapper.state().selectedContact).to.equal(null);
            expect(wrapper.instance().editing).to.equal(false);   
        });

        it('handleOnChange should dispatchShowAlert when limitParticipantsByClient is reached', () => {            
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 2;
            participants = Immutable.List([{
                idParticipante: 8965652,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                idParticipante: 489988,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().handleOnChange(selectedContact);
            expect(dispatchShowAlert.calledOnce).to.equal(true); 
        });

        it('handleOnChange should set selectedContact value in state', () => {            
            const selectedContact = {
                idParticipante: 8965652,
                nameComplet: 'John Doe',
                contactPosition:  'Developer',
                contactSocialStyle: '',
                contactActitudeCompany: ''
            };
            limitParticipantsByClient = 10;
            participants = Immutable.List([{
                idParticipante: 8965652,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            },
            {
                idParticipante: 489988,
                tipoParticipante: KEY_PARTICIPANT_CLIENT
            }]);
            defaultProps.participants = participants;            
            defaultProps.limitParticipantsByClient = limitParticipantsByClient;
            const wrapper = shallow(<ParticipantsByClient {...defaultProps}/>);
            wrapper.instance().handleOnChange(selectedContact);
            expect(wrapper.instance().editing).to.equal(false);
        });
    });

    describe('Redux Component test', () => {
        it('should render react component', () => {
            itRenders(<ParticipantsByClientReactComponent store={store}/>);
        })        
    });

});