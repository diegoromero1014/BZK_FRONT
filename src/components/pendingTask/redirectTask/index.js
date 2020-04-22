import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TaskPageUrl} from "../../../constantsAnalytics";
import {bindActionCreators} from "redux";
import {setTaskIdFromRedirect} from "../actions";
import {redirectUrl} from '../../globalComponents/actions';

export class RedirectTaskComponent extends Component {

    state = {
        redirect: false
    };

    async componentDidMount() {
        const { params: { id }, dispatchSetTaskIdFromRedirect } = this.props;
        dispatchSetTaskIdFromRedirect(id);
        await this.setRedirect();
        this.renderRedirect(id);
    }

    setRedirect = async () => {
        await this.setState({ redirect: true });
    };

    renderRedirect = (id) => {
        if(this.state.redirect){
            redirectUrl(`${TaskPageUrl}/${id}`);
        }
    };

    render() {
        return (
            <div>
                <span>Redirigiendo hacia la tarea...</span>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchSetTaskIdFromRedirect: setTaskIdFromRedirect
    }, dispatch);
}

export default connect(
    null,
    mapDispatchToProps
)(RedirectTaskComponent);