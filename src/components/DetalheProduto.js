// src/components/DetalheProduto.jsx

import React, { useState } from 'react';
import { useCarrinho }   from '../Context/ContextoCarrinho.js';
import { useNavigate }   from 'react-router-dom';

export function DetalheProduto({ produto }) {
  const [indiceImagemPrincipal, setIndiceImagemPrincipal] = useState(0);
  const [tamanhoSelecionado,   setTamanhoSelecionado]   = useState(
    produto.tamanhos?.[0] ?? ''
  );
  const [quantidade, setQuantidade]     = useState(1);
  const [showModal,   setShowModal]     = useState(false);

  const { adicionarAoCarrinho } = useCarrinho();
  const navigate = useNavigate();

  // Ajusta qtd
  const alterarQuantidade = delta => {
    setQuantidade(q => Math.max(1, q + delta));
  };

  // Quando clica “Adicionar ao Carrinho”
  const handleAdicionarAoCarrinho = () => {
    adicionarAoCarrinho({
      id:           produto.id,
      titulo:       produto.titulo,
      preco:        parseFloat(String(produto.preco).replace(',', '.')),
      imagem:       produto.imagens[0],
      corOuTamanho: tamanhoSelecionado,
      quantidade,
    });
    setShowModal(true);
  };

  // Comprar agora leva direto ao carrinho
  const handleComprarAgora = () => {
    adicionarAoCarrinho({
      id:           produto.id,
      titulo:       produto.titulo,
      preco:        parseFloat(String(produto.preco).replace(',', '.')),
      imagem:       produto.imagens[0],
      corOuTamanho: tamanhoSelecionado,
      quantidade,
    });
    navigate('/carrinho');
  };

  // Estilos do modal
  const overlayStyle = {
    position:        'fixed',
    top:             0,
    left:            0,
    width:           '100vw',
    height:          '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          1000,
  };
  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius:    '8px',
    padding:         '24px',
    maxWidth:        '420px',
    width:           '90%',
    textAlign:       'center',
    boxShadow:       '0 2px 10px rgba(0,0,0,0.2)',
  };
  const imgStyle = {
    width:           '100px',
    height:          '100px',
    objectFit:       'cover',
    borderRadius:    '4px',
    marginBottom:    '16px',
  };
  const titleStyle = {
    marginBottom:    '16px',
    fontSize:        '1.1rem',
    color:           '#333',
  };
  const btnGroup = {
    display:         'flex',
    gap:             '8px',
    justifyContent:  'center',
    marginTop:       '16px',
  };
  const btnStyle = {
    flex:            1,
    padding:         '8px 12px',
    border:          'none',
    borderRadius:    '4px',
    cursor:          'pointer',
    fontWeight:      600,
  };
  const btnContinuar = {
    ...btnStyle,
    backgroundColor: '#ddd',
    color:           '#333',
  };
  const btnCarrinho = {
    ...btnStyle,
    backgroundColor: '#FE5A17',
    color:           '#fff',
  };

  return (
    <div style={{ ...estilos.container, marginTop: '80px' }}>
      {/* Voltar */}
      <button onClick={() => window.history.back()} style={estilos.botaoVoltar}>
        ← Voltar
      </button>

      <div style={estilos.wrapperConteudo}>
        {/* Galeria */}
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

        {/* Detalhes */}
        <div style={estilos.detalhes}>
          <h1 style={estilos.titulo}>{produto.titulo}</h1>
          <span style={estilos.categoria}>{produto.categoria}</span>

          <div style={estilos.wrapperPreco}>
            <span style={estilos.labelPreco}>Preço:</span>
            <span style={estilos.valorPreco}>R$ {produto.preco}</span>
          </div>

          {produto.descricao && (
            <p style={estilos.descricao}>{produto.descricao}</p>
          )}
          {produto.dimensao && (
            <p style={estilos.dimensao}>Dimensão: {produto.dimensao}</p>
          )}

          {/* Tamanho */}
          {produto.tamanhos?.length > 0 && (
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

          {/* Quantidade */}
          <div style={estilos.wrapperQuantidade}>
            <label style={estilos.labelQuantidade}>Quantidade:</label>
            <div style={estilos.botoesQuantidade}>
              <button onClick={() => alterarQuantidade(-1)} style={estilos.botaoQtde}>–</button>
              <span style={estilos.valorQtde}>{quantidade}</span>
              <button onClick={() => alterarQuantidade(1)}  style={estilos.botaoQtde}>+</button>
            </div>
          </div>

          {/* Ações */}
          <div style={estilos.wrapperAcoes}>
            <button
              onClick={handleAdicionarAoCarrinho}
              style={estilos.botaoAdicionarCarrinho}
            >
              Adicionar ao Carrinho
            </button>
            <button
              onClick={handleComprarAgora}
              style={estilos.botaoComprarAgora}
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <img
              src={produto.imagens[0]}
              alt={produto.titulo}
              style={imgStyle}
            />
            <div style={titleStyle}>
              {produto.titulo} adicionado com sucesso!
            </div>
            <div style={btnGroup}>
              <button
                style={btnContinuar}
                onClick={() => setShowModal(false)}
              >
                Continuar comprando
              </button>
              <button
                style={btnCarrinho}
                onClick={() => navigate('/carrinho')}
              >
                Ir para o Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
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
  descricao: {
    fontSize: '1rem',
    color: '#444',
    lineHeight: '1.4',
    margin: '1rem 0 0.5rem',
  },
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
