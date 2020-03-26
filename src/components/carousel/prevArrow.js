import React from 'react';
import { Icon } from 'semantic-ui-react';

const PrevArrow = ({ onClick }) => {
    const styles = {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        left: '-45px',
        width: 40,
        position: 'absolute',
        fontSize: '5px',
        cursor: 'pointer',
        color: 'darkgrey'
    }

    return (
        <div
            style={styles}
            onClick={onClick}
        >
            <Icon name='chevron left' size='massive' />
        </div>
    );
};

export default PrevArrow;