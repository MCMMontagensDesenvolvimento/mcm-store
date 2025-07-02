// src/components/Carrinho/AppCarrinho.jsx

import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../Context/ContextoCarrinho.js';
import { useAuth }     from '../../Context/AuthContext';
import { AppNavbar }   from '../Navbar/AppNavbar';
import { AppFooter }   from '../Footer/AppFooter';
import emailjs          from 'emailjs-com';

const EMAILJS_USER_ID     = 'FR9t1wkY_bT3iLNbS';
const EMAILJS_SERVICE_ID  = 'service_zt8nmnp';
const EMAILJS_TEMPLATE_ID = 'template_n97vxgb';

export function AppCarrinho() {
  // Contextos
  const { itens, atualizarQuantidade, removerDoCarrinho, totalCarrinho } = useCarrinho();
  const { usuario } = useAuth();

  // Campos colaborador
  const nomeCompleto    = usuario?.CON_DssNome       || '';
  const idContratado    = usuario?.CON_CdiContratado || '';
  const cpfUsuario      = usuario?.CON_NusCICNumero  || '';
  const idCentroCusto   = usuario?.CON_CdiCentroCusto|| '';
  const nomeCentroCusto = usuario?.CCU_D1sCentroCusto|| '';

  // Estados de formulário
  const [emailDestino, setEmailDestino] = useState('');
  const [telefone,     setTelefone]     = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [errorTermos,  setErrorTermos]  = useState('');

  // Feedback de envio
  const [enviando,     setEnviando]     = useState(false);
  const [feedbackMsg,  setFeedbackMsg]  = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Card de sucesso
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // Modal de termos
  const [showModal, setShowModal] = useState(false);

  // Inicializa EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_USER_ID);
  }, []);

  // Valida e-mail simples
  const emailValido = texto => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);

  // Monta HTML dos itens para o template
  const getItensHtml = () => {
    if (!itens.length) {
      return `<p style="font-style:italic;color:#666;">Carrinho vazio</p>`;
    }
    let html = `
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;border:1px solid #ddd;">Produto</th>
            <th style="padding:8px;border:1px solid #ddd;">Cor/Tamanho</th>
            <th style="padding:8px;border:1px solid #ddd;">Qtd</th>
            <th style="padding:8px;border:1px solid #ddd;">Unit.</th>
            <th style="padding:8px;border:1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;
    itens.forEach(item => {
      const precoU   = Number(item.preco).toFixed(2);
      const subtotal = (item.preco * item.quantidade).toFixed(2);
      const imgUrl   = item.imagem.startsWith('http')
        ? item.imagem
        : `https://mcmstore.mcmmontagens.com.br/${item.imagem}`;
      html += `
        <tr>
          <td style="padding:4px;border:1px solid #ddd;">
            <img src="${imgUrl}" width="40" style="vertical-align:middle;margin-right:8px;border:1px solid #ccc;border-radius:4px;" />
            ${item.titulo}
          </td>
          <td style="padding:4px;border:1px solid #ddd;">${item.corOuTamanho || '–'}</td>
          <td style="padding:4px;border:1px solid #ddd;text-align:center;">${item.quantidade}</td>
          <td style="padding:4px;border:1px solid #ddd;text-align:right;">R$ ${precoU}</td>
          <td style="padding:4px;border:1px solid #ddd;text-align:right;">R$ ${subtotal}</td>
        </tr>
      `;
    });
    html += `
        </tbody>
      </table>
    `;
    return html;
  };

  // Envio do formulário
  const handleSubmit = e => {
    e.preventDefault();
    setErrorTermos('');
    if (!aceitaTermos) {
      setErrorTermos('Você precisa aceitar os Termos de Autorização.');
      return;
    }
    if (!telefone.trim()) {
      alert('Preencha o telefone.');
      return;
    }
    if (!emailDestino.trim() || !emailValido(emailDestino.trim())) {
      alert('Informe um e-mail válido.');
      return;
    }

    setEnviando(true);
    setFeedbackMsg('');
    setShowFeedback(false);

    const templateParams = {
      to_email:         emailDestino.trim(),
      id_contratado:    idContratado,     
      nome_completo:    nomeCompleto,
      cpf:              cpfUsuario.replace(/\D/g, ''),
      telefone:         telefone.replace(/\D/g, ''),
      id_centrocusto:   idCentroCusto.toString(),
      nome_centrocusto: nomeCentroCusto,
      total_carrinho:   totalCarrinho.toFixed(2),
      itens_html:       getItensHtml(),
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        setShowSuccessCard(true);
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch(err => {
        console.error(err);
        setFeedbackMsg('Falha no envio. Tente mais tarde.');
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 5000);
      })
      .finally(() => setEnviando(false));
  };

  // Remove item
  const handleRemoverItem = item => {
    removerDoCarrinho(item.id, item.corOuTamanho);
  };

  // ===== keyframes para animação do card de sucesso =====
  const animStyles = `
    @keyframes cardSlideUp {
      0%   { transform: translateY(30px); opacity:0; }
      20%  { transform: translateY(0);  opacity:1; }
      80%  { transform: translateY(0);  opacity:1; }
      100% { transform: translateY(-30px); opacity:0; }
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideDown { from { opacity:0; transform: translateY(-20px) } to { opacity:1; transform: translateY(0) } }
  `;

  // ===== estilos inline =====
  const overlayStyle = {
    position: 'fixed', top:0, left:0, width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center',
    justifyContent:'center', zIndex:1050, pointerEvents:'none'
  };
  const cardStyle = {
    background:'#f0f0f0', border:'2px solid #FE5A17',
    borderRadius:8, padding:44, width:360, textAlign:'center',
    animation:'cardSlideUp 3s ease-out forwards'
  };
  const circleStyle = {
    width:120, height:120, backgroundColor:'#FE5A17',
    borderRadius:'50%', display:'flex', alignItems:'center',
    justifyContent:'center', margin:'0 auto'
  };
  const checkIconStyle = { width:36, height:36, fill:'#fff' };
  const messageStyle   = { marginTop:12, color:'#333', fontWeight:700 };

  // ===== Modal de Termos =====
  const modalOverlay = {
    position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
    background:'rgba(0,0,0,0.5)', display:'flex',
    alignItems:'center', justifyContent:'center', zIndex:1100,
    animation:'fadeIn 0.3s ease'
  };
  const modalContent = {
    background:'#fff', padding:24, borderRadius:10,
    maxWidth:400, width:'90%', boxShadow:'0 8px 24px rgba(0,0,0,0.2)',
    display:'flex', flexDirection:'column', gap:16,
    transform:'translateY(-20px)', animation:'slideDown 0.3s ease forwards'
  };
  const modalHeader = {
    margin:0, fontSize:'1.25rem', fontWeight:700,
    color:'#FE5A17', textAlign:'center'
  };
  const modalBody = {
    fontSize:'1rem', lineHeight:1.5, color:'#333'
  };
  const modalFooter = {
    display:'flex', justifyContent:'flex-end', gap:8, marginTop:8
  };
  const btnPrimary = {
    padding:'8px 16px', backgroundColor:'#FE5A17',
    color:'#fff', border:'none', borderRadius:4,
    cursor:'pointer', fontWeight:600
  };
  const btnSecondary = {
    padding:'8px 16px', background:'transparent',
    color:'#FE5A17', border:'1px solid #FE5A17',
    borderRadius:4, cursor:'pointer', fontWeight:600
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <style>{animStyles}</style>
      <AppNavbar/>

      <div className="container" style={{ paddingTop:'5rem', flex:1, overflowY:'auto' }}>
        <h1 className="text-center mb-4">Carrinho</h1>

        <div className="row">
          {/* — Formulário — */}
          <div className="col-12 col-lg-8 mb-4">
            <form onSubmit={handleSubmit}>
              {/* Informações do Colaborador */}
              <div className="card mb-4 border-secondary">
                <div className="card-header"><strong>Informações do Colaborador</strong></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Nome Completo</label>
                    <input className="form-control" readOnly value={nomeCompleto}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Id Contratado</label>
                    <input className="form-control" readOnly value={idContratado}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">CPF</label>
                    <input className="form-control" readOnly value={cpfUsuario}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-mail <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      placeholder="seunome@email.com"
                      className="form-control"
                      value={emailDestino}
                      onChange={e => setEmailDestino(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefone <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      placeholder="(00) 9 0000-0000"
                      className="form-control"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Informações MCM */}
              <div className="card mb-4 border-secondary">
                <div className="card-header"><strong>Informações MCM</strong></div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Código do Centro de Custo</label>
                    <input className="form-control" readOnly value={idCentroCusto}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nome do Centro de Custo</label>
                    <input className="form-control" readOnly value={nomeCentroCusto}/>
                  </div>
                </div>
              </div>

              {/* Checkbox de Termos */}
              <div className="form-check mb-2">
                <input
                  id="termosCheck"
                  type="checkbox"
                  className="form-check-input"
                  checked={aceitaTermos}
                  onChange={e => {
                    setAceitaTermos(e.target.checked);
                    if (e.target.checked) setErrorTermos('');
                  }}
                />
                <label htmlFor="termosCheck" className="form-check-label">
                  Li e aceito os{' '}
                  <a href="#" onClick={e => { e.preventDefault(); setShowModal(true); }}>
                    Termos de Autorização
                  </a>
                  <span className="text-danger"> *</span>
                </label>
              </div>
              {errorTermos && <div className="text-danger mb-3">{errorTermos}</div>}

              {/* Botão Enviar */}
              <div className="d-grid mb-5">
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor:'#FE5A17' }}
                  disabled={enviando}
                >
                  {enviando ? 'Enviando…' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>

          {/* — Resumo dos Itens — */}
          <div className="col-12 col-lg-4">
            <div className="card border-secondary mb-4">
              <div className="card-header"><strong>Itens</strong></div>
              <div className="card-body">
                {itens.length === 0 && <p>Seu carrinho está vazio.</p>}
                {itens.map(item => (
                  <div key={`${item.id}-${item.corOuTamanho}`} className="d-flex align-items-center mb-3">
                    <img
                      src={item.imagem}
                      alt={item.titulo}
                      width={64}
                      height={64}
                      style={{ objectFit:'cover', borderRadius:4 }}
                      className="me-3"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong>{item.titulo}</strong>
                        <strong>R$ {item.preco.toFixed(2)}</strong>
                      </div>
                      <small className="text-muted">
                        {item.corOuTamanho && `Tamanho/Cor: ${item.corOuTamanho}`}
                      </small>
                      <div className="d-flex align-items-center mt-1">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => atualizarQuantidade(item.id, item.corOuTamanho, item.quantidade - 1)}
                        >–</button>
                        <span className="mx-2">{item.quantidade}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => atualizarQuantidade(item.id, item.corOuTamanho, item.quantidade + 1)}
                        >+</button>
                        <button
                          className="btn btn-link text-danger btn-sm ms-2"
                          onClick={() => handleRemoverItem(item)}
                        >Remover</button>
                      </div>
                    </div>
                  </div>
                ))}
                <hr/>
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>R$ {totalCarrinho.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* — Modal de Termos — */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={modalHeader}>Termos de Autorização</h2>
            <div style={modalBody}>
              Declaro estar ciente e de acordo com os valores e condições
              da compra realizada na MCM Store, autorizando que o referido
              desconto seja efetuado. <br/><br/>
              <strong>Regra de Parcelamento:</strong><br/>
              Compras acima de R$50 serão automaticamente divididas em 2x.
            </div>
            <div style={modalFooter}>
              <button
                style={btnSecondary}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                style={btnPrimary}
                onClick={() => {
                  setAceitaTermos(true);
                  setErrorTermos('');
                  setShowModal(false);
                }}
              >
                Aceitar Termos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* — Card de sucesso — */}
      {showSuccessCard && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <div style={circleStyle}>
              <svg viewBox="0 0 24 24" style={checkIconStyle}>
                <path d="M20.285 6.708l-11.49 11.49-5.082-5.082 1.414-1.414 3.668 3.668 10.076-10.076z" />
              </svg>
            </div>
            <div style={messageStyle}>Pedido enviado com sucesso!</div>
          </div>
        </div>
      )}
    </div>
  );
}
