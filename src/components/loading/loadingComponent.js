import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class LoadingComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {loading} = this.props;
        const textLoading = loading.get('textLoading');
        const show = loading.get('showLoading');
        if(show){
            return (
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">{textLoading}</div>
                </div>
            );
        }else{
            return null;
        }
    }
}

function mapStateToProps({loading,}, ownerProps) {
    return {
        loading
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingComponent);


