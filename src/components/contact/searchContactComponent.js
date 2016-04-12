import React, {Component} from 'react';

class SearchContactComponent extends Component {
    render() {
        return (
          <div className="search-note-contact col-md-12"><i className="icon-search-sm"></i>
            <input type="text" />
          </div>
          /*<div className="search-note-contact col-md-12">
            <div className="InputAddOn">
                <button type="button" className="InputAddOn-item">
                <span className="icon icon-search"></span>
                </button>
                <input type="text" className="InputAddOn-field" placeholder="Búsqueda por número, nombre, función, cargo">
            </div>
          </div>*/
        );
    }
}

export default SearchContactComponent;
