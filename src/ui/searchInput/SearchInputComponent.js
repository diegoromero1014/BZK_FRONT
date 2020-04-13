import React, {Component} from 'react';
import {Subject} from "rxjs";
import {Input} from "semantic-ui-react";

export class SearchInputComponent extends Component {

    constructor(props) {
        super(props);
        this.onSearch$ = new Subject();
        this.onSearch = this.onSearch.bind(this);
    };


    componentDidMount() {
        const {onChangeSearch} = this.props;
        this.subscription = this.onSearch$
            .debounceTime(500)
            .subscribe(text => onChangeSearch(text));
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onSearch(e) {
        const search = e.target.value.trim();
        if (search.length >= 3 || search.length === 0) {
          this.onSearch$.next(search);
        }
    }

    render() {
        return (
            <div>
                <Input
                    loading
                    placeholder='Buscar por Responsable, Palabras clave de la tarea, Palabras clave de la observación'
                    onChange={this.onSearch}
                    fluid
                    maxLength="100"
                />
            </div>
        );
    }
}


export default SearchInputComponent;

