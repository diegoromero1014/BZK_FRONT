class ReduxFormField {
    
    constructor(value) {
        this.value = value
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        this.value = value
    }

}

export default ReduxFormField;