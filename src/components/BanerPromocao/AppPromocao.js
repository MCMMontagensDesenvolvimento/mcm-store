import React from 'react';
import { Link } from 'react-router-dom';
import './AppPromocao.css';

export function AppPromocao() {
  return (
    <div className="promo-social-container">
      <div className="promo-social-image-wrapper">
        <img
          className="promo-social-image"
          src="./img/foto_promocao.png"
          alt="Camisa Social em promoção"
        />
      </div>

      <div className="promo-social-content">
        <div className="promo-social-label">PROMOÇÃO</div>
        <h2 className="promo-social-title">
          Camisa Social<br />60% OFF
        </h2>

        {/* Agrupamos os botões num contêiner flex */}
        <div className="button-group">
          {/* Botão “Masculino” aponta para o produto de id=5 */}
          <Link to="/produto/5" className="promo-social-link">
            <button className="promo-social-button">Masculino</button>
          </Link>

          {/* Botão “Feminino” aponta para o produto de id=6 */}
          <Link to="/produto/6" className="promo-social-link">
            <button className="promo-social-button">Feminino</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
