import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../ui/input/inputComponent';
import { formValidateKeyEnter, nonValidateEnter } from '../../../../actionsGlobal';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStateSaveData } from '../../../dashboard/actions';
import { getInfoCovenant, clearCovenant } from '../actions';
import ListTracking from './listTracking';
import _ from 'lodash';

const fields = [];
const errors = {};

const validate = (values) => {
    return errors;
}

class CreateTracking extends Component {
    constructor(props) {
        super(props);
        this._handleCreateTracking = this._handleCreateTracking.bind(this);
        this._addTracking = this._addTracking.bind(this);
    }

    componentWillMount() {
        this.props.resetForm();
        const {nonValidateEnter} = this.props;
        nonValidateEnter(true);
    }

    _handleCreateTracking() {
        console.log('Trueeeeeeeeeee');
    }

    _addTracking() {
        console.log('Add Tracking');
    }

    render() {
        const {handleSubmit, covenant} = this.props;
        const infoCovenant = covenant.get('covenantInfo');
        return (
            <form onSubmit={handleSubmit(this._handleCreateTracking)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial', marginLeft: '15px', marginRight: '15px' }} >
                    <Row xs={12} md={12} lg={12} style={{marginBottom: '10px'}} >
                        {infoCovenant.showButtonAddTrackingCovenant &&
                            <Col xs={12} md={12} lg={12} style={{ paddingRight: "8px", textAlign: "right" }}>
                                <button className="btn btn-primary" onClick={this._addTracking} style={{ float: 'right', cursor: 'pointer' }} title="Agregar seguimiento">
                                    <i className="white plus icon"></i>
                                </button>
                            </Col>
                        }
                    </Row>
                    <Row xs={12} md={12} lg={12}>
                        <Col xs={12} md={12} lg={12}>
                            <ListTracking />
                        </Col>
                    </Row>
                </div>
            </form>
        );
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter,
        formValidateKeyEnter
    }, dispatch);
}

function mapStateToProps({reducerGlobal, covenant}, ownerProps) {
    return {
        reducerGlobal,
        covenant
    };
}

export default reduxForm({
    form: 'submitValidationTrackingCovenant',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(CreateTracking);