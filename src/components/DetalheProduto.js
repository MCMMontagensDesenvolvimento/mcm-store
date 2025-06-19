// src/components/DetalheProduto.jsx

import React, { useState } from 'react';
import { useCarrinho } from '../Context/ContextoCarrinho.js';
import { useNavigate } from 'react-router-dom';

export function DetalheProduto({ produto }) {
  const [indiceImagemPrincipal, setIndiceImagemPrincipal] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(
    produto.tamanhos && produto.tamanhos.length > 0
      ? produto.tamanhos[0]
      : ''
  );
  const [quantidade, setQuantidade] = useState(1);

  const { adicionarAoCarrinho } = useCarrinho();
  const navigate = useNavigate();

  const alterarQuantidade = (delta) => {
    setQuantidade(q => {
      const novo = q + delta;
      return novo < 1 ? 1 : novo;
    });
  };

  const handleAdicionarAoCarrinho = () => {
    adicionarAoCarrinho({
      id: produto.id,
      titulo: produto.titulo,
      preco: parseFloat(String(produto.preco).replace(',', '.')),
      imagem: produto.imagens[0],
      corOuTamanho: tamanhoSelecionado,
      quantidade,
    });
  };

  const handleComprarAgora = () => {
    adicionarAoCarrinho({
      id: produto.id,
      titulo: produto.titulo,
      preco: parseFloat(String(produto.preco).replace(',', '.')),
      imagem: produto.imagens[0],
      corOuTamanho: tamanhoSelecionado,
      quantidade,
    });
    navigate('/carrinho');
  };

  return (
    <div style={{ ...estilos.container, marginTop: '80px' }}>
      {/* Botão “Voltar” */}
      <button
        onClick={() => window.history.back()}
        style={estilos.botaoVoltar}
      >
        ← Voltar
      </button>

      <div style={estilos.wrapperConteudo}>
        {/* === Galeria de Imagens === */}
        <div style={estilos.galeria}>
          <img
            src={produto.imagens[indiceImagemPrincipal]}
            alt={produto.titulo}
            style={estilos.imagemPrincipal}
          />

          <div style={estilos.wrapperMiniaturas}>
            {produto.imagens.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`${produto.titulo} ${idx}`}
                style={{
                  ...estilos.miniatura,
                  border:
                    idx === indiceImagemPrincipal
                      ? '2px solid #FE5B17'
                      : '2px solid transparent',
                }}
                onClick={() => setIndiceImagemPrincipal(idx)}
              />
            ))}
          </div>
        </div>

        {/* === Detalhes do Produto === */}
        <div style={estilos.detalhes}>
          <h1 style={estilos.titulo}>{produto.titulo}</h1>
          <span style={estilos.categoria}>{produto.categoria}</span>

          <div style={estilos.wrapperPreco}>
            <span style={estilos.labelPreco}>Preço:</span>
            <span style={estilos.valorPreco}>R$ {produto.preco}</span>
          </div>

          {/* —— AQUI COMEÇAM AS DUAS LINHAS NOVAS PARA EXIBIR A DESCRIÇÃO E DIMENSÃO —— */}
          {produto.descricao && (
            <p style={estilos.descricao}>{produto.descricao}</p>
          )}
          {produto.dimensao && (
            <p style={estilos.dimensao}>Dimensão: {produto.dimensao}</p>
          )}
          {/* —— FIM DAS DUAS LINHAS NOVAS —— */}

          {produto.tamanhos && produto.tamanhos.length > 0 && (
            <div style={estilos.wrapperTamanho}>
              <label htmlFor="seletor-tamanho" style={estilos.labelTamanho}>
                Tamanho:
              </label>
              <select
                id="seletor-tamanho"
                value={tamanhoSelecionado}
                onChange={e => setTamanhoSelecionado(e.target.value)}
                style={estilos.selectTamanho}
              >
                {produto.tamanhos.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={estilos.wrapperQuantidade}>
            <label style={estilos.labelQuantidade}>Quantidade:</label>
            <div style={estilos.botoesQuantidade}>
              <button
                onClick={() => alterarQuantidade(-1)}
                style={estilos.botaoQtde}
              >
                –
              </button>
              <span style={estilos.valorQtde}>{quantidade}</span>
              <button
                onClick={() => alterarQuantidade(1)}
                style={estilos.botaoQtde}
              >
                +
              </button>
            </div>
          </div>

          <div style={estilos.wrapperAcoes}>
            {/* Botão Adicionar ao Carrinho */}
            <button
              onClick={handleAdicionarAoCarrinho}
              style={estilos.botaoAdicionarCarrinho}
            >
              Adicionar ao Carrinho
            </button>

            {/* Botão Comprar Agora */}
            <button
              onClick={handleComprarAgora}
              style={estilos.botaoComprarAgora}
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const estilos = {
  container: {
    fontFamily: "'Montserrat', sans-serif",
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  botaoVoltar: {
    background: 'transparent',
    border: 'none',
    color: '#FE5B17',
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  wrapperConteudo: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  galeria: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imagemPrincipal: {
    width: '100%',
    maxWidth: '800px',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  wrapperMiniaturas: {
    marginTop: '1rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  miniatura: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  detalhes: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  titulo: {
    fontSize: '2rem',
    margin: 0,
    color: '#333',
  },
  categoria: {
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    color: '#868686',
  },
  wrapperPreco: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
  },
  labelPreco: {
    fontSize: '1rem',
    color: '#555',
  },
  valorPreco: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FE5A17',
  },
  // Estilo adicional para a descrição (opcional)
  descricao: {
    fontSize: '1rem',
    color: '#444',
    lineHeight: '1.4',
    margin: '1rem 0 0.5rem 0',
  },
  // Estilo adicional para a dimensão (opcional)
  dimensao: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
  },
  wrapperTamanho: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  labelTamanho: {
    fontSize: '1rem',
    color: '#555',
  },
  selectTamanho: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  wrapperQuantidade: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  labelQuantidade: {
    fontSize: '1rem',
    color: '#555',
  },
  botoesQuantidade: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  botaoQtde: {
    width: '32px',
    height: '32px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorQtde: {
    minWidth: '24px',
    textAlign: 'center',
  },
  wrapperAcoes: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  botaoAdicionarCarrinho: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #FE5B17',
    background: 'white',
    color: '#FE5B17',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  botaoComprarAgora: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: 'none',
    background: '#FE5B17',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1rem',
  },
};
