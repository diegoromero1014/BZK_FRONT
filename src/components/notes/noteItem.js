import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {deleteNote, updateNote} from '../notes/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';

class NoteItem extends Component{
  constructor( props ) {
    super(props);
    this.state = {
      combo: "",
      body: ""
    }
     this._deleteNote = this._deleteNote.bind(this);
     this._updateValue = this._updateValue.bind(this);
     this._updateValueList = this._updateValueList.bind(this);
     this._onBlurField = this._onBlurField.bind(this);
  }

  _deleteNote(e){
    e.preventDefault();
    const {idx, deleteNote} = this.props;
    deleteNote(idx);
  }

  _updateValue(e){
    const {idx, updateNote} = this.props;
    this.setState({
      body: e.target.value
    })
    updateNote(idx, "body", e.target.value);
  }

  _updateValueList(value){
    const {idx, updateNote} = this.props;
    this.setState({
      combo: value
    })
    updateNote(idx, "combo", value);
  }

  _onBlurField(){

  }

  render(){
    const {idx, combo, body, defaultCombo, defaultBody, data} = this.props;
    console.log("defaultCombo", defaultCombo);
    console.log("defaultBody", defaultBody);
    return(
      <div>
        <Row>
          <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Tipo de nota(</span><span style={{color: "red"}}>*</span>)</dt>
              <ComboBox
                name={`typeNote${idx}`}
                labelInput="Seleccione el tipo de nota"
                value={this.state.combo}
                onChange={val => this._updateValueList(val)}
                onBlur={this._onBlurField}
                valueProp={'id'}
                textProp={'value'}
                data={data}
                defaultValue={defaultCombo}
              />
            </div>
          </Col>
          <Col xs={10} md={8} lg={8} style={{marginTop: "15px"}}>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
              <dt><span>Descripción de la nota(</span><span style={{color: "red"}}>*</span>)</dt>
              <Input
                type="text"
                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
                value={this.state.body}
                onChange={this._updateValue}
                onBlur={this._onBlurField}
                defaultValue={this.state.body === "" ? defaultBody : this.state.body}
              />
            </div>
          </Col>
          <Col xs={1} md={1} lg={1} style={{marginTop: "37px"}}>
            <button onClick={this._deleteNote}
              className="btn btn-sm  btn-danger"
              type="button">
                <i style={{margin:'0em', fontSize : '1.2em'}} className="trash outline icon"></i>
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
    updateNote
  }, dispatch);
}

function mapStateToProps({notes},{index}) {
  return {
    body: notes.get(index).body,
    combo: notes.get(index).combo,
    idx: index
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteItem);
