import React, {Component} from 'react';

class SearchContactComponent extends Component {
    render() {
        return (
          <div className="InputAddOn">
            <button className="InputAddOn-item">
              <span className="icon icon-search">
              </span>
            </button>
              <input type="text" className="InputAddOn-field" placeholder="Búsqueda por número, nombre, función, cargo" />
          </div>
        );
    }
}

export default SearchContactComponent;
