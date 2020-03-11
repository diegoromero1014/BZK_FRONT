import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { Icon, TextArea } from 'semantic-ui-react';
import { Row, Col } from 'react-flexbox-grid';
import { Field, ErrorMessage, withFormik } from 'formik';
import { renderMessageError } from '../../functions';
import ToolTip from '../toolTip/toolTipComponent';
import '../../../styles/elements/main.scss';
import { createList, addToList, removeFromList, setToShow } from './actions';
import ItemList from './itemList';
import { swtShowMessage } from '../sweetAlertMessages/actions';


export class ElementsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            selectedRecord: null
        }
    }

    componentWillMount() {
        const { dispatchCreateList, name } = this.props;
        dispatchCreateList(name);
    }

    handleOnDelete = data => {
        const { dispatchSwtShowMessage, dispatchRemoveFromList, name, singularTitle } = this.props;

        dispatchSwtShowMessage(
            'warning',
            "Confirmar", `Señor usuario, ¿está seguro que desea eliminar ${singularTitle}?`,
            {
                onConfirmCallback: () => { dispatchRemoveFromList({ name, data }); },
                onCancelCallback: () => { }
            },
            {
                "confirmButtonColor": '#DD6B55',
                "confirmButtonText": 'Sí, estoy seguro!',
                "cancelButtonText": "Cancelar",
                "showCancelButton": true,
            }
        );
    }

    handleOnEdit = (data, index) => {
        const { id, text } = data;
        const { setValues, dispatchSetToShow, name } = this.props;

        setValues({ id, text, objectEdited: data, didChange: true });
        this.setState({ show: true, selectedRecord: index });
        dispatchSetToShow({ name, show: true });
    }

    handleOnSelect = (element, { target: { checked } }) => {
        const { name, dispatchAddToList } = this.props;
        dispatchAddToList({ name: name, data: Object.assign({}, element, { associated: checked }), old: element });
    }

    render() {
        const {
            placeholder,
            messageButton,
            handleSubmit,
            name,
            elementsReducer,
            max,
            resetForm,
            title,
            dispatchSetToShow,
            values: { objectEdited },
            isEditable,
            idButton,
            dispatchSwtShowMessage
        } = this.props;
        const { show } = this.state;

        let data = elementsReducer[name];
        let length;

        if (data) {
            data = data.elements;
            length = data.length || 0;
        }

        return (
            <form>
                <div className={'elements-container'}>
                    <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30, display: 'flex', flexDirection: 'row' }} end="xs">
                        <Col xs={1} md={1} lg={1} style={{ justifySelf: 'end' }}>
                            <ToolTip text={messageButton}>
                                <Icon
                                    className='icon-message-elements'
                                    id={idButton ? idButton : 'element'}
                                    size='huge'
                                    name={'add square'}
                                    style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (isEditable && length < max) {
                                            this.setState({ show: true });
                                            dispatchSetToShow({ name, show: true });
                                        } else {
                                            dispatchSwtShowMessage(
                                                'warning',
                                                "Advertencia", `Señor usuario, ya alcanzó el número máximo de ${title} que puede crear.`,
                                            );
                                        }
                                    }}
                                    disabled={!isEditable || length >= max}
                                />
                            </ToolTip>
                        </Col>
                    </Row>

                    {show &&
                        <Row style={{ width: '99%', paddingLeft: 20 }}>
                            <Col xs={10} md={10} lg={10}>
                                <Field type="text" name="text">
                                    {({ field: { value, name, onChange, onBlur }, form: { errors } }) =>
                                        <div>
                                            <TextArea
                                                name={name}
                                                id={name}
                                                cols="30"
                                                rows="10"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder={placeholder}
                                                className={`field ${errors[name] ? 'error-field-element' : ''} textInterlocutorObjs`}
                                            />
                                            <br></br>

                                            <ErrorMessage name={name} component={'div'} >
                                                {message => renderMessageError(message)}
                                            </ErrorMessage>
                                        </div>
                                    }
                                </Field>
                            </Col>

                            <Col xs={2} md={2} lg={2}>
                                <Col xs={12} md={12} lg={12}>
                                    <button
                                        type="submit"
                                        className='button-primary'
                                        onClick={event => {
                                            event.preventDefault();
                                            handleSubmit();

                                            if (this.props.isValid) {
                                                this.setState({ show: false, selectedRecord: null });
                                                dispatchSetToShow({ name, show: false, selectedRecord: null });
                                            }
                                        }}
                                    >
                                        {!objectEdited ? 'Agregar' : 'Modificar'}

                                    </button>
                                </Col>
                                <Col xs={12} md={12} lg={12}>
                                    <button
                                        type="reset"
                                        className='button-secondary'
                                        onClick={() => {
                                            this.setState({ show: false, selectedRecord: null });
                                            dispatchSetToShow({ name, show: false, selectedRecord: null });
                                            resetForm({ id: null, text: '' });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </Col>
                            </Col>
                        </Row>
                    }

                    <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                        <ItemList
                            data={data || []}
                            handleDelete={this.handleOnDelete}
                            handleEdit={this.handleOnEdit}
                            handleOnSelect={this.handleOnSelect}
                            showCheck={this.props.showCheck}
                            title={title}
                            show={show}
                            isEditable={isEditable}
                            selectedRecord={this.state.selectedRecord}
                        />
                    </Row>
                </div>
            </form>
        );
    }
}

const mapStateToProps = ({ elementsReducer }) => ({
    elementsReducer
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        dispatchCreateList: createList,
        dispatchAddToList: addToList,
        dispatchRemoveFromList: removeFromList,
        dispatchSetToShow: setToShow,
        dispatchSwtShowMessage: swtShowMessage,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withFormik({
        handleSubmit: (values, { setSubmitting, props, resetForm }) => {
            const { objectEdited } = values;
            const list = props.elementsReducer[props.name].elements;
            let old;

            setSubmitting(false);

            let order = (list.length + 1);

            if (objectEdited) {
                old = list.filter(element => element === objectEdited)[0];
                order = old.order;
            }

            const data = Object.assign({}, values, { order, associated: true, editable: true });
            delete data.objectEdited;

            props.dispatchAddToList({ name: props.name, data, old });

            if (props.executeFunction) {
                props.executeFunction();
            }

            resetForm({ id: null, text: '' });
        },
        mapPropsToValues: () => ({ id: null, text: '' }),
        validationSchema: ({ schema }) => schema
    })(
        ElementsComponent
    )
)