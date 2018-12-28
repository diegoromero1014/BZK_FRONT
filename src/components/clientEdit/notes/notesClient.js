import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteNote, updateNote, addNote } from './actions';
import { getMasterDataFields } from '../../selectsComponent/actions';
import { updateErrorsNotes } from '../../clientDetailsInfo/actions';
import { CLIENT_ID_TYPE, TYPE_NOTES } from '../../selectsComponent/constants';
import Note from './noteItem';
import _ from 'lodash';
import {patternNotesClient, patternOfForbiddenCharacter} from '../../../validationsFields/patternsToValidateField';
import {MESSAGE_WARNING_NOTES_CLIENT, MESSAGE_WARNING_FORBIDDEN_CHARACTER} from '../../../validationsFields/validationsMessages';

class NotesClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldValidateNotes: false
    }

    this._mapNotesItems = this._mapNotesItems.bind(this);
    this._addNote = this._addNote.bind(this);
    this.validateNotes = this.validateNotes.bind(this);
  
  }

  _updateValue(index, e) {
    const { updateNote } = this.props;
    updateNote(index, "body", e);
  }

  _updateValueList(index, value) {
    const { updateNote } = this.props;
    updateNote(index, "combo", value);
  }

  componentDidUpdate() {
    if(this.state.shouldValidateNotes) {
      this.validateNotes()
    }
  }

  validateNotes() {

    const { updateErrorsNotes, notes } = this.props;

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
                if (!_.isUndefined(note.note) && !_.isNull(note.note) && eval(patternNotesClient).test(note.note)) {
                  message = MESSAGE_WARNING_NOTES_CLIENT;
                  updateErrorsNotes(true, message);
                }
                if (!_.isNil(note.note) && patternOfForbiddenCharacter.test(note.note)) {
                  message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
                  updateErrorsNotes(true, message);
                }
            });


            this.setState({shouldValidateNotes: false})
  }

  componentWillMount() {
    const { getMasterDataFields } = this.props;
    getMasterDataFields([TYPE_NOTES]);
  }

  _addNote() {
    const { addNote } = this.props;
    const uuid = _.uniqueId('note_');
    addNote(uuid);
  }

  _mapNotesItems(note) {
    const { selectsReducer } = this.props;
    return <Note
      index={note.uid}
      key={note.uid}
      body={note.body}
      combo={note.combo}
      data={selectsReducer.get(TYPE_NOTES)}
      onDeletedNote={() => this.setState({shouldValidateNotes: true})}
     
    />
  }

  render() {
    const { notes, tabReducer } = this.props;
    
    return (
      <Row style={{ padding: "0px 10px 20px 20px" }}>
        <Col xs={12} md={12} lg={12} style={{ marginTop: "-46px", paddingRight: "35px", textAlign: "right" }}>
          <button className="btn" type="button" onClick={this._addNote} >
            <i className="plus white icon"/>
          </button>
        </Col>
        <Col xs={12} md={12} lg={12} style={{ marginTop: "5px", paddingRight: "35px" }}>
          {tabReducer.get('errorNotesEditClient') && notes.size != 0  &&
            <div>
              <div className="ui pointing below red basic label">
                {tabReducer.get('errorNotesEditClientMessage')}
                  </div>
            </div>
          }
          <div style={tabReducer.get('errorNotesEditClient') && notes.size != 0   ? { paddingBottom: "20px", border: "1px solid red", borderRadius: "5px" } : {}}>
            {notes.map(this._mapNotesItems)}
          </div>
        </Col>
      </Row>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    deleteNote,
    updateNote,
    addNote,
    updateErrorsNotes
  }, dispatch);
}

function mapStateToProps({ notes, selectsReducer, tabReducer }) {
  return {
    notes,
    selectsReducer,
    tabReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesClient);
