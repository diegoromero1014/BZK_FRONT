import React, { Component } from "react";
import Slider from "react-slick";
import NextArrow from "./nextArrow";
import PrevArrow from "./prevArrow";
import Slide from "./slide";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import { isInternetExplorer } from '../../utils/browserValidation';

class Carousel extends Component {

    buildSliders = data => data.map((slide, index) => <Slide key={index} {...slide} />)

    render() {
        const { dots, infinite, data = [], slidesToShow } = this.props;

        let settings = {
            dots,
            infinite,
            slidesToShow,
            slidesToScroll: slidesToShow,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        }

        if (isInternetExplorer()) {
            delete settings.nextArrow;
            delete settings.prevArrow;
        }

        return (
            <div style={{ marginLeft: 50, marginRight: 50 }}>
                <Slider {...settings}>
                    {this.buildSliders(data)}
                </Slider>
            </div>
        );
    }
}

export default Carousel;