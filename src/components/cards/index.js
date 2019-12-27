import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';
import '../../../styles/cards/main.scss';

const CardComponent = ({header, content, footer}) => {
    
    return (
        <Card className={'card-container'}>
            <div className='card-header' style={{ position: 'relative', width: '100%', overflow: 'hidden', maxWidth: '100%', maxHeight: '250px', display: 'flex', justifyContent: 'center' }}>
                {header}
            </div>
            <Card.Content>
                {content}
            </Card.Content>
                
            <Card.Content extra>
                <a>
                    <Icon name='user' />
                    22 Friends
                </a>
            </Card.Content>
        </Card>
    );
};

export default CardComponent;