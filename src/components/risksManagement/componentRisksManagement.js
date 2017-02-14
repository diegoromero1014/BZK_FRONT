/**
 * Created by IAS-ASUS on 2/1/2017.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class RisksManagementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openMessagePermissions: false,
            value1: ""
        };
    }

    // componentWillMount() {
    //     const {consultModulesAccess} = this.props;
    //     consultModulesAccess();
    // }

    render() {
        // const {infoClient, tabReducer, navBar} = this.props;
        let styleCovenants = false;
        return (
            <div>
                <h1>sdsdsd</h1>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}


function mapStateToProps({RisksManagementReducer, navBar, reducerGlobal}, ownerProps){
    return {
        RisksManagementReducer,
        navBar,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RisksManagementComponent);
