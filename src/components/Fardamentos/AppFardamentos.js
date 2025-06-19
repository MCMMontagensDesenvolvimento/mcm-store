// src/components/Fardamentos/AppFardamentos.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { produtos } from '../../data/produtos'; // observe: ../../data/produtos

export function AppFardamentos() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtra somente fardamentos
  const fardamentos = produtos.filter((p) => p.categoria === 'Fardamentos');

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    body {
      background: linear-gradient(135deg, #FC5B17 0%, #FFFFFF 100%);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      font-family: 'Montserrat', sans-serif;
    }

    .cards {
      width: 100%;
      display: flex;
      ${isMobile ? 'flex-direction: column;' : 'flex-wrap: wrap;'}
      justify-content: flex-start;
      align-items: flex-start;
      max-width: 1300px;
      margin: 3rem auto 0;
      gap: 24px;
      padding: 2rem 0;
    }

    .card {
      position: relative;
      background-color: #fff;
      width: ${isMobile ? '90%' : 'calc(33.333% - 24px)'};
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0px 13px 10px -7px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      min-height: 360px;
    }

    .card--active {
      box-shadow: 0px 30px 18px -8px rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }

    .card:hover,
    .card--active {
      box-shadow: 0px 30px 18px -8px rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }

    .card:hover .card__img,
    .card:hover .card__info,
    .card--active .card__img,
    .card--active .card__info {
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .card__img {
      width: 100%;
      height: 370px;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }

    .card__info {
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-grow: 1;
      transition: opacity 0.3s ease;
    }

    .card__category {
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 2px;
      font-weight: 500;
      color: #868686;
    }

    .card__title {
      font-size: 18px;
      color: #333;
      margin: 0;
    }

    .card__price {
      font-size: 16px;
      font-weight: 700;
      color: #FE5A17;
    }

    .card__detail-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #FE5B17;
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 12px 24px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
      z-index: 2;
      text-decoration: none; /* Remove sublinhado do Link */
    }

    .card:hover .card__detail-btn,
    .card--active .card__detail-btn {
      opacity: 1;
    }
  `;

  const handleCardClick = (id) => {
    if (isMobile) {
      setActiveCardId(activeCardId === id ? null : id);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <h2
        id="fardamentos"
        style={{
          textAlign: 'left',
          margin: '6rem 0 0 8rem',
          color: 'black',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '2rem',
          fontWeight: '700',
        }}
      >
        Fardamentos
      </h2>

      <section className="cards">
        {fardamentos.map((item) => {
          const isActive = isMobile && activeCardId === Number(item.id);
          return (
            <article
              key={item.id}
              className={`card${isActive ? ' card--active' : ''}`}
              onClick={() => handleCardClick(Number(item.id))}
            >
              <img
                className="card__img"
                src={item.imagens[0]}
                alt={item.titulo}
              />
              <div className="card__info">
                <span className="card__category">Fardamentos</span>
                <h3 className="card__title">{item.titulo}</h3>
                <span className="card__price">R$ {item.preco}</span>
              </div>

              <Link
                to={`/produto/${item.id}`}
                className="card__detail-btn"
              >
                DETALHE DO PRODUTO
              </Link>
            </article>
          );
        })}
      </section>
    </>
  );
}
