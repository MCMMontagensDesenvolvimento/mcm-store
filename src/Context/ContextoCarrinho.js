// src/context/ContextoCarrinho.js
import React, { createContext, useContext, useState } from 'react';

// 1) Cria o Contexto em si
const ContextoCarrinho = createContext();

// 2) Exporta um hook de conveniência para acessar o contexto
export function useCarrinho() {
  return useContext(ContextoCarrinho);
}

// 3) Define o Provider (envolverá toda a aplicação em App.js)
export function ProvedorCarrinho({ children }) {
  // Estado interno: lista de itens do carrinho
  // Cada item terá { id, titulo, preco, imagem, corOuTamanho, quantidade }
  const [itens, setItens] = useState([]);

  // 3.1) Função para adicionar um produto ao carrinho
  // Se já existir (mesmo id e mesmo cor/tamanho), soma a quantidade
  const adicionarAoCarrinho = ({ id, titulo, preco, imagem, corOuTamanho, quantidade }) => {
    setItens(prevItens => {
      // Verifica se já existe algum item igual
      const indiceExiste = prevItens.findIndex(
        item => item.id === id && item.corOuTamanho === corOuTamanho
      );

      if (indiceExiste >= 0) {
        // Já existe: atualiza quantidade
        const novos = [...prevItens];
        novos[indiceExiste] = {
          ...novos[indiceExiste],
          quantidade: novos[indiceExiste].quantidade + quantidade,
        };
        return novos;
      } else {
        return [
          ...prevItens,
          {
            id,
            titulo,
            preco,
            imagem,
            corOuTamanho,
            quantidade,
          },
        ];
      }
    });
  };
  
  const removerDoCarrinho = (id, corOuTamanho) => {
    setItens(prevItens =>
      prevItens.filter(
        item => !(item.id === id && item.corOuTamanho === corOuTamanho)
      )
    );
  };

  // 3.3) Função para atualizar a quantidade de um item específico
  const atualizarQuantidade = (id, corOuTamanho, novaQuantidade) => {
    setItens(prevItens =>
      prevItens.map(item => {
        if (item.id === id && item.corOuTamanho === corOuTamanho) {
          return { ...item, quantidade: novaQuantidade < 1 ? 1 : novaQuantidade };
        }
        return item;
      })
    );
  };

  // 3.4) Calcula a quantidade total de itens (para o badge no Navbar)
  const qtdCarrinho = itens.reduce((acum, item) => acum + item.quantidade, 0);

  // 3.5) Calcula o valor total do carrinho (para exibir no resumo)
  const totalCarrinho = itens.reduce(
    (acum, item) => acum + item.preco * item.quantidade,
    0
  );

  // 3.6) Objeto “value” que ficará disponível a todos os filhos do provider
  const value = {
    itens,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    qtdCarrinho,
    totalCarrinho,
  };

  return (
    <ContextoCarrinho.Provider value={value}>
      {children}
    </ContextoCarrinho.Provider>
  );
}
