import React, {Component} from 'react';
import ImageLogoApp from '../globalComponents/LogoApplication';


//<div className="footer-right">
  //<div className="footer-right-item">Condiciones</div>
  //Privacidad
//</div>

const style = {
  width: "50px"
}
class Footer extends Component{
  render(){
    return(
      <footer className="welcome-footer">
					<div className="footer-left">
						<ImageLogoApp style={style}/>
						<div className="copywrite">Copyright © 2016 Grupo Bancolombia <br /> Todos los derechos reservados</div>
					</div>
			</footer>
    );
  }
}

export default Footer;
