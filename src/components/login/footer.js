import React, {Component} from 'react';
import ImageLogoApp from '../globalComponents/logoApplication';
import { VERSION_DATE } from '../../constantsGlobal';

export class Footer extends Component {

    render() {
        return (
            <footer className="welcome-footer">
                <div className="footer-left">
                    <ImageLogoApp style={{ width: "50px", float: 'left', marginTop: '5px', marginRight: '10px'}}/>
                    <div className="copywrite" style={{display: '-webkit-inline-box'}}>Copyright © 2016 Grupo
                        Bancolombia <br /> Todos los derechos reservados
                        <br/>
                        <br/>Fecha versión: {VERSION_DATE}
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
