import React from 'react';
import { Card } from 'semantic-ui-react';
import '../../../styles/cards/main.scss';

const CardComponent = ({header, content, footer, handleOnClick, style}) => {
    
    return (
        <div className={'container-element-card'}>
            <Card className={'card-container'} style={style} onClick={handleOnClick}>
                <div className='card-header' style={{ position: 'relative', width: '100%', overflow: 'hidden', maxWidth: '100%', maxHeight: '250px', display: 'flex', justifyContent: 'center' }}>
                    {header}
                </div>
                <Card.Content>
                    {content}
                </Card.Content>
                    
            </Card>
            <Card.Content extra style={{ zIndex: 100, paddingLeft: 10, paddingBottom: 7 }}>
                {footer}
            </Card.Content>
        </div>
    );
};

export default CardComponent;