import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteNote, updateNote, addNote} from './actions';
import {consultDataSelect} from '../selectsComponent/actions';
import {CLIENT_ID_TYPE, TYPE_NOTES} from '../selectsComponent/constants';
import Note from './noteItem';
import _ from 'lodash';

class NotesClient extends Component {
    constructor(props) {
        super(props);
        this._mapNotesItems = this._mapNotesItems.bind(this);
        this._addNote = this._addNote.bind(this);
    }

    _deleteNote(index, e) {
        e.preventDefault();
        const {deleteNote} = this.props;
        deleteNote(index);
    }

    _updateValue(index, e) {
        const {updateNote} = this.props;
        updateNote(index, "body", e.target.value);
    }

    _updateValueList(index, value) {
        const {updateNote} = this.props;
        updateNote(index, "combo", value);
    }

    componentWillMount() {
        const {consultDataSelect} = this.props;
        consultDataSelect(TYPE_NOTES);
    }

    _addNote() {
        const {addNote} = this.props;
        const uuid = _.uniqueId('note_');
        addNote(uuid);
    }

    _mapNotesItems(note) {
        const {selectsReducer} = this.props;
        console.log("selectsReducer.get('dataTypeNotes')", selectsReducer.get("dataTypeNotes"));
        return <Note
            index={ note[0]}
            key={ note[0]}
            combo={note[1].combo}
            body={note[1].body}
            _updateValueList={this._updateValueList.bind(this, note[0])}
            _updateValue={this._updateValue.bind(this, note[0])}
            _onBlurField={() => console.log.bind(console)}
            _deleteNote={this._deleteNote.bind(this, note[0])}
            data={selectsReducer.get("dataTypeNotes")}
        />
    }

    render() {
        const {notes} = this.props;
        return (
            <Row style={{padding: "0px 10px 20px 20px"}}>
              <Col xs={12} md={12} lg={12} style={{marginTop: "-50px", paddingRight: "35px", textAlign: "right"}}>
                  <button className="btn" style={{margin:"12px 0px 0px 12px", fontSize : '1.5em'}}
                          type="button"
                          onClick={this._addNote}
                  >
                      <i className="plus icon" style={{color: "white", padding: "3px 0 0 5px"}}></i>
                  </button>
              </Col>
                <Col xs={12} md={12} lg={12} style={{marginTop: "5px", paddingRight: "35px"}}>
                    {notes.entrySeq().map(this._mapNotesItems)}
                </Col>
            </Row>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultDataSelect,
        deleteNote,
        updateNote,
        addNote
    }, dispatch);
}

function mapStateToProps({notes, selectsReducer}) {
    return {
        notes,
        selectsReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesClient);
