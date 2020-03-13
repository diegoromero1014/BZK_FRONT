import React from 'react';
import { Icon } from 'semantic-ui-react';

const NextArrow = ({ onClick }) => {

    const styles = {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        right: '-45px',
        top: '50%',
        position: 'absolute',
        content: '→',
        width: 40,
        transform: 'translate(0,-50%)',
        fontSize: '5px',
        cursor: 'pointer',
        color: 'darkgrey'
    }
    return (
        <div
            style={styles}
            onClick={onClick}
        >
            <Icon name='chevron right' size='massive' />
        </div>
    );
};

export default NextArrow;