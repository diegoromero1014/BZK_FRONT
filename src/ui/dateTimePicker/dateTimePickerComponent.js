import React, { Component } from 'react';
import { DateTimePicker } from 'react-widgets';
import moment from 'moment';
const momentLocalizer = require('react-widgets/lib/localizers/moment');
import _ from 'lodash';

momentLocalizer(moment);

class dateTimePickerComponent extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(date, strDate) {
    const { onChange, format } = this.props;
    onChange(strDate.trim());
  }

  
  render() {
    const { touched, error, value, time, format } = this.props;
    return (
      <div>
        {time ?
          <DateTimePicker {...this.props} />
          :
          <DateTimePicker {...this.props}  onChange={this._onChange} value={!_.identity(value) ? null : moment(value, _.isNil(format) ? 'DD/MM/YYYY' : format).toDate()} />
        }
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
