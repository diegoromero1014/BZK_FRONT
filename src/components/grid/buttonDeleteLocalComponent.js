import React, {Component, PropTypes} from 'react';
import SweetAlert from 'sweetalert-react';

import {clearFilterGroup} from '../contact/favoritesGroup/actions';

class ButtonDeleteLocalComponent extends Component {

    constructor(props) {
        super(props);
        this._onConfirmDelete = this._onConfirmDelete.bind(this);
        this._confirmDeleteEntity = this._confirmDeleteEntity.bind(this);
        this._closeAlert = this._closeAlert.bind(this);
        this.state = {
            show: false
        };
    }

    _onConfirmDelete(){
        this.setState({show: false});
        this.props.fn.apply(this,this.props.args);
    }

    _confirmDeleteEntity(e) {
        this.setState({show: true});
    }

    _closeAlert(e) {
        this.setState({show: false});
    }

    render() {
        const {message,title} = this.props;
        const titleText = (_.isUndefined(title))?"Confirmación eliminación":title;

        return (
            <td style={{padding: '10px', textAlign: 'center'}}>
                <button onClick={this._confirmDeleteEntity} className="btn btn-sm  btn-danger">
                    <i style={{margin: '0em', fontSize: '1.2em'}} className="trash outline icon"></i>
                </button>
                <SweetAlert
                    type="warning"
                    show={this.state.show}
                    title={titleText}
                    confirmButtonColor='#DD6B55'
                    confirmButtonText='Sí, estoy seguro!'
                    cancelButtonText="Cancelar"
                    text={message}
                    showCancelButton={true}
                    onCancel={this._closeAlert}
                    onConfirm={this._onConfirmDelete}/>
            </td>);
    }
}

ButtonDeleteLocalComponent.propTypes = {
    fn:PropTypes.func.isRequired,
    args:PropTypes.array,
    message:PropTypes.string.isRequired,
    title:PropTypes.string
};


export default ButtonDeleteLocalComponent;
