// src/pages/DetalheProdutoPage.js

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DetalheProduto } from '../components/DetalheProduto';
import { produtos } from '../data/produtos';
import { AppNavbar } from '../components/Navbar/AppNavbar';
import { AppFooter } from '../components/Footer/AppFooter';

export default function DetalheProdutoPage() {
  const { id } = useParams();

  const produto = produtos.find(
    (p) => p.id === id || p.id === String(Number(id))
  );

  if (!produto) {
    return <Navigate to="/" replace />;
  }

  return (
    // 1) Tornamos este container um flex de coluna que ocupa 100vh
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '60vh'
    }}>
      {/* 2) Navbar permanece no topo */}
      <AppNavbar />

      {/* 3) O conteúdo principal (DetalheProduto) recebe flex:1 para crescer/ocupar
             o espaço restante entre navbar e footer */}
      <main style={{ flex: 1 }}>
        <DetalheProduto produto={produto} />
      </main>
    </div>
  );
}
