import React, {Component, PropTypes} from 'react';
import SweetAlert from 'sweetalert-react';

import {clearFilterGroup} from '../contact/favoritesGroup/actions';

class ButtonDeleteLocalComponent extends Component {

    constructor(props) {
        super(props);
        this._onConfirmDelete = this._onConfirmDelete.bind(this);
        this._confirmDeleteEntity = this._confirmDeleteEntity.bind(this);
        this._closeAlert = this._closeAlert.bind(this);
        this._renderBtnAction = this._renderBtnAction.bind(this);
        this.state = {
            show: false
        };
    }

    _onConfirmDelete() {
        this.setState({show: false});
        this.props.fn.apply(this, this.props.args);
    }

    _confirmDeleteEntity(e) {
        this.setState({show: true});
    }

    _closeAlert(e) {
        this.setState({show: false});
    }

    _renderBtnAction() {
        const {typeAction} = this.props;
        switch (typeAction) {
            case 'button':
                return (<button onClick={this._confirmDeleteEntity} className="btn btn-sm  btn-danger">
                    <i style={{margin: '0em', fontSize: '1.2em'}} className='trash outline icon'/>
                </button>);
            case 'icon':
                return (<i className='trash outline icon' title='Eliminar' style={{ cursor: "pointer" }}
                           onClick={this._confirmDeleteEntity}/>);
            default :
                return (<button onClick={this._confirmDeleteEntity} className="btn btn-sm  btn-danger">
                    <i style={{margin: '0em', fontSize: '1.2em'}} title='Eliminar' className='trash outline icon'/>
                </button>);
        }

    }

    render() {
        const {message,title} = this.props;
        const titleText = (_.isUndefined(title)) ? "Confirmar eliminación" : title;
        return (
            <div style={{padding: '10px', textAlign: 'center'}}>
                {this._renderBtnAction()}
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
            </div>);
    }
}

ButtonDeleteLocalComponent.propTypes = {
    fn: PropTypes.func.isRequired,
    args: PropTypes.array,
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    typeAction: PropTypes.string.isRequired
};


export default ButtonDeleteLocalComponent;
