import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import {updateTitleNavBar} from "../navBar/actions";

export class MyTaskPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatchUpdateTitleNavBar } = this.props;
        dispatchUpdateTitleNavBar("Tareas");
    }

    render() {
        return (
            <div>
                <p>Hola mundo</p>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchUpdateTitleNavBar: updateTitleNavBar
    }, dispatch);
}

function mapStateToProps({reducerGlobal, navBar}) {
    return {
        reducerGlobal,
        navBar
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTaskPage);