import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Col} from 'react-flexbox-grid';
import {deleteNote, updateNote} from '../notes/actions';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Input from '../../ui/input/inputComponent';

class NoteItem extends Component {
    constructor(props) {
        super(props);
    }

    _updateValue(e){
      console.log("update", e);
    }

    render() {
        const {
            combo,
            body,
            data,
            index,
            _updateValue,
            _updateValueList,
            _onBlurField,
            _deleteNote,
        } = this.props;
        return (
            <div>
                <Row>
                    <Col xs={12} md={3} lg={3} style={{marginTop: "15px"}}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Tipo de nota(</span><span style={{color: "red"}}>*</span>)</dt>
                            <ComboBox
                                name={`typeNote${index}`}
                                labelInput="Seleccione el tipo de nota"
                                value={combo}
                                onChange={val => _updateValueList(val)}
                                onBlur={_onBlurField}
                                valueProp={'id'}
                                textProp={'value'}
                                data={data}
                            />
                        </div>
                    </Col>
                    <Col xs={10} md={8} lg={8} style={{marginTop: "15px"}}>
                        <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                            <dt><span>Descripción de la nota(</span><span style={{color: "red"}}>*</span>)</dt>
                            <Input
                                type="text"
                                style={{height: "22px !important", minHeight: "26px !important", width: "100%"}}
                                value={body}
                                onChange={this._updateValue}
                                onBlur={_onBlurField}
                            />
                        </div>
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{marginTop: "37px"}}>
                        <button onClick={_deleteNote}
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

export default NoteItem;
