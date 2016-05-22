import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ComboBox from './comboBox/comboBoxComponent';
import {reduxForm} from 'redux-form';
import {addNote} from '../components/notes/actions';
import NotesClient from '../components/notes/notesClient';

const validate = values => {
    const errors = {}
    if (!values.combo) {
        errors.combo = "Debe seleccionar un valor";
    }
    return errors
};


const propsComboBox = {
    nameInput: 'Pagina',
    labelInput: 'Página',
    data: [
        {
            id: 1,
            value: 't'
        },
        {
            id: 2,
            value: 'x'
        }
    ],
    textProp: 'value',
    valueProp: 'id'
};
class uiTester extends Component {
    constructor(props) {
        super(props);
        this._addNote = this._addNote.bind(this);
    }


    _addNote() {
        const {addNote} = this.props;
        addNote();
    }

    render() {
        const {fields: {combo, combo1}, handleSubmit} = this.props;
        /**
         setTimeout(function(){
            combo.onChange('');
        }, 5000);
         **/
        return (
            <form>
                <div style={{position: "absolute"}}>
                    <ComboBox {...propsComboBox} {...combo}/>
                    <ComboBox {...propsComboBox} {...combo1}/>
                    Hi there
                </div>
                <div className="ui icon button" data-content="La longitud máxima del campo es de 250 caracteres">
                  <i className="help icon"></i>
                </div>
                <NotesClient />
            </form>
        );
    }
}

function mapStateToProps({notes}) {
    return {
        notes
    }
}

export default reduxForm({
    form: 'test',
    fields: ["combo", "combo1"],
    validate
}, mapStateToProps, {addNote})(uiTester);
