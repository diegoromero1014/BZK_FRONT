import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteNote, updateNote, addNote} from './actions';
import {getMasterDataFields} from '../selectsComponent/actions';
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
        updateNote(index, "body", e);
    }

    _updateValueList(index, value) {
        const {updateNote} = this.props;
        updateNote(index, "combo", value);
    }

    componentWillMount() {
        const {getMasterDataFields} = this.props;
        getMasterDataFields([TYPE_NOTES]);
    }

    _addNote() {
        const {addNote} = this.props;
        const uuid = _.uniqueId('note_');
        addNote(uuid);
    }

    _mapNotesItems(note) {
        const {selectsReducer} = this.props;
        return <Note
            index={note.uid}
            key={note.uid}
            body={note.body}
            combo={note.combo}
            data={selectsReducer.get(TYPE_NOTES)}
        />
    }

    render() {
        const {notes, error} = this.props;
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
                  {error &&
                    <div>
                      <div className="ui pointing below red basic label">
                        Debe ingresar todos los campos
                      </div>
                    </div>
                  }
                  <div style={error ? {paddingBottom:"20px", border:"1px solid red", borderRadius:"5px"} : {}}>
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
