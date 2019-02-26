import React, { Component } from 'react'
import background from '../../../img/pageUnderConstruction/site-under-construction-blue.png';
import brand from '../../../img/pageUnderConstruction/biztract.svg';
import '../../../styles/stylePageUnderConstruction/main.scss';

class pageUnderConstruction extends Component {

    render() {
        return (
            <div className="page-under-construction">
                <img src={background} alt="site under construction" />

                <div className="brand">
                    <img src={brand} alt="biztrack" />
                </div>
            </div>
        )
    }
}

export default pageUnderConstruction;