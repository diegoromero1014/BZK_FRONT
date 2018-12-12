class ReduxFormField {
    
    constructor(value) {
        this.value = value
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.value = value
    }

}

export function createFieldsFromArray(fields) {

    const reduxFormFields = [];

    for (let index = 0; index < fields.length; index++) {
        const element = fields[index];
        reduxFormFields[element] = new ReduxFormField('');
    }

    return reduxFormFields;


}

export default ReduxFormField;