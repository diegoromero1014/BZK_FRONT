import React, {Component} from 'react';
import ImageLogoApp from '../globalComponents/LogoApplication';

class Footer extends Component{
  render(){
    return(
      <footer className="welcome-footer">
					<div className="footer-left">
						<ImageLogoApp />
						<div className="copywrite">Copyright © 2016 Grupo Bancolombia <br /> Todos los derechos reservados</div>
					</div>

					<div className="footer-right">
						<div className="footer-right-item">Condiciones</div>
						Privacidad
					</div>
				</footer>
    );
  }
}

export default Footer;
