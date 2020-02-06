import React from 'react';
import Immutable from 'immutable';
import { ViewAlerts } from '../../../../src/components/alerts/alertsComponent' ;
import { shallow } from 'enzyme';
import { CODE_ALERT_PENDING_UPDATE_CLIENT, CODE_COVENANT_ALERT, CODE_ALERT_PORTFOLIO_EXPIRATION, CODE_BLACK_LIST_ALERT } from '../../../../src/components/alerts/constants';

let defaultProps;
let updateTitleNavBar;
let showLoading;
let getAlertsByUser;
let validatePermissionsByModule;
let alerts;
let navBar;
let clearFilterPUC;
let consultList;
let clearFilterBlackList;
let clearFilterPE;
let defaultValues;

describe('ViewAlerts Test', () => {

    beforeEach(() => {
        updateTitleNavBar = sinon.fake();
        showLoading = spy(sinon.fake());
        getAlertsByUser = sinon.stub();
        validatePermissionsByModule = sinon.stub();
        alerts = Immutable.Map({            
            listAlertByUser: Immutable.List(),
            openModal: false
        });        
        navBar = Immutable.Map({
            status: "opened",
            titleNavBar: 'Mis clientes',
            viewAlertClient:false,
            mapModulesAccess: [],
            confidential: false
        });
        clearFilterPUC = spy(sinon.fake());
        consultList = sinon.stub();
        clearFilterBlackList = spy(sinon.fake());
        clearFilterPE = spy(sinon.fake());
        defaultValues = sinon.fake();

        getAlertsByUser.resolves({
            payload: { data: { }}
        });
        validatePermissionsByModule.resolves({
            payload: { data: { validateLogin: false } }
        });
        consultList.resolves({
            payload: { data: { } }
        });

        defaultProps = {
            updateTitleNavBar,
            validatePermissionsByModule,
            showLoading,
            getAlertsByUser,
            alerts,
            navBar,
            clearFilterPUC,
            consultList,
            clearFilterBlackList,
            clearFilterPE,
            defaultValues
        }
    });

    it('Should render ViewAlerts', () => {
        itRenders(<ViewAlerts {...defaultProps} />);
    })

    it('When getAlertsByUser return payload without data', () => {
        getAlertsByUser.resolves({
            payload: {}
        })
        itRenders(<ViewAlerts {...defaultProps} />);
    })

    it('When validatePermissionsByModule return payload.data.validateLogin is false', () => {
        validatePermissionsByModule.resolves({
            payload: { data: { validateLogin: 'false' } }
        })
        itRenders(<ViewAlerts {...defaultProps} />);
    })

    it('When validatePermissionsByModule return payload.data.data.showModule is false', () => {
        validatePermissionsByModule.resolves({
            payload: { data: { data: { showModule: 'false' }, validateLogin: true } }
        })
        itRenders(<ViewAlerts {...defaultProps} />);
    })

    it('When validatePermissionsByModule return payload.data.data.showModule is true', () => {
        validatePermissionsByModule.resolves({
            payload: { data: { data: { showModule: true }, validateLogin: true } }
        })
        itRenders(<ViewAlerts {...defaultProps} />);
    })

    it('When call method _cleanFilterClientPendingUpdate', () => {
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterClientPendingUpdate();
        expect(showLoading).to.have.been.called.exactly(2);
        expect(clearFilterPUC).to.have.been.called.exactly(1);
    })
    
    it('When call method _cleanFilterClientPendingUpdate consultList return payload.data.teamValueObjects', () => {
        consultList.resolves({
            payload: { data: { teamValueObjects: '' } }
        });
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterClientPendingUpdate();
        expect(showLoading).to.have.been.called.exactly(2);
        expect(clearFilterPUC).to.have.been.called.exactly(1);
    })

    it('When call method _cleanFilterBlackList', () => {
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterBlackList();
        expect(clearFilterBlackList).to.have.been.called.exactly(1);
    })

    it('When call method _cleanFilterPortfolioExpiration', () => {
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterPortfolioExpiration();
        expect(showLoading).to.have.been.called.exactly(2);
        expect(clearFilterPE).to.have.been.called.exactly(1);
    })

    it('When call method _cleanFilterPortfolioExpiration consultList return payload.data.teamValueObjects', () => {
        consultList.resolves({
            payload: { data: { teamValueObjects: '' } }
        });
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterPortfolioExpiration();
        expect(showLoading).to.have.been.called.exactly(2);
        expect(clearFilterPE).to.have.been.called.exactly(1);
    })

    it('When call method _cleanFilterAlertCovenant', () => {
        const wrapper = shallow(<ViewAlerts {...defaultProps} />);
        wrapper.instance()._cleanFilterAlertCovenant();
    })

    it('When call handlePaintAlerts when codeAlert is CODE_ALERT_PENDING_UPDATE_CLIENT', () => {
        const alerts = [{ active: true, codeAlert: CODE_ALERT_PENDING_UPDATE_CLIENT }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })

    it('When call handlePaintAlerts when codeAlert is CODE_ALERT_PORTFOLIO_EXPIRATION', () => {
        const alerts = [{ active: true, codeAlert: CODE_ALERT_PORTFOLIO_EXPIRATION }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })

    it('When call handlePaintAlerts when codeAlert is CODE_COVENANT_ALERT', () => {
        const alerts = [{ active: true, codeAlert: CODE_COVENANT_ALERT }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })

    it('When call handlePaintAlerts when codeAlert is CODE_BLACK_LIST_ALERT', () => {
        const alerts = [{ active: true, codeAlert: CODE_BLACK_LIST_ALERT }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })

    it('When call handlePaintAlerts when codeAlert is null', () => {
        const alerts = [{ active: true, codeAlert: null }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })

    it('When call handlePaintAlerts when active is null', () => {
        const alerts = [{ active: false, codeAlert: null }];
        const wrapper = shallow(<ViewAlerts {...defaultProps}/>);
        wrapper.instance().handlePaintAlerts(alerts)
    })
})