import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Input } from 'semantic-ui-react';
import { Icon } from 'semantic-ui-react';

import { renderLabel, renderMessageError } from '../../functions';
import ToolTip from '../toolTip/toolTipComponent';
import ListParticipants from './ListParticipants';

import { addParticipant } from './actions';
import { swtShowMessage } from '../sweetAlertMessages/actions';

import { KEY_PARTICIPANT_OTHER } from './constants';

import { schemaOthers as schema } from './schema';

export class OtherParticipants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: {
                name: 'Nombre',
                nullable: false,
                message: null
            },

            position: {
                name: 'Cargo',
                nullable: true,
                message: null
            },

            company: {
                name: 'Empresa',
                nullable: true,
                message: null
            }
        }
    }

    render() {
        const { name, position, company } = this.state;
        const { disabled, handleSubmit, participants, limit } = this.props;

        let data = _.chain(participants.toArray()).map(participant => participant).filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_OTHER)).value();
        let length = data.length;

        return (
            <div>
                <Form>
                    <Row style={{ width: '99%', paddingLeft: 20 }}>
                        <Col xs={4}>
                            <Field type="text" name="name">
                                {({ field: { value, onChange, onBlur } }) =>
                                    <div>
                                        {renderLabel(name)}
                                        <Input
                                            value={value}
                                            name="name"
                                            type="text"
                                            onChange={onChange}
                                            placeholder="Nombre"
                                            onBlur={onBlur}
                                            className='field-input'
                                            disabled={disabled || (length >= limit) ? 'disabled' : ''}
                                        />
                                        <ErrorMessage name="name" component={'div'} >
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }

                            </Field>
                        </Col>

                        <Col xs={4}>
                            <Field type="text" name="position">
                                {({ field: { value, onChange, onBlur } }) =>
                                    <div>
                                        {renderLabel(position)}
                                        <Input
                                            value={value}
                                            name="position"
                                            type="text"
                                            onChange={onChange}
                                            placeholder="Cargo"
                                            onBlur={onBlur}
                                            className='field-input'
                                            disabled={disabled || (length >= limit) ? 'disabled' : ''}
                                        />
                                        <ErrorMessage name="position" component={'div'} >
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }

                            </Field>
                        </Col>

                        <Col xs={3} style={{ flexBasis: '28%', maxWidth: '44%' }}>
                            <Field type="text" name="company">
                                {({ field: { value, onChange, onBlur } }) =>
                                    <div>
                                        {renderLabel(company)}
                                        <Input
                                            value={value}
                                            name="company"
                                            type="text"
                                            onChange={onChange}
                                            placeholder="Empresa"
                                            onBlur={onBlur}
                                            className='field-input'
                                            disabled={disabled || (length >= limit) ? 'disabled' : ''}
                                        />
                                        <ErrorMessage name="company" component={'div'} >
                                            {message => renderMessageError(message)}
                                        </ErrorMessage>
                                    </div>
                                }

                            </Field>
                        </Col>

                        <Col xs={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexBasis: '5%', maxWidth: '5%', height: 80 }}>
                            <ToolTip text={'Agregar participante'}>
                                <Icon
                                    className="btnAgregar"
                                    disabled={disabled || (length >= limit)}
                                    name={'plus circle'}
                                    style={{ cursor: 'pointer', color: 'rgb(33, 133, 208)', fontSize: '30pt !important' }}
                                    size='huge'
                                    onClick={event => {
                                        if(length < limit) {
                                            if (!disabled) {
                                                event.preventDefault();
                                                handleSubmit();
                                            }
                                        }
                                    }}
                                />
                            </ToolTip>
                        </Col>
                    </Row>

                    <div className='participants-client-list'>
                        <Row>
                            {data.length > 0 ?
                                <Col xs={12} md={12} lg={12}>
                                    <ListParticipants data={data} disabled={disabled} type={KEY_PARTICIPANT_OTHER} />
                                </Col>
                                :
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                        <span className="form-item">Aún no se han adicionado participantes</span>
                                    </div>
                                </Col>
                            }
                        </Row>
                    </div>
                </Form>
            </div>
        );
    }
}


const mapStateToProps = ({ participants }) => ({ participants });

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchSwtShowMessage: swtShowMessage,
        dispatchAddParticipant: addParticipant
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withFormik({
        handleSubmit: (values, { props, resetForm }) => {
            const { dispatchAddParticipant } = props;

            let otherParticipant = {
                tipoParticipante: KEY_PARTICIPANT_OTHER,
                idParticipante: '',
                nombreParticipante: values.name,
                cargo: values.position === null || values.position === undefined || values.position === '' ? '' : ' - ' + values.position,
                empresa: values.company === null || values.company === undefined || values.company === '' ? '' : ' - ' + values.company,
                estiloSocial: '',
                actitudBanco: '',
                fecha: Date.now(),
                uuid: _.uniqueId('participanOther_'),
            }

            dispatchAddParticipant(otherParticipant);

            resetForm({ name: '', position: '', company: '' });
        },
        mapPropsToValues: () => ({ name: '', position: '', company: '' }),
        validationSchema: schema
    })(OtherParticipants)
);