import React from 'react';
import ParticipantesClienteRedux from '../../../../src/components/participantsVisitPre/participantesCliente';
import { ParticipantesCliente } from '../../../../src/components/participantsVisitPre/participantesCliente';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import { KEY_PARTICIPANT_CLIENT } from '../../../../src/components/participantsVisitPre/constants';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchAddParticipant;
let dispatchContactsByClientFindServer;
let dispatchValidatePermissionsByModule;
let dispatchSwtShowMessage;
let dispatchDownloadFilePdf;
let dispatchChangeStateSaveData;
let resetForm;

let redirectUrl;

let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test ParticipantesCliente component', () => {
    
    beforeEach(() => {
        store = mockStore({});

        dispatchAddParticipant = sinon.fake();
        dispatchContactsByClientFindServer = sinon.fake();
        dispatchValidatePermissionsByModule = sinon.stub();
        dispatchValidatePermissionsByModule.resolves({
            payload : {
                data : {
                    validateLogin : null
                }
            }
        })
        dispatchSwtShowMessage = sinon.fake();
        dispatchDownloadFilePdf = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();

        resetForm = sinon.fake();

        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchAddParticipant,
            dispatchContactsByClientFindServer,
            dispatchValidatePermissionsByModule,
            dispatchSwtShowMessage,
            dispatchDownloadFilePdf,
            dispatchChangeStateSaveData,
            resetForm,

            fields : { 
                contactoCliente : {
                    value : ""
                },
                cargoContacto : "",
                estiloSocial : "",
                actitudGrupo : "",
                idContacto : {
                    value : ""
                }
            },

            participants : Immutable.Map([]),
            contactsByClient : Immutable.Map({ contacts : []}),
            reducerGlobal : Immutable.Map({ permissionsContacts : "" })
        }
    })

    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering components', () => {
        
        it('Rendering ParticipantesCliente with redux', () => {
            itRenders(<ParticipantesClienteRedux store={store}/>)
        })

        it('Rendering ParticipantesCliente', () => {
            itRenders(<ParticipantesCliente {...defaultProps}/>)
        })

        it('addParticipantClient instance', () => {
            const wrapper = shallow(<ParticipantesCliente {...defaultProps}/>)
            wrapper.instance().addParticipantClient(KEY_PARTICIPANT_CLIENT);
            sinon.assert.called(dispatchSwtShowMessage);
        })

        it('downloadFileSocialStyle instance', () => {
            const wrapper = shallow(<ParticipantesCliente {...defaultProps}/>)
            wrapper.instance().downloadFileSocialStyle();
            sinon.assert.called(dispatchDownloadFilePdf);
        })

        it('componentWillMount instance', () => {
            const wrapper = shallow(<ParticipantesCliente {...defaultProps}/>)
            wrapper.instance().componentWillMount();
            sinon.assert.called(dispatchContactsByClientFindServer);
            sinon.assert.called(dispatchValidatePermissionsByModule);
        })

    })
    
})

