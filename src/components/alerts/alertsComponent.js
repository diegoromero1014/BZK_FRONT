/**
 * Created by user- on 11/22/2016.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import ItemAlert from './itemAlert';
import {updateTitleNavBar} from '../navBar/actions';
import {getAlertsByUser,openModalAlerts} from './actions';
import {CODE_ALERT_PENDING_UPDATE_CLIENT} from './constants';
import {MODULE_ALERTS} from '../../constantsGlobal';
import _ from 'lodash';

const itemAlerts = {
    text: "Alertas",
    icon: "alarm icon icon"
};

class ViewAlerts extends Component{
    constructor(props){
        super(props);
        this._mapAlerts = this._mapAlerts.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
     }

    componentWillMount(){
        if(window.localStorage.getItem('sessionToken') === ""){
            redirectUrl("/login");
        }
    }

    openModal(){
        this.props.getAlertsByUser();
        this.props.openModalAlerts(true);
    }
    closeModal(){
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
                return this.paintItemAlert(item,idx,"15px","#086A87","/dashboard/alertClientPendingUpdate");
                break;
            default:
                return null;
        }
    }

    render(){
        const {updateTitleNavBar,alerts} = this.props;
        const listAlerts = alerts.get('listAlertByUser');
        const modalIsOpen = alerts.get('openModal');
        return(
                <li onClick={this.openModal} className="cursorMenuList">
                    <a>
                        <i className={itemAlerts.icon}/>
                        <div style={{width: "100px", height: "30px"}} >
                            <span className="title">{itemAlerts.text}</span>
                        </div>
                    </a>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={this.closeModal}
                        className="modalBt4-fade modal fade contact-detail-modal in">

                        <div className="modalBt4-dialog modalBt4-xl">
                            <div className="modalBt4-content modal-content">
                                <div className="modalBt4-header modal-header">
                                    <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title" id="myModalLabel">{itemAlerts.text}</h4>
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
                </li>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        openModalAlerts,
        getAlertsByUser
    }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar, reducerGlobal,alerts},ownerProps) {
    return {
        viewManagementReducer,
        navBar,
        reducerGlobal,
        alerts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAlerts);
