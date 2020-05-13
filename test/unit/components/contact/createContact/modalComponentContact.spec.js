import React from 'react';
import ModalComponentContactRedux from '../../../../../src/components/contact/createContact/modalComponentContact';
import { ModalComponentContact } from '../../../../../src/components/contact/createContact/modalComponentContact';
import * as globalActions from '../../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchClearSearchContact;
let dispatchSearchContact;
let dispatchCreateContactNew;
let dispatchConsultListWithParameterUbication;
let dispatchGetMasterDataFields;
let dispatchContactsByClientFindServer;
let dispatchClearContactCreate;
let dispatchClearContactOrder;
let dispatchNonValidateEnter;
let dispatchGetListContactGroupById;
let dispatchCleanList;
let dispatchCreateList;
let dispatchSwtShowMessage;
let dispatchDownloadFilePdf;
let dispatchChangeStateSaveData;
let resetForm;
let handleSubmit;
let isOpen;

let defaultProps;
let redirectUrl;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test ModalComponentContact component', () => {

    beforeEach(() => {
        store = mockStore({})

        dispatchClearSearchContact = sinon.fake();
        dispatchSearchContact = sinon.fake();
        dispatchCreateContactNew = sinon.stub();
        dispatchCreateContactNew.resolves({
            payload : {
                data : {
                    validateLogin : ""
                }
            }
        })
        dispatchConsultListWithParameterUbication = sinon.fake();
        dispatchGetMasterDataFields = sinon.fake();
        dispatchContactsByClientFindServer = sinon.fake();
        dispatchClearContactCreate = sinon.fake();
        dispatchClearContactOrder = sinon.fake();
        dispatchNonValidateEnter = sinon.fake();
        dispatchGetListContactGroupById = sinon.fake();
        dispatchCleanList = sinon.fake();
        dispatchCreateList = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        dispatchDownloadFilePdf = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        resetForm = sinon.fake();
        handleSubmit = sinon.fake();
        isOpen = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchClearSearchContact,
            dispatchSearchContact,
            dispatchCreateContactNew,
            dispatchConsultListWithParameterUbication,
            dispatchGetMasterDataFields,
            dispatchContactsByClientFindServer,
            dispatchClearContactCreate,
            dispatchClearContactOrder,
            dispatchNonValidateEnter,
            dispatchGetListContactGroupById,
            dispatchCleanList,
            dispatchCreateList,
            dispatchSwtShowMessage,
            dispatchDownloadFilePdf,
            dispatchChangeStateSaveData,
            resetForm,
            isOpen,
            handleSubmit,

            fields : {
                id : { value: "", onChange: sinon.fake() },
                tipoDocumento : { value: "", onChange: sinon.fake() },
                tipoTratamiendo : { value: "", onChange: sinon.fake() },
                tipoGenero : { value: "", onChange: sinon.fake() },
                tipoCargo : { value: "", onChange: sinon.fake() },
                tipoDependencia : { value: "", onChange: sinon.fake() },
                tipoEstiloSocial : { value: "", onChange: sinon.fake() },
                tipoActitud : { value: "", onChange: sinon.fake() },
                tipoContacto : { value: "", onChange: sinon.fake() },
                numeroDocumento : { value: "test", onChange: sinon.fake() },
                primerNombre : { value: "", onChange: sinon.fake() },
                segundoNombre : { value: "", onChange: sinon.fake() },
                primerApellido : { value: "", onChange: sinon.fake() },
                segundoApellido : { value: "", onChange: sinon.fake() },
                fechaNacimiento : { value: "", onChange: sinon.fake() },
                direccion : { value: "", onChange: sinon.fake() },
                barrio : { value: "", onChange: sinon.fake() },
                codigoPostal : { value: "", onChange: sinon.fake() },
                telefono : { value: "", onChange: sinon.fake() },
                extension : { value: "", onChange: sinon.fake() },
                celular : { value: "", onChange: sinon.fake() },
                correo : { value: "", onChange: sinon.fake() },
                tipoEntidad : { value: "", onChange: sinon.fake() },
                tipoFuncion : { value: "", onChange: sinon.fake() },
                tipoHobbie : { value: "", onChange: sinon.fake() },
                tipoDeporte : { value: "", onChange: sinon.fake() },
                pais : { value: "", onChange: sinon.fake() },
                departamento : { value: "", onChange: sinon.fake() },
                ciudad : { value: "", onChange: sinon.fake() },
                contactRelevantFeatures : { value: "", onChange: sinon.fake() },
                listaFavoritos : { value: "", onChange: sinon.fake() },
            },

            selectsReducer : Immutable.Map({ contactType : "" }),
            groupsFavoriteContacts : Immutable.Map({ listGroupFavorite : "" }),
            elementsReducer : { objectives : [] }
        }
    })
    
    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering components', () => {
        
        it('Rendering ModalComponentContact component with redux', () => {
            itRenders(<ModalComponentContactRedux store={store}/>)
        })

        it('Rendering ModalComponentContact component', () => {
            itRenders(<ModalComponentContact {...defaultProps}/>)
        })

        it('componentWillMount instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance().componentWillMount();
            sinon.assert.called(dispatchNonValidateEnter);
            sinon.assert.called(dispatchGetListContactGroupById);
            sinon.assert.called(dispatchClearSearchContact);
            sinon.assert.called(dispatchGetMasterDataFields);
            sinon.assert.called(dispatchCleanList);
            sinon.assert.called(dispatchCreateList);
        })

        it('_downloadFileSocialStyle instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._downloadFileSocialStyle();
            sinon.assert.called(dispatchDownloadFilePdf);
        })

        it('_close instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._close();
            expect(wrapper.state().showErrorYa).to.equal(false);
        })

        it('_close instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._close();
            expect(wrapper.state().showErrorYa).to.equal(false);
        })

        it('_closeCreate instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._closeCreate();
            sinon.assert.called(dispatchClearSearchContact);
            expect(wrapper.state().showEx).to.equal(false);
            sinon.assert.called(dispatchClearContactOrder);
            sinon.assert.called(dispatchClearContactCreate);
        })

        it('_onClickLimpiar instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._onClickLimpiar();
            sinon.assert.called(dispatchClearSearchContact);
        })

        it('_searchContact instance', () => {
            const e = {
                preventDefault : sinon.fake()
            }
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._searchContact(e);
            sinon.assert.called(dispatchClearSearchContact);
        })

        it('_handleCreateContact instance', () => {
            const wrapper = shallow(<ModalComponentContact {...defaultProps}/>);
            wrapper.instance()._handleCreateContact();
            sinon.assert.called(dispatchChangeStateSaveData);
        })

    })
    
})
