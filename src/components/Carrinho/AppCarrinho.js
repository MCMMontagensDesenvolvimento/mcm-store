// src/components/Carrinho/AppCarrinho.jsx

import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../Context/ContextoCarrinho.js';
import { useAuth } from '../../Context/AuthContext';
import { AppNavbar } from '../Navbar/AppNavbar';
import { AppFooter } from '../Footer/AppFooter';
import emailjs from 'emailjs-com';

const EMAILJS_USER_ID     = 'FR9t1wkY_bT3iLNbS';
const EMAILJS_SERVICE_ID  = 'service_zt8nmnp';
const EMAILJS_TEMPLATE_ID = 'template_n97vxgb';

export function AppCarrinho() {
  // 1) Pega itens do carrinho e funções do contexto
  const {
    itens,
    atualizarQuantidade,
    removerDoCarrinho,
    totalCarrinho,
  } = useCarrinho();

  // 2) Pega dados do usuário logado
  const { usuario } = useAuth();

  // 3) Estados locais 
  const [emailDestino, setEmailDestino] = useState('');
  const [telefone, setTelefone] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  //   → controla exibição da mensagem de falha do e-mail
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  //   → controla exibição do card de sucesso

  // 4) Campos vindos da API (usuário autenticado)
  const nomeCompleto    = usuario?.CON_DssNome       || '';
  const cpfUsuario      = usuario?.CON_NusCICNumero  || '';
  const idCentroCusto   = usuario?.CON_CdiCentroCusto|| '';
  const nomeCentroCusto = usuario?.CCU_D1sCentroCusto|| '';

  // 5) Inicializa o EmailJS com seu “User ID” ao montar o componente
  useEffect(() => {
    emailjs.init(EMAILJS_USER_ID);
  }, []);

  // 6) Função que formata o HTML da lista de itens (tabela com imagens + detalhes)
  const getItensHtml = () => {
    if (!itens || itens.length === 0) {
      return `<p style="font-style: italic; color:#666;">Carrinho vazio</p>`;
    }

    let html = `
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <thead>
          <tr style="background-color: #f5f5f5; text-align: left;">
            <th style="padding: 8px; border: 1px solid #ddd;">Produto</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Cor/Tamanho</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Qtd</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Unit.</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    itens.forEach((item) => {
      const titulo    = item.titulo;
      const corOuTam  = item.corOuTamanho || '–';
      const qtd       = item.quantidade;
      const precoU    = Number(item.preco).toFixed(2);
      const subtotal  = (item.preco * item.quantidade).toFixed(2);

      // Se a URL da imagem não vier completa, prefixe com o domínio público
      const imgUrl = item.imagem.startsWith('http')
        ? item.imagem
        : `http://localhost:3000/${item.imagem}`;

      html += `
        <tr>
          <td style="padding: 2px; border: 1px solid #ddd; vertical-align: middle;">
            <img 
              src="${imgUrl}" 
              alt="${titulo}" 
              width="50" 
              style="vertical-align: middle; margin-right: 8px; object-fit: cover; border: 1px solid #ccc; border-radius: 4px;"
            />
            ${titulo}
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">${corOuTam}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${qtd}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">R$ ${precoU}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">R$ ${subtotal}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    return html;
  };

  // 7) Validação simples de e-mail
  const emailValido = (texto) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
  };

  // 8) Ao submeter o formulário, dispara o envio de e-mail
  const handleSubmit = (e) => {
    e.preventDefault();

    // 8.1) Validações mínimas
    if (!telefone.trim()) {
      alert('Por favor, preencha o telefone antes de enviar.');
      return;
    }
    if (!emailDestino.trim() || !emailValido(emailDestino.trim())) {
      alert('Por favor, informe um e-mail válido antes de enviar.');
      return;
    }

    // 8.2) Prepara envio
    setEnviando(true);
    setFeedbackMsg('');
    setShowFeedback(false);

    // 8.3) Monta os parâmetros que o template do EmailJS irá usar
    const templateParams = {
      to_email:          emailDestino.trim(),                     // {{to_email}}
      nome_completo:     nomeCompleto.trim(),                     // {{nome_completo}}
      cpf:               cpfUsuario.replace(/\D/g, ''),           // {{cpf}}
      telefone:          telefone.replace(/\D/g, ''),             // {{telefone}}
      id_centrocusto:    idCentroCusto.toString(),                // {{id_centrocusto}}
      nome_centrocusto:  nomeCentroCusto.trim(),                  // {{nome_centrocusto}}
      total_carrinho:    totalCarrinho.toFixed(2),                // {{total_carrinho}}
      itens_html:        getItensHtml(),                          // {{{itens_html}}}
    };

    // 8.4) Envia pelo EmailJS
    emailjs
      .send(
        EMAILJS_SERVICE_ID,      // seu Service ID exato
        EMAILJS_TEMPLATE_ID,     // seu Template ID exato
        templateParams
      )
      .then((response) => {
        console.log('EmailJS success:', response.status, response.text);

        // 1) Exibe o card de sucesso
        setShowSuccessCard(true);

        // 2) Após 3 segundos, recarrega a página para zerar carrinho e formulário
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        const erroText = err.text || err.message || 'Tente novamente mais tarde.';
        setFeedbackMsg(`Falha no envio do e-mail: ${erroText}`);
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
          setTimeout(() => {
            setFeedbackMsg('');
          }, 500);
        }, 6000);
      })
      .finally(() => {
        setEnviando(false);
      });
  };

  // 9) Função para remover um item do carrinho
  const handleRemoverItem = (item) => {
    removerDoCarrinho(item.id, item.corOuTamanho);
  };

  // ===== CSS INJETADO PARA A ANIMAÇÃO DO CARD =====
  const animStyles = `
    @keyframes cardSlideUp {
      0% {
        transform: translateY(30px);
        opacity: 0;
      }
      20% {
        transform: translateY(0);
        opacity: 1;
      }
      80% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(-30px);
        opacity: 0;
      }
    }
  `;

  // ====== ESTILOS INLINE ======
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', 
    zIndex: 1050,
  };

  const cardStyle = {
    backgroundColor: '#f0f0f0',        // cinza claro
    border: '2px solid #FE5A17',      // borda laranja
    borderRadius: '8px',
    width: '360px',
    padding: '44px',
    textAlign: 'center',
    animation: 'cardSlideUp 3s ease-out forwards',
  };

  const circleStyle = {
    width: '120px',
    height: '120px',
    backgroundColor: '#FE5A17',       // laranja
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  };

  const checkIconStyle = {
    width: '36px',
    height: '36px',
    fill: '#FFFFFF',                   // check branco
  };

  const messageStyle = {
    marginTop: '12px',
    color: '#black',                  // texto branco
    fontSize: '1rem',
    fontWeight: 700,
  };

  return (
    // → wrapper que ocupa 100vh e força layout em coluna
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <style>{animStyles}</style>

      {/* Navbar no topo */}
      <AppNavbar />

      {/* Conteúdo principal: ocupa todo o espaço disponível (flex:1) */}
      <div
        className="container"
        style={{
          paddingTop: '9rem',
          paddingBottom: '4rem',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <h1 className="text-center mb-4">Carrinho</h1>

        <div className="row">
          {/* ------------------------------------------------------------ */}
          {/* COLUNA ESQUERDA: Formulário de Informações + Envio de E-mail  */}
          {/* ------------------------------------------------------------ */}
          <div className="col-12 col-lg-8 mb-4">
            <form onSubmit={handleSubmit}>
              {/* === Box: Informações do Colaborador === */}
              <div className="card mb-4 border-secondary">
                <div className="card-header bg-white">
                  <strong>Informações do Colaborador</strong>
                </div>
                <div className="card-body">
                  {/* Nome Completo (somente leitura) */}
                  <div className="mb-3">
                    <label htmlFor="nomeCompleto" className="form-label">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="nomeCompleto"
                      name="nomeCompleto"
                      className="form-control"
                      value={nomeCompleto}
                      readOnly
                    />
                  </div>

                  {/* CPF (somente leitura) */}
                  <div className="mb-3">
                    <label htmlFor="cpf" className="form-label">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      className="form-control"
                      value={cpfUsuario}
                      readOnly
                    />
                  </div>

                  {/* E-mail de destino (novo campo) */}
                  <div className="mb-3">
                    <label htmlFor="emailDestino" className="form-label">
                      E-mail <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="emailDestino"
                      name="emailDestino"
                      className="form-control"
                      placeholder="fulano@exemplo.com"
                      value={emailDestino}
                      onChange={(e) => setEmailDestino(e.target.value)}
                      required
                    />
                  </div>

                  {/* Telefone (obrigatório) */}
                  <div className="mb-3">
                    <label htmlFor="telefone" className="form-label">
                      Telefone <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      name="telefone"
                      className="form-control"
                      placeholder="(00) 91234-5678"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Mensagem de feedback (com animação de fade) */}
                  {feedbackMsg && (
                    <div
                      className="feedback-message"
                      style={{
                        marginTop: '1rem',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        backgroundColor: feedbackMsg.startsWith('Falha')
                          ? '#FDE4E1'
                          : '#E6FFED',
                        color: feedbackMsg.startsWith('Falha')
                          ? '#B92D1B'
                          : '#05672B',
                        opacity: showFeedback ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                      }}
                    >
                      {feedbackMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* === Box: Informações MCM (ID e nome Centro de Custo) === */}
              <div className="card mb-4 border-secondary">
                <div className="card-header bg-white">
                  <strong>Informações MCM</strong>
                </div>
                <div className="card-body">
                  {/* Código do Centro de Custo */}
                  <div className="mb-3">
                    <label htmlFor="idCentroCusto" className="form-label">
                      Código do Centro de Custo
                    </label>
                    <input
                      type="text"
                      id="idCentroCusto"
                      name="idCentroCusto"
                      className="form-control"
                      value={idCentroCusto}
                      readOnly
                    />
                  </div>

                  {/* Nome do Centro de Custo */}
                  <div className="mb-3">
                    <label htmlFor="nomeCentroCusto" className="form-label">
                      Nome do Centro de Custo
                    </label>
                    <input
                      type="text"
                      id="nomeCentroCusto"
                      name="nomeCentroCusto"
                      className="form-control"
                      value={nomeCentroCusto}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Botão “Enviar” (envia e-mail) */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: '#FE5A17',
                    color: '#fff',
                    cursor: enviando ? 'not-allowed' : 'pointer',
                  }}
                  disabled={enviando}
                >
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* COLUNA DIREITA: Resumo dos itens do Carrinho */}
          {/* ------------------------------------------------------------ */}
          <div className="col-12 col-lg-4">
            <div className="card border-secondary mb-4">
              <div className="card-header bg-white">
                <strong>Itens</strong>
              </div>
              <div className="card-body">
                {itens.length === 0 && <p>Seu carrinho está vazio.</p>}

                {itens.map((item) => (
                  <div
                    key={`${item.id}-${item.corOuTamanho}`}
                    className="d-flex align-items-center mb-3"
                  >
                    {/* Imagem do produto */}
                    <img
                      src={item.imagem}
                      alt={item.titulo}
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                      className="me-3"
                    />

                    {/* Nome + Cor/Tamanho + Preço + Controles */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span>{item.titulo}</span>
                        <span className="fw-bold">R$ {item.preco.toFixed(2)}</span>
                      </div>
                      <div className="small text-muted">
                        {item.corOuTamanho ? `Tamanho/Cor: ${item.corOuTamanho}` : ''}
                      </div>
                      {/* Controles de quantidade */}
                      <div className="d-flex align-items-center mt-1">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            atualizarQuantidade(item.id, item.corOuTamanho, item.quantidade - 1)
                          }
                        >
                          –
                        </button>
                        <span className="mx-2">{item.quantidade}</span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            atualizarQuantidade(item.id, item.corOuTamanho, item.quantidade + 1)
                          }
                        >
                          +
                        </button>

                        {/* Botão “Remover” */}
                        <button
                          type="button"
                          className="btn btn-link text-danger btn-sm ms-2"
                          onClick={() => handleRemoverItem(item)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <hr />
                {/* Total Geral */}
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">R$ {totalCarrinho.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Overlay com o Card de Sucesso ===== */}
      {showSuccessCard && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <div style={circleStyle}>
              {/* Ícone de “check” branco */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={checkIconStyle}
              >
                <path d="M20.285 6.708l-11.49 11.49-5.082-5.082 1.414-1.414 3.668 3.668 10.076-10.076z" />
              </svg>
            </div>
            <span style={messageStyle}>Pedido enviado com sucesso!</span>
          </div>
        </div>
      )}
    </div>
  );
}
