import React, {Component} from 'react';


class SearchShareholderComponent extends Component {
  constructor(props) {
      super(props);
  }

    render() {
        return (
          <div className="InputAddOn">
          <input style={{padding: '0px 11px !important'}} id="searchExpression" type="text" className="input InputAddOn-field"/>
            <button className="button InputAddOn-item">
              <i className="search icon" />
            </button>
          </div>
        );
    }
}


export default SearchShareholderComponent;
