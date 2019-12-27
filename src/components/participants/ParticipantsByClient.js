import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import '../../../styles/participants/participantsByClient.scss';

class ParticipantsByClient extends Component {
    render() {
        return (
             <div className='participants-client'>
                <Icon name='add square' size='huge' className='icon-add' />
             </div>   
        );
    }
}

export default ParticipantsByClient;