import React from 'react';
import { Icon } from 'semantic-ui-react';
import './../../../styles/message/main.scss';

const Message = ({ message, icon, style, show }) => {
    const defaultStyle = { padding: '20px 0 20px 0', background: 'transparent', textAlign: 'justify', fontWeight: 600, fontSize: '11pt', color: '#818181', width: '95%'};

    return (
        <div>
            {show &&
                <div style={{borderBottom: '5px solid #2172d8'}}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '3%', justifySelf: 'center', alignSelf: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'centrer', padding: '15px', background: 'transparent', marginLeft: 15 }}>
                            <Icon className='icon-message' disabled name={icon} style={{fontSize: '15pt'}}/>
                        </div>

                        <div className='message' style={style ? style : defaultStyle}>
                            {message}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Message;