import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from 'config.js';
import ProductsList from './ProductsList/ProductsList';
import {
  MdFormatColorReset,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import './Main.scss';

const SLIDE_BASE_WIDTH_PERCENT = 100;

function Main() {
  const [carousel, setCarousel] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const imgRef = useRef(null);

  useEffect(() => {
    fetch('data/carousel_data.json')
      .then(res => res.json())
      .then(data => setCarousel(data.carouselImages));
  }, []);

  useEffect(() => {
    fetch(api.main)
      .then(res => res.json())
      .then(result => {
        setProductsList(result.result);
      });
  }, []);

  useEffect(() => {
    imgRef.current.style.transform = `translateX(-${
      currentImg * SLIDE_BASE_WIDTH_PERCENT
    }%)`;
  }, [currentImg]);

  useEffect(() => {
    const getNextImgByTimer = () => getNextImg();
    const timer = setTimeout(getNextImgByTimer, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentImg]);

  const navigate = useNavigate();

  const goToDetailPage = link => {
    navigate(`${link}`);
  };

  const getPreImg = () => {
    if (currentImg === 0) return;
    setCurrentImg(currentImg => currentImg - 1);
  };

  const getNextImg = () => {
    if (currentImg === 3) return;
    setCurrentImg(currentImg => currentImg + 1);
  };

  return (
    <main className="main">
      <div className="carouselWrapper">
        <div className="carousel" ref={imgRef}>
          {carousel.map(carousel => (
            <img
              key={carousel.id}
              src={carousel.image_url}
              alt={carousel.id}
              onClick={() => goToDetailPage(carousel.link_to)}
            />
          ))}
        </div>
        <div className="arrowWrapper">
          <MdKeyboardArrowLeft
            className="arrow"
            size="40"
            type="button"
            onClick={getPreImg}
          />
          <MdKeyboardArrowRight
            className="arrow"
            size="40"
            type="button"
            onClick={getNextImg}
          />
        </div>
      </div>
      <div>log</div>
      <div className="productsListWrapper">
        {productsList.map((productsLists, idx) => (
          <ProductsList key={idx} productsLists={productsLists} />
        ))}
      </div>
    </main>
  );
}

export default Main;
