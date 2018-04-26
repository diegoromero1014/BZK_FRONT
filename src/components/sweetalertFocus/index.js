import React from 'react'
import SweetAlert from 'sweetalert-react';

class SweetAlertFocus extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        let isShow = this.props.show;

        let button;

        if (isShow) {
            button = document.getElementsByClassName('confirm');

            if (button.length > 0) {
                
                setTimeout(function(){ button[0].focus(); }, 1);
                button[0].focus();
            }
        }

    }

    render() {
        return (
            <SweetAlert {...this.props} />
        )
        
        
    }
}

export default SweetAlertFocus;