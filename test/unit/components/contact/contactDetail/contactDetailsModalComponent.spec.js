import React from 'react';
import ContactDetailsModalComponentRedux from '../../../../../src/components/contact/contactDetail/contactDetailsModalComponent';
import { ContactDetailsModalComponent } from '../../../../../src/components/contact/contactDetail/contactDetailsModalComponent';
import * as globalActions from '../../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchGetContactDetails;
let dispatchSaveContact;
let dispatchClearContactOrder;
let dispatchClearContactCreate;
let dispatchGetMasterDataFields;
let dispatchConsultListWithParameterUbication;
let dispatchContactsByClientFindServer;
let dispatchClearClienEdit;
let dispatchNonValidateEnter;
let dispatchMarkAsOutdated;
let dispatchShowLoading;
let dispatchsSwtShowMessage;
let dispatchCleanList;
let dispatchAddToList;
let dispatchCreateList;
let dispatchDownloadFilePdf;
let dispatchChangeStateSaveData;
let handleSubmit;
let isOpen;
let resetForm;

let defaultProps;
let redirectUrl;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test ContactDetailsModalComponent', () => {

    beforeEach(() => {
        store = mockStore({});

        dispatchGetContactDetails = sinon.fake();
        dispatchSaveContact = sinon.stub();
        dispatchSaveContact.resolves({
            payload : {
                data : {
                    validateLogin : "",
                    status : 200
                }
            }
        })
        dispatchClearContactOrder = sinon.fake();
        dispatchClearContactCreate = sinon.fake();
        dispatchGetMasterDataFields = sinon.stub();
        dispatchGetMasterDataFields.resolves({
            payload: {
                data: {
                    data: ""
                }
            }
        })
        dispatchConsultListWithParameterUbication = sinon.fake();
        dispatchContactsByClientFindServer = sinon.fake();
        dispatchClearClienEdit = sinon.fake();
        dispatchNonValidateEnter = sinon.fake();
        dispatchMarkAsOutdated = sinon.stub();
        dispatchMarkAsOutdated.resolves({
            payload: {
                data: {
                    validateLogin: "",
                    status : 200
                }
            }
        })
        dispatchShowLoading = sinon.fake();
        dispatchsSwtShowMessage = sinon.fake();
        dispatchCleanList = sinon.fake();
        dispatchAddToList = sinon.fake();
        dispatchCreateList = sinon.fake();
        dispatchDownloadFilePdf = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        handleSubmit = sinon.fake();
        isOpen = sinon.fake();
        resetForm= sinon.fake();

        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchGetContactDetails,
            dispatchSaveContact,
            dispatchClearContactOrder,
            dispatchClearContactCreate,
            dispatchGetMasterDataFields,
            dispatchConsultListWithParameterUbication,
            dispatchContactsByClientFindServer,
            dispatchClearClienEdit,
            dispatchNonValidateEnter,
            dispatchMarkAsOutdated,
            dispatchShowLoading,
            dispatchsSwtShowMessage,
            dispatchCleanList,
            dispatchAddToList,
            dispatchCreateList,
            dispatchDownloadFilePdf,
            dispatchChangeStateSaveData,
            handleSubmit,
            isOpen,
            resetForm,

            fields: {
                contactTitle: { value: "" },
                contactGender: { value: "" },
                contactType: { value: "" },
                contactIdentityNumber: { value: "" },
                contactFirstName: { value: "" },
                contactMiddleName: { value: "" },
                contactFirstLastName: { value: "" },
                contactSecondLastName: { value: "" },
                contactPosition: { value: "" },
                contactDependency: { value: "" },
                contactAddress: { value: "" },
                contactCountry: { value: "" },
                contactProvince: { value: "" },
                contactCity: { value: "" },
                contactNeighborhood: { value: "" },
                contactPostalCode: { value: "" },
                contactTelephoneNumber: { value: "" },
                contactExtension: { value: "" },
                contactMobileNumber: { value: "" },
                contactEmailAddress: { value: "" },
                contactTypeOfContact: { value: "" },
                contactLineOfBusiness: { value: "" },
                contactFunctions: { value: "" },
                contactHobbies: { value: "" },
                contactSports: { value: "" },
                contactSocialStyle: { value: "" },
                contactAttitudeOverGroup: { value: "" },
                contactDateOfBirth: { value: "" },
                contactRelevantFeatures: { value: "" },
                updateCheckObservation: { value: "" },

            },

            callFromModuleContact: false,
            elementsReducer : {
                elements : []
            },
            contactDetail : Immutable.Map({ contactDetailList : "" }),
            selectsReducer: Immutable.Map({ gender: "" }),
            reducerGlobal: Immutable.Map({ permissionsContacts: "" })
        }
    })

    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering components', () => {

        it('rendering ContactDetailsModalComponent with redux', () => {
            itRenders(<ContactDetailsModalComponentRedux store={store} />)
        })

        it('rendering ContactDetailsModalComponent', () => {
            itRenders(<ContactDetailsModalComponent {...defaultProps} />)
        })

        it('componentWillMount instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.instance().componentWillMount();
            sinon.assert.called(dispatchNonValidateEnter);
            sinon.assert.called(dispatchShowLoading);
        })

        it('_uploadProvincesByCountryId instance', () => {
            const countryId = "test";
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.instance()._uploadProvincesByCountryId(countryId);
            sinon.assert.called(dispatchConsultListWithParameterUbication);
        })

        it('_uploadCitiesByProvinceId instance', () => {
            const provinceId = "";
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.instance()._uploadProvincesByCountryId(provinceId);
            sinon.assert.called(dispatchConsultListWithParameterUbication);
        })

        it('_editContact instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.state({
                isEditable: false
            })
            wrapper.instance()._editContact();
            expect(wrapper.state().isEditable).to.equal(true);
        })

        it('_closeViewOrEditContact instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.state({
                isEditable: true
            })
            wrapper.instance()._closeViewOrEditContact();
            expect(wrapper.state().isEditable).to.equal(false);
            sinon.assert.called(dispatchClearClienEdit);
            sinon.assert.called(dispatchClearContactCreate);
            sinon.assert.called(dispatchClearContactOrder);
        })

        it('_handleChangeUpdateCheck instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.state({
                updateCheck : false
            })
            wrapper.instance()._handleChangeUpdateCheck();
            expect(wrapper.state().updateCheck).to.equal(true);
            expect(wrapper.state().showMessage).to.equal(false);
        })

        it('cancelAlert instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.state({
                isUpdatedInSubmit : true
            })
            wrapper.instance().cancelAlert();
            expect(wrapper.state().updateCheck).to.equal(true);
            expect(wrapper.state().showMessage).to.equal(false);
            sinon.assert.called(dispatchShowLoading);
        })

        it('unmarkContact instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.state({
                updateCheck : true,
                showMessage : true
            })
            wrapper.instance().unmarkContact();
            expect(wrapper.state().updateCheck).to.equal(false);
            expect(wrapper.state().showMessage).to.equal(false);
        })
        
        it('_markAsOutdated instance', () => {
            const wrapper = shallow(<ContactDetailsModalComponent {...defaultProps} />);
            wrapper.instance()._markAsOutdated();
            sinon.assert.called(dispatchShowLoading);
            sinon.assert.called(dispatchMarkAsOutdated);
        })

    })

})
