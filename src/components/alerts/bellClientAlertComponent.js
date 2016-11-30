import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Icon, Popup, Grid } from 'semantic-ui-react';
import {get,set,size} from 'lodash';
import {redirectUrl} from '../globalComponents/actions';
import {CODE_ALERT_PENDING_UPDATE_CLIENT} from './constants';
import _ from 'lodash';

const styleNumAlert={
    position: "absolute",
    right: "30px",
    top: "-15px",
    fontSize: "15px",
    background: "red",
    borderRadius: "14px",
    padding: "2px 4px",
    color: "#fff",
    width: "25px",
    height: "25px",
    textAlign: "center"
};

const styleAlert = {
    backgroundColor: "#e2e1e1",
    padding:"14px 10px",
    marginTop:"10px",
    borderRadius: "5px",
    cursor: 'pointer'
}

class BellClientAlertComponent extends Component {
    constructor(props) {
        super(props);
        this.state={colorNumAlert:"red"};
    }

    _handleRenderAlertOnClient(listAlerts){
        if(!_.isUndefined(listAlerts)){
            if(listAlerts != null ){
                return listAlerts.map((alert,idx)=> {
                return (
                        <Grid.Row key={idx} style={styleAlert} >
                            <div onClick={this._handleRedirectAlert.bind(this,alert.code)}>
                                {alert.name}
                            </div>
                        </Grid.Row>
                    );
                });

            }
        }
    }

    _handleRedirectAlert(codeAlert) {
        switch (codeAlert) {
            case CODE_ALERT_PENDING_UPDATE_CLIENT:
                redirectUrl("/dashboard/alertClientPendingUpdate");
                break;
            default:
                return null;
        }
    }


    render() {
        set(styleNumAlert,'background',size(this.props.listAlertOnClient) > 0 ? 'red' : 'green');
        return (
            <div style={{position: "absolute",
                right: "10px",
                marginTop: "20px"}}>
                <div style={{background: "#ececec",padding: "10px 0 0 5px",position: "relative", top: "-10px",borderRadius: "30px"}}>
                    <Popup
                        trigger={<Icon name='alarm outline' />}
                        size='large'
                        on='click'
                        positioning='bottom left'
                    >
                        <Grid style={{maxHeight:"400px",overflow: "scroll"}}>
                            {this._handleRenderAlertOnClient(this.props.listAlertOnClient)}
                        </Grid>
                    </Popup>
                </div>
                <span style={styleNumAlert}>{size(this.props.listAlertOnClient)}</span>

            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({clientInformacion},ownerProps) {
    return {
        listAlertOnClient:get(clientInformacion.get('responseClientInfo'),'alertsOnClient')
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BellClientAlertComponent);
