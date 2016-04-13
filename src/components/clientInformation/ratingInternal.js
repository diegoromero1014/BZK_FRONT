import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
const valor= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var raitingReceive = 0;
class RaitingInternal extends Component {
  constructor(props) {
      super(props);
      this._mapSpanRaiting = this._mapSpanRaiting.bind(this);
  }

  _mapSpanRaiting(item, idx){
      if( item <= raitingReceive ){
        return <span className="risk-rating-level risk-rating-active"></span>
      } else {
        return <span className="risk-rating-level"></span>
      }
  }

  render(){
    var {valueRaiting} = this.props;
    if( valueRaiting === null || valueRaiting === undefined ){
      valueRaiting = 0;
      raitingReceive = 0;
    } else {
      valueRaiting = parseInt(valueRaiting.substring(1, valueRaiting.length));
      raitingReceive = valueRaiting;
    }
    return (
      <div className="risk-rating">
        <span className='risk-rating-title'>R{valueRaiting}</span>
        {valor.map(this._mapSpanRaiting)}
      </div>
    );
  }
}

RaitingInternal.PropTypes = {
  valueRaiting: PropTypes.string.isRequired
}

export default RaitingInternal;
