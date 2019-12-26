import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';

const CardComponent = (props) => {
    return (
        <Card>
            <div className='card-header' style={{ position: 'relative', width: '100%', overflow: 'hidden', 'max-width': '100%', 'max-height': '250px' }}>
                <Image src='https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/7_avatar-512.png' wrapped ui={false} />
            </div>
            <Card.Content>
                <Card.Header>Matthew</Card.Header>

                <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                </Card.Meta>

                <Card.Description>
                    Matthew is a musician living in Nashville.
                </Card.Description>
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