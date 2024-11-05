import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dog1 from './images/dog1.jpg';
import dog2 from './images/dog2.jpg';
import dog3 from './images/dog3.jpg';

function ImageSlider() {
    const imageWidth = '1200px';    
    const imageHeight = '500px'; 

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    const sliderStyle = {
        margin: '20px auto',
        position: 'relative',
        width: imageWidth
    };

    const slideStyle = {
        position: 'relative'
    };

    const imageStyle = {
        width: imageWidth,    
        height: imageHeight,  
        margin: 'auto',
        display: 'block',     
        objectFit: 'contain'  // 'cover'에서 'contain'으로 변경
    };

    return (
        <div style={sliderStyle}>
            <Slider {...settings}>
                <div style={slideStyle}>
                    <img src={dog1} alt="Slide 1" style={imageStyle} />
                </div>
                <div style={slideStyle}>
                    <img src={dog2} alt="Slide 2" style={imageStyle} />
                </div>
                <div style={slideStyle}>
                    <img src={dog3} alt="Slide 3" style={imageStyle} />
                </div>
            </Slider>
        </div>
    );
}

export default ImageSlider;