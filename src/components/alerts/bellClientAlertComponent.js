import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Icon, Popup, Grid} from 'semantic-ui-react';
import {get, set, size} from 'lodash';
import {GREEN_COLOR, RED_COLOR} from '../../constantsGlobal';
import _ from 'lodash';

const styleNumAlert = {
    position: "absolute",
    right: "20px",
    top: "-15px",
    fontSize: "13px",
    background: RED_COLOR,
    borderRadius: "14px",
    color: "#fff",
    width: "18px",
    height: "18px",
    textAlign: "center"
};

const styleAlert = {
    backgroundColor: "#e2e1e1",
    padding: "14px 10px",
    marginTop: "10px",
    borderRadius: "5px"
};

const styles = {
    iconAlert: {
        position: "relative"
    }
};

class BellClientAlertComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {colorNumAlert: RED_COLOR};
    }

    _handleRenderAlertOnClient(listAlerts) {
        if (!_.isUndefined(listAlerts)) {
            if (listAlerts != null) {
                if (size(listAlerts) > 0) {
                    return listAlerts.map((alert, idx) => {
                        return (
                            <Grid.Row key={idx} style={styleAlert}>
                                <div>
                                    {alert.name}
                                </div>
                            </Grid.Row>
                        );
                    });
                }
                return (
                    <Grid.Row style={styleAlert}>
                        <div>
                            El cliente no tiene alertas asociadas
                        </div>
                    </Grid.Row>
                );
            }
        }
    }

    render() {
        set(styleNumAlert, 'background', size(this.props.listAlertOnClient) > 0 ? RED_COLOR : GREEN_COLOR);
        return (
            <div style={styles.iconAlert}>
                <div style={{
                    background: "#ececec",
                    padding: "4px 4px",
                    width : 28,
                    height: 28,
                    position: "relative",
                    top: "-10px",
                    borderRadius: "30px",
                    cursor: 'pointer',
                    textAlign: 'center'
                }}>
                    <Popup
                        trigger={<Icon name='alarm outline'/>}
                        size='large'
                        flowing
                        hoverable
                        positioning='bottom left'
                    >
                        <Grid style={{maxHeight: "400px", overflow: "scroll"}}>
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
    return bindActionCreators({}, dispatch);
}

function mapStateToProps({clientInformacion}, ownerProps) {
    return {
        listAlertOnClient: get(clientInformacion.get('responseClientInfo'), 'alertsOnClient')
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BellClientAlertComponent);
