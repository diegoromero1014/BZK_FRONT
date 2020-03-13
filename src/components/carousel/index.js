import React, { Component } from "react";
import Slider from "react-slick";
import NextArrow from "./nextArrow";
import PrevArrow from "./prevArrow";
import Slide from "./slide";
import "slick-carousel/slick/slick.scss"; 
import "slick-carousel/slick/slick-theme.scss";

class Carousel extends Component {

    buildSliders = data => data.map((slide, index) => <Slide key={index} {...slide} />)

    render() {
        const { dots, infinite, data = [], slidesToShow } = this.props;

        const settings = {
            dots,
            infinite,
            slidesToShow,
            slidesToScroll: slidesToShow,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };


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