// src/App.js
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './Context/AuthContext';
import { ProvedorCarrinho } from './Context/ContextoCarrinho';

import { AppNavbar } from './components/Navbar/AppNavbar';
import { AppCarousel } from './components/Hero/AppHero';
import { AppFardamentos } from './components/Fardamentos/AppFardamentos';
import { AppAcessorios } from './components/Acessorios/AppAcessorios';
import { AppPromocao } from './components/BanerPromocao/AppPromocao';
import { AppCarouselInfinite } from './components/CarrouselProduto/AppCarouselInfinite';
import { AppFooter } from './components/Footer/AppFooter';

import DetalheProdutoPage from './pages/DetalheProdutoPage';
import { AppCarrinho } from './components/Carrinho/AppCarrinho';
import LoginPage from './pages/LoginPage';

// Wrapper para rotas que devem mostrar Navbar + Footer
function Layout({ children }) {
  const location = useLocation();
  const mostrarNavbarFooter = location.pathname !== '/login'; // não mostra em /login
  return (
    <>
      {mostrarNavbarFooter && <AppNavbar />}
      {children}
      {mostrarNavbarFooter && <AppFooter />}
    </>
  );
}

// Componente que bloqueia rota protegida
function RotaProtegida({ children }) {
  const { autenticado } = useAuth();
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function HomePage() {
  return (
    <main style={{ marginTop: '80px' }}>
      <section id="top">
        <AppCarousel />
      </section>
      <section id="fardamentos">
        <AppFardamentos />
      </section>
      <section id="acessorios">
        <AppAcessorios />
      </section>
      <section id="promocao">
        <AppPromocao />
      </section>
      <section id="destaques">
        <AppCarouselInfinite />
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProvedorCarrinho>
          <Layout>
            <Routes>
              {/* Rota de login (página sem Navbar e Footer) */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rotas protegidas */}
              <Route
                path="/"
                element={
                  <RotaProtegida>
                    <HomePage />
                  </RotaProtegida>
                }
              />
              <Route
                path="/produto/:id"
                element={
                  <RotaProtegida>
                    <DetalheProdutoPage />
                  </RotaProtegida>
                }
              />
              <Route
                path="/carrinho"
                element={
                  <RotaProtegida>
                    <AppCarrinho />
                  </RotaProtegida>
                }
              />

              {/* Qualquer outra rota vai para /login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Layout>
        </ProvedorCarrinho>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
