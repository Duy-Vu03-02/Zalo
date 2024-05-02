import React from "react";
import Slider from "react-slick";
import banner1 from "../../resource/img/Banner/banner1.png";
import banner2 from "../../resource/img/Banner/banner2.png";
import banner3 from "../../resource/img/Banner/banner3.png";
import banner4 from "../../resource/img/Banner/banner4.png";
import banner5 from "../../resource/img/Banner/banner5.png";
import banner6 from "../../resource/img/Banner/banner6.png";
import banner7 from "../../resource/img/Banner/banner7.png";

export default function WellCome() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
      <div>
        <h3>5</h3>
      </div>
      <div>
        <h3>6</h3>
      </div>
    </Slider>
  );
}
