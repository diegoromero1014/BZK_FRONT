import React from 'react';
import Tooltip from './components/toolTip/toolTipComponent';

export const renderLabel = ({ name, message, nullable }) => (
    <div style={{ display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between' }}>
       <strong style={{ marginBottom: 10 }}>
          <span>{`${name}  ${!nullable ? '(' : ''} `} </span>
          {!nullable && <span style={{ color: 'red' }}>*</span>}
          {!nullable && ' )'}
       </strong>

       {message !== null &&
          <Tooltip text={message}>
             <i className="help circle icon blue" style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
          </Tooltip>
       }
    </div>
);

export const renderMessageError = err => (
    <div>
       <div className="ui pointing red basic label"> {err} </div>
    </div>
);