// src/components/Hero/AppHero.jsx
import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

export function AppCarousel() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const maxHeight = windowWidth <= 768 ? '60vh' : '80vh';

  // A img ocupa toda a largura + um pouquinho para “escapar” da scrollbar
  const imgStyle = {
    display: 'block',
    width: '103vw',
    height: 'auto',
    maxHeight,
    objectFit: 'cover',
  };

  // Este wrapper força o Carousel a estender 100vw, independentemente do container
  const wrapperStyle = {
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    marginTop: -21,     /* nada empurra para baixo */
    padding: 0,       /* remove todo padding */
  };

  return (
    <div style={wrapperStyle}>
      <Carousel>
        <Carousel.Item>
          <img
            style={imgStyle}
            src="/img/hero_section.png"
            alt="Hero 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={imgStyle}
            src="/img/hero_section2.png"
            alt="Hero 2"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
