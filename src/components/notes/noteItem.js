import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';
import {bindActionCreators} from 'redux';
import {deleteNote, updateNote} from './actions';
import {connect} from 'react-redux';
import _ from 'lodash';

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
        const {updateNote, index} = this.props;
        this.setState(_.set({}, prop, value));
        updateNote(index, prop, value);
    }

    _deleteNote() {
        const {index, deleteNote} = this.props;
        deleteNote(index);
    }

    _updateValue(e){
    }

    componentWillMount(){
      const {combo, body} = this.props;
      this.updateValue("combo", combo);
      this.updateValue("body", body);
    }

    render() {
        const {combo, body, data, index, _onBlurField} = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Tipo de nota(</span><span style={{color: "red"}}>*</span>)</dt>
                            <ComboBox
                                name={`typeNote${index}`}
                                value={this.state.combo}
                                defaultValue={this.state.combo}
                                onChange={val => this.updateValue('combo', val)}
                                onBlur={() => console.log.bind(console)}
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                                deployUp={true}
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
                                max="600"
                                onChange={this.updateValue.bind(this, 'body')}
                                onBlur={() => console.log}
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

export default connect(null, mapDispatchToProps)(NoteItem);
