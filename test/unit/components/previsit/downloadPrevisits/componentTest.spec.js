import React from "react";
import { DownloadPrevisits } from "../../../../../src/components/previsita/downloadPrevisits/component";
import DownloadPrevisitsRedux from "../../../../../src/components/previsita/downloadPrevisits/component";
import { shallow } from "enzyme";
import configureStore from 'redux-mock-store';
import thunk from "redux-thunk";

let defaultProps;
let dispatchChangeStateSaveData;
let dispatchGetCsvPreVisitsByClient;
let dispatchGetCsv;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares)

describe("DownloadPrevisits Test", () => {

    beforeEach(() => {
        dispatchChangeStateSaveData = sinon.fake();
        dispatchGetCsvPreVisitsByClient = sinon.stub().resolves({});
        dispatchGetCsv = sinon.stub().resolves({});
        defaultProps = {
            dispatchChangeStateSaveData,
            dispatchGetCsvPreVisitsByClient,
            dispatchGetCsv,
        }

        store = mockStore({});
    });

    it('should render component with redux', () => {
        itRenders(<DownloadPrevisitsRedux {...defaultProps} store={store}/>);
    });

    it('should render component', () => {
        itRenders(<DownloadPrevisits {...defaultProps}/>);
    });

    it('When checkCheckBox is instanced and event.target.name is participatingContacts', () => {
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ hasParticipatingContacts: false })
        wrapper.instance().checkCheckBox({ target: { name: 'participatingContacts'}});
        expect(wrapper.state().hasParticipatingContacts).to.equal(true);
    });

    it('When checkCheckBox is instanced and event.target.name is participatingEmployees', () => {
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ hasParticipatingEmployees: false })
        wrapper.instance().checkCheckBox({ target: { name: 'participatingEmployees'}});
        expect(wrapper.state().hasParticipatingEmployees).to.equal(true);
    });

    it('When checkCheckBox is instanced and event.target.name is relatedEmployees', () => {
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ hasRelatedEmployees: false })
        wrapper.instance().checkCheckBox({ target: { name: 'relatedEmployees'}});
        expect(wrapper.state().hasRelatedEmployees).to.equal(true);
    });

    it('When downloadPreVisits is instanced', () => {
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
    });
    
    it('When downloadPreVisits is instanced and itemSelectedModal is 1', () => {
        defaultProps.itemSelectedModal = 1;
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ year: '' })
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchGetCsv);
    });

    it('When downloadPreVisits is instanced and itemSelectedModal is 1 and year is empty and status is 200', () => {
        defaultProps.itemSelectedModal = 1;
        defaultProps.dispatchGetCsv = sinon.stub().resolves({ 
            payload: {
                data: {
                    status: 200
                }
            }
        })
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ year: '2020' });
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
    });

    it('When downloadPreVisits is instanced and itemSelectedModal is 1 and year is empty and status is not 200', () => {
        defaultProps.itemSelectedModal = 1;
        defaultProps.dispatchGetCsv = sinon.stub().resolves({ 
            payload: {
                data: {
                    status: 0
                }
            }
        })
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.setState({ year: '2020' });
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
    });

    it('When downloadPreVisits is instanced and itemSelectedModal is not 1 and status is 200', () => {
        defaultProps.itemSelectedModal = 0;
        defaultProps.dispatchGetCsvPreVisitsByClient = sinon.stub().resolves({ 
            payload: {
                data: {
                    status: 200
                }
            }
        });
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
    });

    it('When downloadPreVisits is instanced and itemSelectedModal is not 1 and status is not 200', () => {
        defaultProps.itemSelectedModal = 0;
        defaultProps.dispatchGetCsvPreVisitsByClient = sinon.stub().resolves({ 
            payload: {
                data: {
                    status: 0
                }
            }
        });
        const wrapper = shallow(<DownloadPrevisits {...defaultProps} />);
        wrapper.instance().downloadPreVisits();
        sinon.assert.calledOnce(dispatchChangeStateSaveData);
    });
});