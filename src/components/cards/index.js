import React from 'react';
import { Card } from 'semantic-ui-react';
import '../../../styles/cards/main.scss';

const CardComponent = ({header, content, footer, handleOnClick, style}) => {
    
    return (
        <Card className={'card-container'} onClick={handleOnClick} style={style} >
            <div className='card-header' style={{ position: 'relative', width: '100%', overflow: 'hidden', maxWidth: '100%', maxHeight: '250px', display: 'flex', justifyContent: 'center' }}>
                {header}
            </div>
            <Card.Content>
                {content}
            </Card.Content>
                
            <Card.Content extra style={{ zIndex: 100 }}>
                {footer}
            </Card.Content>
        </Card>
    );
};

export default CardComponent;