import React, {Component} from 'react';
import {Row, Col} from 'react-flexbox-grid';
import ComboBox from './comboBox/comboBoxComponent';
import Input from './input/inputComponent';
import {reduxForm} from 'redux-form';

const validate = values => {
    const errors = {}
    if (!values.combo) {
        errors.combo = "Debe seleccionar un valor";
    }
    if (values.input === '') {
        errors.input = "Debe ingresar un valor";
    }
    return errors
};

const propsInput = {
    nameInput: 'Pagina',
    labelInput: 'Página'
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
    render() {
        const {fields: {combo, combo1, input}, handleSubmit} = this.props;

         setTimeout(function(){
            combo.onChange('');
            input.onChange('');
        }, 5000);

        return (
            <form>
                <div style={{position: "absolute"}}>
                    <ComboBox {...propsComboBox} {...combo}/>
                    <ComboBox {...propsComboBox} {...combo1}/>
                    <Input {...propsInput} {...input}/>
                    Hi there
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'test',
    fields: ["combo", "combo1", "input"],
    validate
})(uiTester);
