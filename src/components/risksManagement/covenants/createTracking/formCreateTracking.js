import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../ui/input/inputComponent';
import DateTimePickerUi from '../../../../ui/dateTimePicker/dateTimePickerComponent';
import { Row, Col } from 'react-flexbox-grid';
import { formValidateKeyEnter, nonValidateEnter } from '../../../../actionsGlobal';
import { DATE_FORMAT } from '../../../../constantsGlobal';
import { redirectUrl } from '../../../globalComponents/actions';
import { changeStatusCreate } from '../actions';
import { VALID_COVENANT } from '../../../selectsComponent/constants';
import { getMasterDataFields } from '../../../selectsComponent/actions';
import moment from 'moment';
import _ from 'lodash';

const fields = ["trackingDate", "validCovenant"];
const errors = {};

const validate = (values) => {
    return errors;
}

class FormCreateTracking extends Component {
    constructor(props) {
        super(props);
        this._handleCreateTracking = this._handleCreateTracking.bind(this);
        this._canceCreate = this._canceCreate.bind(this);
    }

    componenWillMount() {
        const {nonValidateEnter, getMasterDataFields} = this.props;
        getMasterDataFields([VALID_COVENANT]);
        nonValidateEnter(true);
    }

    _handleCreateTracking() {
        alert('Create');
    }

    _canceCreate() {
        const {changeStatusCreate} = this.props;
        changeStatusCreate(false);
    }

    render() {
        const { fields: {trackingDate, validCovenant},
            handleSubmit, formValidateKeyEnter, selectsReducer} = this.props;
        return (
            <form onSubmit={handleSubmit(this._handleCreateTracking)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
                <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'initial' }}>
                    <Row xs={12} md={12} lg={12} style={{ paddingBottom: '20px' }}>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Fecha seguimiento - DD/MM/YYYY (</span><span style={{ color: "red" }}>*</span>)
                            </dt>
                            <DateTimePickerUi
                                culture='es'
                                format={DATE_FORMAT}
                                time={false}
                                {...trackingDate}
                                />
                        </Col>
                        <Col xs={12} md={6} lg={4} style={{ paddingRight: "15px" }}>
                            <dt>
                                <span>Covenant vigente (</span><span style={{ color: "red" }}>*</span>)
                            </dt>
                            <ComboBox
                                name="validCovenant"
                                labelInput="Seleccione..."
                                valueProp={'id'}
                                textProp={'code'}
                                {...validCovenant}
                                data={selectsReducer.get(VALID_COVENANT) || []}
                                onChange={val => this._changeCurrency(val)}
                                />
                        </Col>
                    </Row>

                    <Row xs={12} md={12} lg={12} style={{ paddingBottom: '30px', marginLeft: '3px' }}>
                        <button className="btn" type="submit" >
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar</span>
                        </button>
                        <button className="btn" type="button" onClick={this._canceCreate} style={{ backgroundColor: "rgb(193, 193, 193)", marginLeft: '15px' }}>
                            <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                        </button>
                    </Row>
                </div>
            </form>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        nonValidateEnter,
        formValidateKeyEnter,
        changeStatusCreate,
        getMasterDataFields
    }, dispatch);
}

function mapStateToProps({selectsReducer, reducerGlobal, covenant}, ownerProps) {
    return {
        selectsReducer,
        reducerGlobal,
        covenant
    };
}

export default reduxForm({
    form: 'submitValidationTrackingCovenant',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(FormCreateTracking);