/**
 * Created by user- on 11/22/2016.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {redirectUrl} from '../globalComponents/actions';
import ItemAlert from './itemAlert';
import {updateTitleNavBar} from '../navBar/actions';
import {getAlertsByUser} from './actions';
import {CODE_ALERT_PENDING_UPDATE_CLIENT} from './constants';
import {MODULE_ALERTS} from '../../constantsGlobal';
import _ from 'lodash';

class ViewAlerts extends Component{
    constructor(props){
        super(props);
        this._mapAlerts = this._mapAlerts.bind(this);
     }

    componentWillMount(){
        if(window.localStorage.getItem('sessionToken') === ""){
            redirectUrl("/login");
        } else {
            const {getAlertsByUser} = this.props;

        }
    }

     paintItemAlert(item, idx, textSize, colorCard, urlAlert) {
        return (<ItemAlert
            key={idx}
            textValue={item.nameAlert}
            fontSize={textSize}
            iconValue="alarm outline icon"
            number={item.countClientByAlert}
            styleColor={colorCard}
            urlAlert={urlAlert}
        />);
    }

    _mapAlerts(item, idx) {
        switch (item.codeAlert) {
            case CODE_ALERT_PENDING_UPDATE_CLIENT:
                return this.paintItemAlert(item,idx,"15px","#f0ad4e","/dashboard/alertClientPendingUpdate");
                break;
            default:
                return null;
        }
    }

    render(){
        const {updateTitleNavBar,alerts} = this.props;
        const listAlerts = alerts.get('listAlertByUser');
        updateTitleNavBar(MODULE_ALERTS);
        return(
            <div className="ui segment" style={{marginTop: '-2px'}}>
                <div style={{backgroundColor: "white"}}>
                    <Row xs={12} md={12} lg={12} style={{padding: '15px 20px 10px 20px'}}>
                        {listAlerts.map(this._mapAlerts)}
                    </Row>
                </div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar
    }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar, reducerGlobal,alerts},ownerProps) {
    return {
        viewManagementReducer,
        navBar,
        reducerGlobal,
        alerts,
        getAlertsByUser
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAlerts);
