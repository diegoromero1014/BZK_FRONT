import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Field, ErrorMessage, withFormik } from 'formik';
import { Row, Col } from 'react-flexbox-grid';
import { Input } from 'semantic-ui-react';
import { renderLabel, renderMessageError } from '../../functions';
import ElementsComponent from '../elements';
import { schema, participantInformationSchema } from './schema';
import { cleanList, addToList, createList } from '../elements/actions';
import { OBJECTIVES, OBJECTIVES_ERROR_MSG, MANDATORY_OBJECTIVES_MSG, OBJECTIVES_OPEN_ERROR_MSG, OBJECTIVES_PLACEHOLDER } from './constants';
import { swtShowMessage } from '../sweetAlertMessages/actions';
import Tooltip from "../toolTip/toolTipComponent";
import { downloadFilePdf } from '../clientInformation/actions';
import { FILE_OPTION_SOCIAL_STYLE_CONTACT } from '../../constantsGlobal';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import { FILTER_SOCIAL_STYLE } from '../selectsComponent/constants';

export class ParticipantInformation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fields: {
                nameContact: {
                    name: 'Nombre',
                    nullable: true,
                    message: null
                },

                position: {
                    name: 'Cargo',
                    nullable: true,
                    message: null
                },

                socialStyle: {
                    name: 'Estilo social',
                    nullable: false,
                    message: 'Descargar archivo de estilo social'
                },

                attitude: {
                    name: 'Actitud frente al grupo',
                    nullable: true,
                    message: null
                }
            }
        }
    }

    componentWillMount() {
        const { selectedRecord: { interlocutorObjs }, dispatchCleanList, dispatchAddToList, dispatchCreateList } = this.props;

        dispatchCleanList(OBJECTIVES);
        dispatchCreateList(OBJECTIVES);

        if (interlocutorObjs && interlocutorObjs.length) {
            interlocutorObjs.forEach((element, index) => dispatchAddToList({ data: Object.assign({}, element, { order: (index + 1) }), name: OBJECTIVES, old: null }));
        }
    }

    handleDownloadFileSocialStyle = () => {
        const { dispatchDownloadFilePdf } = this.props;
        dispatchDownloadFilePdf(FILE_OPTION_SOCIAL_STYLE_CONTACT);
    }

    renderLabelSocialStyle = ({ name, message, nullable }) => (
        <div style={{ display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between' }}>
            <strong style={{ marginBottom: 10 }}>
                <span>{`${name}  ${!nullable ? '(' : ''}`} </span>
                {!nullable && <span style={{ color: 'red' }}>*</span>}
                {!nullable && ')'}
            </strong>

            <Tooltip text={message}>
                <i onClick={this.handleDownloadFileSocialStyle} style={{ marginLeft: "0px", cursor: "pointer", fontSize: "13px" }} className="red file pdf outline icon" />
            </Tooltip>
        </div>
    );

    render() {
        const { fields: { nameContact, position, socialStyle, attitude } } = this.state;
        const { handleCloseModal, listSocialStyle } = this.props;

        return (
            <Form style={{ backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%" }}>
                <Row style={{ padding: "10px 10px 20px 20px" }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}> Información general</span>
                        </div>
                    </Col>
                </Row>

                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={12}>
                        <Field type="text" name="name">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(nameContact)}
                                    <Input
                                        name="name"
                                        value={value}
                                        placeholder="Nombre"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="name" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>

                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={12}>
                        <Field type="text" name="position">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(position)}
                                    <Input
                                        name="position"
                                        value={value}
                                        placeholder="Cargo"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="position" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>


                <Row style={{ width: '99%', paddingLeft: 20, marginTop: 20 }}>
                    <Col xs={6}>
                        <Field type="text" name="socialStyle">
                            {({ field: { value, name, onBlur }, form: { setFieldValue } }) =>
                                <div>
                                    {this.renderLabelSocialStyle(socialStyle)}

                                    <ComboBox
                                        name="socialStyle"
                                        labelInput="Seleccione..."
                                        valueProp={'id'}
                                        textProp={'value'}
                                        value={value}
                                        onChange={(id, val) => {
                                            setFieldValue("socialStyleName", val, false);
                                            setFieldValue(name, id, false);
                                        }}
                                        onBlur={onBlur}
                                        data={listSocialStyle}
                                        className='field-input'
                                        disabled={''}
                                        parentId="dashboardComponentScroll"
                                        filterData={true}
                                    />
                                    <ErrorMessage name="socialStyle" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>

                    <Col xs={6}>
                        <Field type="text" name="attitude">
                            {({ field: { value, onChange, onBlur } }) =>
                                <div>
                                    {renderLabel(attitude)}
                                    <Input
                                        name="attitude"
                                        value={value}
                                        placeholder="Actitud frente al grupo"
                                        type="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        className='field-input'
                                        disabled={true}
                                    />
                                    <ErrorMessage name="attitude" component={'div'} >
                                        {message => renderMessageError(message)}
                                    </ErrorMessage>
                                </div>
                            }
                        </Field>
                    </Col>
                </Row>

                <Row style={{ padding: "10px 10px 20px 20px", marginTop: 40 }}>
                    <Col xs={12} md={12} lg={12}>
                        <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                            <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                            <i className="browser icon" style={{ fontSize: "20px" }} />
                            <span style={{ fontSize: "20px" }}>{`Objetivos del interlocutor (`}</span>
                            <span style={{ color: 'red', fontSize: 16 }}>*</span>
                            <span style={{ fontSize: "20px" }}>{`)`}</span>

                            <Tooltip text={MANDATORY_OBJECTIVES_MSG}>
                                <i className="help circle icon blue" style={{ fontSize: "16px", cursor: "pointer", marginLeft: "10px" }} />
                            </Tooltip>

                        </div>
                    </Col>
                </Row>

                <Row style={{ marginTop: '-65px' }}>
                    <Col xs={12} md={12} lg={12}>
                        <ElementsComponent
                            schema={schema}
                            placeholder={OBJECTIVES_PLACEHOLDER}
                            messageButton='Agregar'
                            name={OBJECTIVES}
                            max={3}
                            title={'Objetivos del interlocutor'}
                            isEditable={true}
                            singularTitle={'objetivo del interlocutor'}
                            showCheck={false}
                        />
                    </Col>
                </Row>

                <div className="modalBt4-footer modal-footer">
                    <button type="submit" className="btn btn-primary modal-button-edit" style={{ marginRight: 15 }}>
                        <span>Guardar</span>
                    </button>

                    <button type="button" className="btn btn-default modal-button-edit" onClick={handleCloseModal}>
                        <span>Cancelar</span>
                    </button>
                </div>
            </Form>
        );
    }
}

const mapStateToProps = ({ elementsReducer, selectsReducer }) => ({
    elementsReducer,
    listSocialStyle: (selectsReducer.get(FILTER_SOCIAL_STYLE) || [])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchCleanList: cleanList,
        dispatchAddToList: addToList,
        dispatchCreateList: createList,
        dispatchSwtShowMessage: swtShowMessage,
        dispatchDownloadFilePdf: downloadFilePdf
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withFormik({
        handleSubmit: (values, { props }) => {
            const { elementsReducer, dispatchSwtShowMessage } = props;

            let data = elementsReducer[OBJECTIVES];

            if (data && data.open) {
                dispatchSwtShowMessage('error', 'Error', OBJECTIVES_OPEN_ERROR_MSG);
                return;
            }

            if (data && !data.elements.length) {
                dispatchSwtShowMessage('error', 'Error', OBJECTIVES_ERROR_MSG);
                return;
            }

            let newElement = Object.assign({}, props.selectedRecord, { interlocutorObjs: data.elements, socialStyleId: values.socialStyle, estiloSocial: `- ${values.socialStyleName}` });

            props.addContact(newElement);
        },
        mapPropsToValues: ({ selectedRecord }) => {

            if (selectedRecord) {
                const { nameComplet, contactPosition, socialStyleId, contactActitudeCompany } = selectedRecord;
                return Object.assign({}, {}, {
                    name: nameComplet,
                    position: !contactPosition ? '' : contactPosition,
                    socialStyle: socialStyleId,
                    attitude: !contactActitudeCompany ? '' : contactActitudeCompany,
                    socialStyleName: ''
                });
            } else {
                return {
                    name: '',
                    position: '',
                    socialStyle: null,
                    attitude: '',
                    socialStyleName: ''
                }
            }
        },
        validationSchema: participantInformationSchema
    })(
        ParticipantInformation
    )
)