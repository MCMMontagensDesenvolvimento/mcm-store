// src/components/Navbar/AppNavbar.jsx
import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useCarrinho } from '../../Context/ContextoCarrinho';
import { useAuth } from '../../Context/AuthContext';

export function AppNavbar() {
  const { qtdCarrinho } = useCarrinho();
  const { usuario, logout } = useAuth();
  const nomeContratado = usuario?.CON_DssNome || '';

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #FE5A17;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
          left: 0;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary fixed-top">
        <div className="container-fluid">
          {/* Logo que ancora em "#top" */}
          <Link className="navbar-brand" to="/#top">
            <img
              src="/img/logo_mcm.png"
              alt="Logo MCM"
              width="130"
              height="30"
              className="d-inline-block align-text-top"
            />
          </Link>

          {/* Botão de colapsar (hamburger) para mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Alternar navegação"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* ===== Collapse: links principais + greeting + carrinho + logout ===== */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* 1) Links centrais (Home, Fardamentos, Acessórios) */}
            <ul className="navbar-nav mx-auto 
                              d-flex flex-column flex-lg-row 
                              justify-content-center gap-3 gap-lg-5">
              <li className="nav-item">
                <Link className="nav-link" smooth to="/#top">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" smooth to="/#fardamentos">
                  Fardamentos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" smooth to="/#acessorios">
                  Acessórios
                </Link>
              </li>
            </ul>

            {/* 2) Versão desktop: greeting, carrinho e logout (aparecem só em lg+) */}
            {usuario && (
              <span
                className="me-3 d-none d-lg-inline-block"
                style={{ fontWeight: 600, color: '#333' }}
              >
                Olá, {nomeContratado}
              </span>
            )}
            <Link
              to="/carrinho"
              className="btn rounded-pill d-none d-lg-block"
              style={{
                backgroundColor: '#FE5A17',
                color: '#fff',
                position: 'relative',
              }}
            >
              Carrinho
              {qtdCarrinho > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '0.75rem',
                  }}
                >
                  {qtdCarrinho}
                </span>
              )}
            </Link>
            {usuario && (
              <button
                onClick={logout}
                className="btn btn-outline-secondary ms-3 d-none d-lg-inline-block"
                style={{ borderRadius: '20px', fontWeight: '600' }}
              >
                Logout
              </button>
            )}

            {/* 3) Versão mobile (dentro do próprio collapse): 
                  greeting, carrinho e logout mostrados apenas em telas < lg */}
            {usuario && (
              <li className="nav-item d-lg-none mt-3">
                <span
                  className="nav-link"
                  style={{ fontWeight: 600, color: '#333' }}
                >
                  Olá, {nomeContratado}
                </span>
              </li>
            )}
            <li className="nav-item d-lg-none mt-2">
              <Link
                to="/carrinho"
                className="nav-link btn rounded-pill text-center"
                style={{
                  backgroundColor: '#FE5A17',
                  color: '#fff',
                  position: 'relative',
                }}
              >
                Carrinho
                {qtdCarrinho > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-10px',
                      backgroundColor: '#000',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '0.75rem',
                    }}
                  >
                    {qtdCarrinho}
                  </span>
                )}
              </Link>
            </li>
            {usuario && (
              <li className="nav-item d-lg-none mt-2">
                <button
                  onClick={logout}
                  className="nav-link btn btn-outline-secondary text-center"
                  style={{ borderRadius: '20px', fontWeight: '600' }}
                >
                  Logout
                </button>
              </li>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
