import React from 'react';
import { Icon } from 'semantic-ui-react';
import './../../../styles/message/main.scss';

const Message = ({ message, icon, style, show }) => {
    const defaultStyle = { padding: 20, marginBottom: 20, background: 'transparent', textAlign: 'justify', fontWeight: 600, fontSize: '11pt', borderBottom: '6px solid #2172d8', color: '#818181', width: '95%' };

    return (
        <div>
            {show &&
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '5%', justifySelf: 'center', alignSelf: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'centrer', padding: 20, marginBottom: 20, background: 'transparent', borderBottom: '6px solid rgb(33, 114, 216)' }}>
                        <Icon className='icon-message' disabled name={icon} />
                    </div>
                    
                    <div className='message' style={style ? style : defaultStyle }>
                        {message}
                    </div>
                </div>
            }
        </div>
    );
};

export default Message;