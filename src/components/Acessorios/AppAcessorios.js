// src/components/Acessorios/AppAcessorios.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { produtos } from '../../data/produtos'; // observe: ../../data/produtos

export function AppAcessorios() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtra somente acessórios
  const acessorios = produtos.filter((p) => p.categoria === 'Acessorios');

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
    body {
      background: linear-gradient(135deg, #FC5B17 0%, #FFFFFF 100%);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      font-family: 'Montserrat', sans-serif;
    }
    .acessorios-cards {
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
    .acessorios-card {
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
    .acessorios-card:hover {
      box-shadow: 0px 30px 18px -8px rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }
    .acessorios-card:hover .acessorios-card__img,
    .acessorios-card:hover .acessorios-card__info {
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }
    .acessorios-card__img {
      width: 100%;
      height: 370px;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }
    .acessorios-card__info {
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-grow: 1;
      transition: opacity 0.3s ease;
    }
    .acessorios-card__category {
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 2px;
      font-weight: 500;
      color: #868686;
    }
    .acessorios-card__title {
      font-size: 18px;
      color: #333;
      margin: 0;
    }
    .acessorios-card__price {
      font-size: 16px;
      font-weight: 700;
      color: #FE5A17;
    }
    .acessorios-card__detail-btn {
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
      text-decoration: none;
    }
    .acessorios-card:hover .acessorios-card__detail-btn {
      opacity: 1;
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <h2
        id="acessorios"
        style={{
          textAlign: 'left',
          margin: '6rem 0 0 8rem',
          color: 'black',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '2rem',
          fontWeight: '700',
        }}
      >
        Acessórios
      </h2>

      <section className="acessorios-cards">
        {acessorios.map((item) => (
          <article key={item.id} className="acessorios-card">
            <img
              className="acessorios-card__img"
              src={item.imagens[0]}
              alt={item.titulo}
            />
            <div className="acessorios-card__info">
              <span className="acessorios-card__category">Acessórios</span>
              <h3 className="acessorios-card__title">{item.titulo}</h3>
              <span className="acessorios-card__price">R$ {item.preco}</span>
            </div>
            <Link
              to={`/produto/${item.id}`}
              className="acessorios-card__detail-btn"
            >
              DETALHE DO PRODUTO
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
