// src/components/CarouselInfinite/AppCarouselInfinite.jsx
import React from 'react';
import './AppCarouselInfinite.css';

export function AppCarouselInfinite() {
  const imageUrls = [
    './img/foto_slide1.png',
    './img/foto_slide2.png',
    './img/foto_slide3.png',
    './img/foto_slide4.png',
    './img/foto_slide5.png',
    './img/foto_slide6.png',
    './img/foto_slide7.png',

  ];

  const loopedUrls = [...imageUrls, ...imageUrls];

  return (
    <div className="inf-carousel-wrapper">
      <div className="inf-slider">
        <div className="inf-logo-wrapper">
          <img
            className="inf-logo"
            src="./img/logo_mcm.png"
            alt="Logo Estático"
          />
        </div>
        <div className="inf-slide-track">
          {loopedUrls.map((url, idx) => (
            <div key={idx} className="inf-slide">
              <img
                className="inf-slide__img"
                src={url}
                alt={`Slide ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
