/**
 * Created by user- on 11/22/2016.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import ItemAlert from './itemAlert';
import {updateTitleNavBar} from '../navBar/actions';
import {showLoading} from '../loading/actions';
import {getAlertsByUser, openModalAlerts} from './actions';
import {updateNumberTotalClients} from '../alertPendingUpdateClient/actions';
import {CODE_ALERT_PENDING_UPDATE_CLIENT} from './constants';
import {validatePermissionsByModule} from '../../actionsGlobal';
import {MODULE_ALERTS, MODULE_CLIENTS} from '../../constantsGlobal';
import {COLOR_ITEMS_MENU} from '../menu/constants';
import {toggleMenu} from '../menu/actions';
import _ from 'lodash';

const itemAlerts = {
    text: "Alertas",
    icon: "alarm icon icon"
};

const styles = {

};

class ViewAlerts extends Component {
    constructor(props) {
        super(props);
        this._mapAlerts = this._mapAlerts.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        }
        this.props.validatePermissionsByModule(MODULE_CLIENTS).then((data) => {
            if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                redirectUrl("/login");
            } else {
                if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
                    redirectUrl("/dashboard");
                }
            }
        });
    }

    openModal() {
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        }
        const {showLoading, getAlertsByUser, toggleMenu} = this.props;
        showLoading(true, 'Cargando alertas..');
        getAlertsByUser().then((data) => {
            if (_.has(data, 'payload.data')) {
                showLoading(false, null);
            }
        });
        toggleMenu();
        this.props.openModalAlerts(true);
    }

    closeModal() {
        this.props.openModalAlerts(false);
    }

    paintItemAlert(item, idx, textSize, colorCard, urlAlert) {
        return (<ItemAlert
            key={idx}
            textValue={item.nameAlert}
            fontSize={textSize}
            iconValue="users icon"
            number={item.countClientByAlert}
            styleColor={colorCard}
            urlAlert={urlAlert}
        />);
    }

    _mapAlerts(item, idx) {
        switch (item.codeAlert) {
            case CODE_ALERT_PENDING_UPDATE_CLIENT:
                return this.paintItemAlert(item, idx, "15px", "#086A87", "/dashboard/alertClientPendingUpdate");
                break;
            default:
                return null;
        }
    }

    render() {
        const {alerts, navBar} = this.props;
        const listAlerts = alerts.get('listAlertByUser');
        const modalIsOpen = alerts.get('openModal');

        if (_.get(navBar.get('mapModulesAccess'), MODULE_ALERTS)) {
            return (
                <Col xs={12} md={6} lg={2} style={{padding: '15px 15px 10px 15px'}}>
                    <div style={{color: 'white',  backgroundColor: COLOR_ITEMS_MENU,  borderColor: COLOR_ITEMS_MENU,  borderRadius: '4px 4px 4px 4px', cursor: 'pointer'}}
                         onClick={this.openModal}>
                        <div style={{height: '120px'}}>
                            <Row>
                                <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                    <i className={itemAlerts.icon} style={{fontSize: "50px", marginTop: '35px', marginLeft: "10px"}}/>
                                </Col>
                                <Col xs={12} md={12} lg={12} style={{textAlign: 'center'}}>
                                    <span style={{ fontSize: '18px', lineHeight: '1.1em'}}>{itemAlerts.text}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={this.closeModal}
                        className="modalBt4-fade modal fade contact-detail-modal in">

                        <div className="modalBt4-dialog modalBt4-xl">
                            <div className="modalBt4-content modal-content">
                                <div className="modalBt4-header modal-header">
                                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}}
                                        id="myModalLabel">{itemAlerts.text}</h4>
                                    <button type="button" onClick={this.closeModal} className="close"
                                            data-dismiss="modal" role="close">
                                        <span className="modal-title" aria-hidden="true" role="close"><i
                                            className="remove icon modal-icon-close" role="close"></i></span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                </div>
                                <div className="ui segment" style={{marginTop: '-2px'}}>
                                    <div style={{backgroundColor: "white"}}>
                                        <Row xs={12} md={12} lg={12} style={{padding: '15px 20px 10px 20px'}}>
                                            {listAlerts.map(this._mapAlerts)}
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </Col>
            );
        }else{
            return null;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        openModalAlerts,
        getAlertsByUser,
        showLoading,
        updateNumberTotalClients,
        validatePermissionsByModule,
        toggleMenu
    }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar, reducerGlobal, alerts}, ownerProps) {
    return {
        viewManagementReducer,
        navBar,
        reducerGlobal,
        alerts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAlerts);
