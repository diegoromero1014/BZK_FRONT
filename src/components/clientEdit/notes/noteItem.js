import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import { bindActionCreators } from 'redux';
import { deleteNote, updateNote } from './actions';
import { updateErrorsNotes } from '../../clientDetailsInfo/actions';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
    EDITAR,
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_LOAD_DATA,
    OPTION_REQUIRED,
    TITLE_ERROR_SWEET_ALERT,
    VALUE_REQUIERED,
    REGEX_SIMPLE_XSS,
    REGEX_SIMPLE_XSS_STRING,
    VALUE_XSS_INVALID,
    REGEX_SIMPLE_XSS_MESAGE
} from "../../../constantsGlobal";

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
        const { updateNote, index, updateErrorsNotes, notes, shouldUpdateNoteErrors } = this.props;
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

        if(shouldUpdateNoteErrors) {
            notesArray.forEach(function (note) {
                if (_.isEqual(note.note, "") || _.isEqual(note.typeOfNote, "") || _.isEqual(note.note, null) || _.isEqual(note.typeOfNote, null)) {
                    updateErrorsNotes(true, "Debe ingresar todos los campos");
                } else if (eval(REGEX_SIMPLE_XSS_STRING).test(note.note)) {
                    updateErrorsNotes(true, VALUE_XSS_INVALID);
                }
            });
        }

        
    }

    _deleteNote() {
        const { index, deleteNote } = this.props;
        deleteNote(index);
    }

    componentWillMount() {
        const { combo, body, shouldUpdateNoteErrors } = this.props;
        this.updateValue("combo", combo);
        this.updateValue("body", body);

        if(shouldUpdateNoteErrors) {
            if (_.isEqual(body, "") || _.isEqual(body, null) || _.isEqual(combo, "") || _.isEqual(combo, null)) {
                updateErrorsNotes(true, "Debe ingresar todos los campos");
            } else if (eval(REGEX_SIMPLE_XSS_STRING).test(body)) {
                updateErrorsNotes(true, VALUE_XSS_INVALID);
            }
        }

        
    }

    componentDidMount() {
        const { combo, body } = this.props;
        this.updateValue("combo", combo);
        this.updateValue("body", body);
    }

    render() {
        const { combo, body, data, index, _onBlurField, shouldUpdateNoteErrors } = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12} md={3} lg={3} style={{ marginTop: "15px" }}>
                        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <dt><span>Tipo de nota </span> {shouldUpdateNoteErrors && (<span style={{ color: "red" }}>*</span>)  }  </dt>
                            <ComboBox
                                name={`typeNote${index}`}
                                value={this.state.combo}
                                defaultValue={this.state.combo}
                                onChange={val => this.updateValue('combo', val)}
                                onBlur={() => console.log.bind(console)}
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                            />
                        </div>
                    </Col>
                    <Col xs={10} md={8} lg={8} style={{ marginTop: "15px" }}>
                        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                            <dt><span>Descripción de la nota</span>  { shouldUpdateNoteErrors && (<span style={{ color: "red" }}>*</span>)  } </dt>
                            <Input
                                type="text"
                                style={{ height: "22px !important", minHeight: "26px !important", width: "100%" }}
                                value={this.state.body}
                                max={600}
                                onChange={this.updateValue.bind(this, 'body')}
                                onBlur={() => console.log}
                            />
                        </div>
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{ marginTop: "37px" }}>
                        <button onClick={this._deleteNote}
                            className="btn btn-sm  btn-danger"
                            type="button">
                            <i style={{ margin: '0em', fontSize: '1.2em' }} className="trash outline icon"></i>
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
