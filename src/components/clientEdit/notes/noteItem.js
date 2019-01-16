import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { deleteNote, updateNote } from './actions';
import { updateErrorsNotes } from '../../clientDetailsInfo/actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import {patternNotesClient, patternOfForbiddenCharacter} from '../../../validationsFields/patternsToValidateField';
import {MESSAGE_WARNING_NOTES_CLIENT, MESSAGE_WARNING_FORBIDDEN_CHARACTER} from '../../../validationsFields/validationsMessages';

class NoteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: '',
            combo: ''
        };
        this.updateValue = this.updateValue.bind(this);
        this._deleteNote = this._deleteNote.bind(this);
    }


    updateValue(prop, value) {
        const { updateNote, index, updateErrorsNotes, notes } = this.props;
        this.setState(_.set({}, prop, value));
        updateNote(index, prop, value);
        let notesArray = [];
        notes.map(map => {
            var noteItem = {
                "typeOfNote": map.combo,
                "note": map.body
            }
            notesArray.push(noteItem);
        });
        updateErrorsNotes(false, "");


        notesArray.forEach(function (note) {
            let message = null;
            if (_.isEqual(note.note, "") || _.isEqual(note.typeOfNote, "") || _.isEqual(note.note, null) || _.isEqual(note.typeOfNote, null)) {
                updateErrorsNotes(true, "Debe ingresar todos los campos");
            }
            if (!_.isUndefined(note.note) && !_.isNull(note.note) && !_.isEmpty(value) && !patternNotesClient.test(note.note)) {
                message = MESSAGE_WARNING_NOTES_CLIENT;
                updateErrorsNotes(true, message);
            }
            if (!_.isNil(note.note) && patternOfForbiddenCharacter.test(note.note)) {
                message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
                updateErrorsNotes(true, message);
            }
        });



    }

    _deleteNote() {
        const { index, deleteNote, onDeletedNote } = this.props;

        deleteNote(index);
        //Avisar al padre que una nota se elimino
        onDeletedNote();



    }

    componentWillMount() {
        const { combo, body } = this.props;
        this.updateValue("combo", combo);
        this.updateValue("body", body);

        let message = null;
        if (_.isEqual(body, "") || _.isEqual(body, null) || _.isEqual(combo, "") || _.isEqual(combo, null)) {
            updateErrorsNotes(true, "Debe ingresar todos los campos");
        }
        if (!_.isUndefined(body) && !_.isNull(body) && eval(patternNotesClient).test(body)) {
            message = MESSAGE_WARNING_NOTES_CLIENT;
            updateErrorsNotes(true, message);
        }
        if (!_.isNil(body) && patternOfForbiddenCharacter.test(body)) {
            message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
            updateErrorsNotes(true, message);
        }



    }

    componentDidMount() {
        const { combo, body } = this.props;
        this.updateValue("combo", combo);
        this.updateValue("body", body);
    }

    render() {
        const { combo, body, data, index, _onBlurField } = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12} md={3} lg={3} style={{ marginTop: "15px" }}>
                        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <dt><span>Tipo de nota </span>  (<span style={{ color: "red" }}>*</span>)    </dt>
                            <ComboBox
                                name={`typeNote${index}`}
                                value={this.state.combo}
                                defaultValue={this.state.combo}
                                onChange={val => this.updateValue('combo', val)}
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                            />
                        </div>
                    </Col>
                    <Col xs={10} md={8} lg={8} style={{ marginTop: "15px" }}>
                        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <dt><span>Descripción de la nota</span>  (<span style={{ color: "red" }}>*</span>) </dt>
                            <Input
                                type="text"
                                style={{ height: "22px !important", minHeight: "26px !important", width: "100%" }}
                                value={this.state.body}
                                max={600}
                                onChange={this.updateValue.bind(this, 'body')}
                            />
                        </div>
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{ marginTop: "37px" }}>
                        <button name={"trashNotes"} onClick={this._deleteNote}
                            className="btn btn-sm  btn-danger"
                            type="button">                            
                            <i style={{ margin: '0em', fontSize: '1.2em' }} className="trash icon"></i>
                        </button>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteNote,
        updateNote,
        updateErrorsNotes
    }, dispatch);
}


function mapStateToProps({ notes }) {
    return { notes };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteItem);
