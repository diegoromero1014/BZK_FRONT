import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {consultDataSelect} from '../selectsComponent/actions';
import {CLIENT_ID_TYPE, TYPE_NOTES} from '../selectsComponent/constants';
import Note from './noteItem';

class NotesClient extends Component{
  constructor( props ) {
    super(props);
    this.state = {
       data: []
     };
     this._mapNotesItems = this._mapNotesItems.bind(this);
  }

  componentWillMount(){
    const {consultDataSelect} = this.props;
    consultDataSelect(TYPE_NOTES);
  }

  _mapNotesItems(item, idx) {
    const {selectsReducer} = this.props;
    console.log("Valor", item, idx);
    return <Note
        index={idx}
        defaultCombo={item.combo}
        defaultBody={item.body}
        data={selectsReducer.get("dataTypeNotes")}
      />
  }

  render(){
    const {notes} = this.props;
    console.log("notes", notes);
    return(
      <div>
        {notes.map(this._mapNotesItems)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    consultDataSelect
  }, dispatch);
}

function mapStateToProps({notes, selectsReducer},ownerProps) {
  return {
    notes,
    selectsReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotesClient);
