import React from 'react'
import background from '../../../img/404.png';
import brand from '../../../img/pageUnderConstruction/biztract.svg';
import '../../../styles/stylePageNotFound/pageNotFound.scss';
import { Link } from 'react-router';


const pageNotFound = () => {
    return (
        <div className="page-not-found">
            <img src={background} alt="site under construction" />

            <p><Link to="/">Clic para ir al inicio</Link></p>

            <div className="brand">
                <img src={brand} alt="biztrack" />
            </div>
        </div>
    );
};

export default pageNotFound;