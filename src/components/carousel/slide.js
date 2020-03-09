import React from 'react';
import '../../../styles/slide/main.scss';

const Slide = (props) => {
    return (
        <div {...props} className={'slide'} style={{ width: '100%' }}>
            <props.component {...props.componentProps} />
        </div>
    );
};

export default Slide;