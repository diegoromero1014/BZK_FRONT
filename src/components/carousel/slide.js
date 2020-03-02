import React from 'react';
import '../../../styles/slide/main.scss';

const Slide = (props) => {
    return (
        <div {...props} className={'slide'} style={{ width: '98%', height: '20vh' }}>
            {props.component}
        </div>
    );
};

export default Slide;