import React, {Component, PropTypes} from 'react';
import {VALUE_LIMIT_GREEN, VALUE_LIMIT_ORANGE, COLOR_GREEN, COLOR_ORANGE, COLOR_RED} from './constants';

const valor= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var raitingReceive = 0;
var colorFill;
class RaitingInternal extends Component {
  constructor(props) {
      super(props);
      this._mapSpanRaiting = this._mapSpanRaiting.bind(this);
  }

  _mapSpanRaiting(item, idx){
      if( item <= raitingReceive ){
        return <span className="risk-rating-level" style={{backgroundColor: colorFill}} key={idx+1}></span>
      } else {
        return <span className="risk-rating-level" key={idx+1}></span>
      }
  }

  render(){
    var {valueRaiting} = this.props;
    if( valueRaiting === null || valueRaiting === undefined ){
      raitingReceive = 0;
    } else {
      var isValidNan = valueRaiting.length === 1 ? parseInt(valueRaiting) : parseInt(valueRaiting.substring(1, valueRaiting.length));
      if( isValidNan === 'NaN' ){
        raitingReceive = -1;
      } else {
        raitingReceive = parseInt(valueRaiting.substring(1, valueRaiting.length));
        if( raitingReceive <= VALUE_LIMIT_GREEN ){
          colorFill = COLOR_GREEN;
        } else if( raitingReceive > VALUE_LIMIT_GREEN && raitingReceive <= VALUE_LIMIT_ORANGE){
          colorFill = COLOR_ORANGE;
        } else {
          colorFill = COLOR_RED;
        }
      }
    }
    return (
      <div className="risk-rating">
        <span className='risk-rating-title'>{valueRaiting}</span>
        {raitingReceive > 0 && valor.map(this._mapSpanRaiting)}
      </div>
    );
  }
}

RaitingInternal.PropTypes = {
  valueRaiting: PropTypes.string.isRequired
}

export default RaitingInternal;
