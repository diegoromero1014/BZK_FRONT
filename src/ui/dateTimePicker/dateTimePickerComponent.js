import React, {Component} from 'react';
import {DateTimePicker} from 'react-widgets';
import moment from 'moment';
const momentLocalizer = require('react-widgets/lib/localizers/moment');
import _ from 'lodash';

momentLocalizer(moment);

class dateTimePickerComponent extends Component {
  constructor(props){
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onChange(date, strDate){
    const {onChange, format} = this.props;
    onChange(moment(strDate, format));
  }

  render(){
    const {touched, error, value} = this.props;
    return (
      <div>
        <DateTimePicker {...this.props} onChange={this._onChange} value={!_.identity(value) ? null: moment(value).toDate()} />
        {
          touched && error &&
          <div>
              <div className="ui pointing red basic label">
                  {error}
              </div>
          </div>
        }
      </div>
    );
  }
}

export default dateTimePickerComponent;
