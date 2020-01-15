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


class ElementsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    componentWillMount() {
        const { dispatchCreateList, name } = this.props;
        dispatchCreateList(name);
    }

    handleOnDelete = data => {
        const { dispatchRemoveFromList, name } = this.props;
        dispatchRemoveFromList({ name, data });
    }

    handleOnEdit = data => {
        const { id, text } = data;
        const { setValues, dispatchSetToShow, name } = this.props;

        setValues({ id, text, objectEdited: data });
        this.setState({ show: true });
        dispatchSetToShow({ name, show: true });
    }
    
    render() {
        const { placeholder, messageButton, handleSubmit, name, elementsReducer, max, resetForm, title, dispatchSetToShow } = this.props;
        const { show } = this.state;

        let data = elementsReducer[name];
        let length;

        if(data) {
            data = data.elements;
            length = data.length || 0;
        }

        return (
            <form>
                <div className={'elements-container'}>
                    <Row style={{ padding: "10px 10px 20px 20px", marginBottom: 30 }} end="xs">
                        <Col xs={12} md={12} lg={12}>
                            <ToolTip text={messageButton}>
                                <Icon
                                    className='icon-message-elements'
                                    size='huge'
                                    name={'add square'}
                                    style={{ color: '#16498b', fontSize: '34pt !important', margin: '0px 20px 10px 20px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if(!(length || 0) === max) {
                                            this.setState({ show: true });
                                            dispatchSetToShow({ name, show: true });
                                        }
                                    }}
                                    disabled={(length || 0) === max}
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
                                                className={`field ${errors[name] ? 'error' : ''}`}
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
                                                this.setState({ show: false });
                                                dispatchSetToShow({ name, show: false });
                                            }
                                        }}
                                    >
                                        Agregar
                                    </button>
                                </Col>
                                <Col xs={12} md={12} lg={12}>
                                    <button
                                        type="reset"
                                        className='button-secondary'
                                        onClick={() => {
                                            this.setState({ show: false });
                                            dispatchSetToShow({ name, show: false });
                                            resetForm({id: null, text: ''});
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </Col>
                            </Col>
                        </Row>
                    }

                    <Row style={{ padding: "10px 10px 20px 30px", marginBottom: 70, width: '99%' }} end="xs">
                        <ItemList data={data || []} handleDelete={this.handleOnDelete} handleEdit={this.handleOnEdit} title={title}  />
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
        dispatchSetToShow: setToShow
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

            if(objectEdited) {
                old = list.filter(element => element === objectEdited)[0];
                order = old.order;
            }

            const data = Object.assign({}, values, { order });
            delete data.objectEdited;

            props.dispatchAddToList({ name: props.name, data, old });

            resetForm({id: null, text: ''});
        },
        mapPropsToValues: () => ({ id: null, text: '' }),
        validationSchema: ({ schema }) => schema
    })(
        ElementsComponent  
    )
)